import pool from '../config/database.js';
import { recordAudit } from '../config/audit.js';
import { invalidate, getAllSettings } from '../config/settings.js';

/*
 * Settings — the values that used to be constants in the controllers.
 * Keys are fixed by the seed; this API updates values, it does not invent keys.
 */

const TYPES = ['string', 'number', 'boolean', 'json'];

const shape = (row) => ({
  setting_key: row.setting_key,
  setting_value: row.setting_value,
  value_type: row.value_type,
  category: row.category,
  description: row.description,
  updated_at: row.updated_at
});

/** Reject values that do not match the key's declared type. */
const validateValue = (value, type) => {
  if (value === null || value === undefined || value === '') {
    return { error: 'A value is required' };
  }
  const str = String(value);

  if (type === 'number') {
    const n = Number(str);
    if (!Number.isFinite(n)) return { error: 'This setting must be a number' };
    if (n < 0) return { error: 'This setting cannot be negative' };
  }
  if (type === 'boolean' && !['true', 'false', '0', '1'].includes(str.toLowerCase())) {
    return { error: 'This setting must be true or false' };
  }
  if (type === 'json') {
    try { JSON.parse(str); } catch { return { error: 'This setting must be valid JSON' }; }
  }
  return { value: str };
};

// GET /api/settings?category=
export const listSettings = async (req, res) => {
  try {
    const params = [];
    let where = '';
    if (req.query.category) {
      params.push(String(req.query.category));
      where = 'WHERE category = $1';
    }

    const result = await pool.query(
      `SELECT * FROM app_settings ${where} ORDER BY category ASC, setting_key ASC`,
      params
    );

    // Grouped by category so a settings screen can render sections directly.
    const grouped = {};
    result.rows.forEach((row) => {
      (grouped[row.category] = grouped[row.category] || []).push(shape(row));
    });

    res.status(200).json({
      success: true,
      data: result.rows.map(shape),
      grouped
    });
  } catch (error) {
    console.error('Error listing settings:', error);
    res.status(500).json({ success: false, message: 'Error fetching settings' });
  }
};

// GET /api/settings/:key
export const getSettingByKey = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM app_settings WHERE setting_key = $1',
      [req.params.key]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    res.status(200).json({ success: true, data: shape(result.rows[0]) });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ success: false, message: 'Error fetching setting' });
  }
};

// PUT /api/settings/:key   { value }
export const updateSetting = async (req, res) => {
  try {
    const key = req.params.key;
    const existing = await pool.query(
      'SELECT * FROM app_settings WHERE setting_key = $1',
      [key]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }

    const parsed = validateValue(req.body?.value, existing.rows[0].value_type);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const result = await pool.query(
      `UPDATE app_settings
       SET setting_value = $1, updated_at = CURRENT_TIMESTAMP
       WHERE setting_key = $2
       RETURNING *`,
      [parsed.value, key]
    );

    invalidate();   // next read comes from the database, not the stale cache

    // Keep the old value: "who changed the hourly rate, and from what" is a
    // question that only has an answer if the previous figure was recorded.
    await recordAudit(req, {
      action: 'setting.update',
      category: 'settings',
      entity: 'setting',
      entity_id: key,
      sensitive: true,
      summary: `Changed ${key} from ${existing.rows[0].setting_value} to ${parsed.value}`,
      meta: { from: existing.rows[0].setting_value, to: parsed.value }
    });

    res.status(200).json({
      success: true,
      message: 'Setting updated',
      data: shape(result.rows[0])
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, message: 'Error updating setting' });
  }
};

// PUT /api/settings   { settings: { key: value, ... } }
export const updateSettings = async (req, res) => {
  const client = await pool.connect();
  try {
    const payload = req.body?.settings;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, message: 'Provide a settings object' });
    }

    const keys = Object.keys(payload);
    if (!keys.length) {
      return res.status(400).json({ success: false, message: 'No settings supplied' });
    }

    await client.query('BEGIN');
    const updated = [];

    for (const key of keys) {
      const existing = await client.query(
        'SELECT value_type FROM app_settings WHERE setting_key = $1',
        [key]
      );
      if (existing.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ success: false, message: `Unknown setting: ${key}` });
      }

      const parsed = validateValue(payload[key], existing.rows[0].value_type);
      if (parsed.error) {
        await client.query('ROLLBACK');
        return res.status(400).json({ success: false, message: `${key}: ${parsed.error}` });
      }

      const row = await client.query(
        `UPDATE app_settings
         SET setting_value = $1, updated_at = CURRENT_TIMESTAMP
         WHERE setting_key = $2 RETURNING *`,
        [parsed.value, key]
      );
      updated.push(shape(row.rows[0]));
    }

    await client.query('COMMIT');
    invalidate();

    await recordAudit(req, {
      action: 'setting.update_many',
      category: 'settings',
      entity: 'setting',
      entity_id: keys.join(','),
      sensitive: true,
      summary: `Changed ${updated.length} setting(s): ` +
        updated.map((s) => `${s.setting_key}=${s.setting_value}`).join(', '),
      meta: { keys, values: payload }
    });

    res.status(200).json({
      success: true,
      message: `${updated.length} setting(s) updated`,
      data: updated
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Error updating settings' });
  } finally {
    client.release();
  }
};

// GET /api/settings/effective — resolved values, as the app actually sees them
export const effectiveSettings = async (req, res) => {
  try {
    const all = await getAllSettings();
    const out = {};
    Object.keys(all).forEach((key) => { out[key] = all[key].value; });
    res.status(200).json({ success: true, data: out });
  } catch (error) {
    console.error('Error resolving settings:', error);
    res.status(500).json({ success: false, message: 'Error resolving settings' });
  }
};

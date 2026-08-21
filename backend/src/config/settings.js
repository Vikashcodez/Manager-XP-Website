import pool from './database.js';

/*
 * Settings accessor.
 *
 * Controllers used to carry these values as constants, which meant changing a
 * rate needed a code edit and a restart. They now live in app_settings and are
 * read through here.
 *
 * Reads are cached briefly so a hot path does not hit the database on every
 * request, and the cache is cleared whenever a setting is written.
 */

const CACHE_TTL_MS = 30000;

let cache = null;
let cachedAt = 0;

const coerce = (value, type) => {
  if (value === null || value === undefined) return null;
  switch (type) {
    case 'number': {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case 'boolean':
      return value === 'true' || value === '1';
    case 'json':
      try { return JSON.parse(value); } catch { return null; }
    default:
      return value;
  }
};

/** Load every setting into the cache. */
const loadAll = async () => {
  const result = await pool.query('SELECT * FROM app_settings');
  cache = {};
  result.rows.forEach((row) => {
    cache[row.setting_key] = {
      value: coerce(row.setting_value, row.value_type),
      raw: row.setting_value,
      type: row.value_type,
      category: row.category,
      description: row.description,
      updated_at: row.updated_at
    };
  });
  cachedAt = Date.now();
  return cache;
};

const ensureFresh = async () => {
  if (cache && Date.now() - cachedAt < CACHE_TTL_MS) return cache;
  return loadAll();
};

/**
 * Read one setting. `fallback` covers the window before the table is seeded,
 * so a fresh database can still serve requests.
 */
export const getSetting = async (key, fallback = null) => {
  try {
    const all = await ensureFresh();
    const entry = all[key];
    return entry && entry.value !== null ? entry.value : fallback;
  } catch (error) {
    console.error(`[settings] read failed for ${key}:`, error.message);
    return fallback;
  }
};

/** Read several at once — one cache hit rather than several. */
export const getSettings = async (keys) => {
  const all = await ensureFresh().catch(() => ({}));
  const out = {};
  keys.forEach((key) => { out[key] = all[key] ? all[key].value : null; });
  return out;
};

export const getAllSettings = async () => ensureFresh();

/** Write a setting and drop the cache so the next read is authoritative. */
export const setSetting = async (key, value) => {
  const result = await pool.query(
    `UPDATE app_settings
     SET setting_value = $1, updated_at = CURRENT_TIMESTAMP
     WHERE setting_key = $2
     RETURNING *`,
    [value === null || value === undefined ? null : String(value), key]
  );
  invalidate();
  return result.rows[0] || null;
};

export const invalidate = () => {
  cache = null;
  cachedAt = 0;
};

export default { getSetting, getSettings, getAllSettings, setSetting, invalidate };

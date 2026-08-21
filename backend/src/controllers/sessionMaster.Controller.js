import pool from '../config/database.js';

/*
 * Session Master — the sellable gaming durations.
 *
 * duration_minutes is always computed here, never accepted from the client, so
 * "2 Hours" can never be stored as anything other than 120 minutes.
 */

const DURATION_TYPES = ['MINUTES', 'HOURS', 'CUSTOM', 'UNLIMITED'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

/** Minutes for a given type/duration pair, or null for unlimited. */
const toMinutes = (type, duration) => {
  if (type === 'UNLIMITED') return null;
  if (type === 'HOURS') return duration * 60;
  return duration;            // MINUTES and CUSTOM are already minutes
};

const shape = (row) => ({
  session_master_id: row.id,
  id: row.id,
  session_name: row.session_name,
  duration_type: row.duration_type,
  duration: row.duration === null ? null : Number(row.duration),
  duration_minutes: row.duration_minutes === null ? null : Number(row.duration_minutes),
  is_unlimited: row.duration_type === 'UNLIMITED',
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,
  price_count: row.price_count === undefined ? undefined : Number(row.price_count)
});

/** Shared field validation for create and update. */
const validate = (body) => {
  const name = (body.session_name || '').trim();
  if (!name) return { error: 'Session name is required' };
  if (name.length > 255) return { error: 'Session name is too long' };

  const type = String(body.duration_type || '').toUpperCase();
  if (!DURATION_TYPES.includes(type)) {
    return { error: `Duration type must be one of ${DURATION_TYPES.join(', ')}` };
  }

  if (type === 'UNLIMITED') {
    return { name, type, duration: null, minutes: null };
  }

  const duration = Number(body.duration);
  if (!Number.isInteger(duration) || duration < 1) {
    return { error: 'Duration must be a whole number of at least 1' };
  }
  const minutes = toMinutes(type, duration);
  if (minutes > 60 * 24 * 30) {
    return { error: 'Duration is unrealistically long' };
  }

  return { name, type, duration, minutes };
};

// POST /api/session-master
export const createSession = async (req, res) => {
  try {
    const parsed = validate(req.body || {});
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const status = STATUSES.includes(String(req.body?.status || '').toUpperCase())
      ? String(req.body.status).toUpperCase()
      : 'ACTIVE';

    const result = await pool.query(
      `INSERT INTO session_master (session_name, duration_type, duration, duration_minutes, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [parsed.name, parsed.type, parsed.duration, parsed.minutes, status]
    );

    res.status(201).json({
      success: true,
      message: 'Session created',
      data: shape(result.rows[0])
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'A session with that name already exists' });
    }
    console.error('Error creating session master:', error);
    res.status(500).json({ success: false, message: 'Error creating session' });
  }
};

// GET /api/session-master?status=&search=&limit=&offset=
export const listSessions = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const filters = [];
    const params = [];

    if (req.query.status) {
      params.push(String(req.query.status).toUpperCase());
      filters.push(`s.status = $${params.length}`);
    }
    if (req.query.search) {
      params.push(`%${String(req.query.search).trim()}%`);
      filters.push(`s.session_name ILIKE $${params.length}`);
    }
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const listParams = [...params, limit, offset];

    // price_count tells the UI whether deleting would take prices with it.
    const result = await pool.query(
      `SELECT s.*, COUNT(gp.id)::int AS price_count
       FROM session_master s
       LEFT JOIN gaming_prices gp ON gp.session_master_id = s.id
       ${where}
       GROUP BY s.id
       ORDER BY
         CASE WHEN s.duration_minutes IS NULL THEN 1 ELSE 0 END,
         s.duration_minutes ASC,
         s.id ASC
       LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    );

    const total = await pool.query(
      `SELECT COUNT(*)::int AS count FROM session_master s ${where}`,
      params
    );

    res.status(200).json({
      success: true,
      data: result.rows.map(shape),
      pagination: { limit, offset, total: total.rows[0].count }
    });
  } catch (error) {
    console.error('Error listing session master:', error);
    res.status(500).json({ success: false, message: 'Error fetching sessions' });
  }
};

// GET /api/session-master/:id
export const getSessionById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id' });
    }
    const result = await pool.query('SELECT * FROM session_master WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.status(200).json({ success: true, data: shape(result.rows[0]) });
  } catch (error) {
    console.error('Error fetching session master:', error);
    res.status(500).json({ success: false, message: 'Error fetching session' });
  }
};

// PUT /api/session-master/:id
export const updateSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id' });
    }

    const existing = await pool.query('SELECT id FROM session_master WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const parsed = validate(req.body || {});
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const status = STATUSES.includes(String(req.body?.status || '').toUpperCase())
      ? String(req.body.status).toUpperCase()
      : undefined;

    const result = await pool.query(
      `UPDATE session_master
       SET session_name = $1, duration_type = $2, duration = $3, duration_minutes = $4,
           status = COALESCE($5, status), updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 RETURNING *`,
      [parsed.name, parsed.type, parsed.duration, parsed.minutes, status || null, id]
    );

    res.status(200).json({ success: true, message: 'Session updated', data: shape(result.rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'A session with that name already exists' });
    }
    console.error('Error updating session master:', error);
    res.status(500).json({ success: false, message: 'Error updating session' });
  }
};

// PATCH /api/session-master/:id/status
export const setSessionStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const status = String(req.body?.status || '').toUpperCase();
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACTIVE or INACTIVE' });
    }

    const result = await pool.query(
      `UPDATE session_master SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      message: status === 'ACTIVE' ? 'Session activated' : 'Session deactivated',
      data: shape(result.rows[0])
    });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// DELETE /api/session-master/:id
export const deleteSession = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Deleting would cascade to its prices, so say so rather than silently
    // taking them. `force=true` is the deliberate override.
    const priced = await pool.query(
      'SELECT COUNT(*)::int AS count FROM gaming_prices WHERE session_master_id = $1',
      [id]
    );
    if (priced.rows[0].count > 0 && req.query.force !== 'true') {
      return res.status(409).json({
        success: false,
        message: `This session has ${priced.rows[0].count} price(s) configured. Deactivate it instead, or delete with force=true.`,
        data: { price_count: priced.rows[0].count }
      });
    }

    const result = await pool.query('DELETE FROM session_master WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session master:', error);
    res.status(500).json({ success: false, message: 'Error deleting session' });
  }
};

import pool from '../config/database.js';

/*
 * Gaming Price Master — one price per game + session pair.
 *
 * The catalogue of games is software_master, so software_id fills the game_id
 * role. Nothing here duplicates a name or a duration: every display value is
 * joined back from the masters, so renaming a game or correcting a duration
 * needs one edit, not a sweep through the price table.
 */

const STATUSES = ['ACTIVE', 'INACTIVE'];

const SELECT_PRICE = `
  SELECT gp.*,
         sm.software_name,
         sm.software_icon,
         sm.category             AS software_category,
         sm.is_active            AS software_active,
         s.session_name,
         s.duration_type,
         s.duration,
         s.duration_minutes,
         s.status                AS session_status
  FROM gaming_prices gp
  JOIN software_master sm ON sm.software_id = gp.software_id
  JOIN session_master  s  ON s.id = gp.session_master_id
`;

const shape = (row) => ({
  price_id: row.id,
  id: row.id,

  // stored
  software_id: row.software_id,
  session_master_id: row.session_master_id,
  price: Number(row.price),
  currency: row.currency,
  status: row.status,
  created_at: row.created_at,
  updated_at: row.updated_at,

  // joined for display only — never stored on gaming_prices
  software_name: row.software_name,
  software_icon: row.software_icon,
  /* Lets the till group rates by PC / PS5 / Pool / Darts without a second
     request per tile. */
  category: row.software_category,
  software_active: row.software_active,
  session_name: row.session_name,
  duration_type: row.duration_type,
  duration: row.duration === null ? null : Number(row.duration),
  duration_minutes: row.duration_minutes === null ? null : Number(row.duration_minutes),
  is_unlimited: row.duration_type === 'UNLIMITED',
  session_status: row.session_status
});

/**
 * Both references must exist and be active — a price against a retired game or
 * a withdrawn session would never be sellable.
 */
const checkReferences = async (client, softwareId, sessionId) => {
  const software = await client.query(
    'SELECT software_id, software_name, is_active FROM software_master WHERE software_id = $1',
    [softwareId]
  );
  if (software.rows.length === 0) return { error: 'Game not found', status: 404 };
  if (software.rows[0].is_active === false) {
    return { error: `${software.rows[0].software_name} is inactive, so it cannot be priced`, status: 409 };
  }

  const session = await client.query(
    'SELECT id, session_name, status FROM session_master WHERE id = $1',
    [sessionId]
  );
  if (session.rows.length === 0) return { error: 'Session not found', status: 404 };
  if (session.rows[0].status !== 'ACTIVE') {
    return { error: `${session.rows[0].session_name} is inactive, so it cannot be priced`, status: 409 };
  }

  return { ok: true };
};

const parsePrice = (raw) => {
  if (raw === undefined || raw === null || raw === '') return { error: 'Price is required' };
  const price = Number(raw);
  if (!Number.isFinite(price)) return { error: 'Price must be a number' };
  if (price < 0) return { error: 'Price cannot be negative' };
  if (price > 99999999) return { error: 'Price is unrealistically large' };
  return { price: Number(price.toFixed(2)) };
};

// POST /api/gaming-prices
export const createPrice = async (req, res) => {
  const client = await pool.connect();
  try {
    const softwareId = parseInt(req.body?.software_id ?? req.body?.game_id, 10);
    const sessionId = parseInt(req.body?.session_master_id, 10);

    if (!Number.isInteger(softwareId)) {
      return res.status(400).json({ success: false, message: 'A game is required' });
    }
    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({ success: false, message: 'A session is required' });
    }

    const parsed = parsePrice(req.body?.price);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    const refs = await checkReferences(client, softwareId, sessionId);
    if (refs.error) return res.status(refs.status).json({ success: false, message: refs.error });

    const currency = (req.body?.currency || 'INR').toUpperCase().slice(0, 8);
    const status = STATUSES.includes(String(req.body?.status || '').toUpperCase())
      ? String(req.body.status).toUpperCase()
      : 'ACTIVE';

    const inserted = await client.query(
      `INSERT INTO gaming_prices (software_id, session_master_id, price, currency, status)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [softwareId, sessionId, parsed.price, currency, status]
    );

    const full = await client.query(`${SELECT_PRICE} WHERE gp.id = $1`, [inserted.rows[0].id]);
    res.status(201).json({ success: true, message: 'Price saved', data: shape(full.rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'That game already has a price for this session. Edit the existing one instead.'
      });
    }
    console.error('Error creating gaming price:', error);
    res.status(500).json({ success: false, message: 'Error saving price' });
  } finally {
    client.release();
  }
};

// GET /api/gaming-prices?software_id=&session_master_id=&status=&search=&limit=&offset=
export const listPrices = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const filters = [];
    const params = [];

    if (req.query.software_id) {
      params.push(parseInt(req.query.software_id, 10));
      filters.push(`gp.software_id = $${params.length}`);
    }
    if (req.query.session_master_id) {
      params.push(parseInt(req.query.session_master_id, 10));
      filters.push(`gp.session_master_id = $${params.length}`);
    }
    if (req.query.status) {
      params.push(String(req.query.status).toUpperCase());
      filters.push(`gp.status = $${params.length}`);
    }
    if (req.query.search) {
      params.push(`%${String(req.query.search).trim()}%`);
      filters.push(`(sm.software_name ILIKE $${params.length} OR s.session_name ILIKE $${params.length})`);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const listParams = [...params, limit, offset];

    const result = await pool.query(
      `${SELECT_PRICE} ${where}
       ORDER BY sm.software_name ASC,
         CASE WHEN s.duration_minutes IS NULL THEN 1 ELSE 0 END,
         s.duration_minutes ASC
       LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    );

    const total = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM gaming_prices gp
       JOIN software_master sm ON sm.software_id = gp.software_id
       JOIN session_master  s  ON s.id = gp.session_master_id
       ${where}`,
      params
    );

    res.status(200).json({
      success: true,
      data: result.rows.map(shape),
      pagination: { limit, offset, total: total.rows[0].count }
    });
  } catch (error) {
    console.error('Error listing gaming prices:', error);
    res.status(500).json({ success: false, message: 'Error fetching prices' });
  }
};

// GET /api/gaming-prices/lookup?software_id=1&session_master_id=2
export const lookupPrice = async (req, res) => {
  try {
    const softwareId = parseInt(req.query.software_id ?? req.query.game_id, 10);
    const sessionId = parseInt(req.query.session_master_id, 10);

    if (!Number.isInteger(softwareId) || !Number.isInteger(sessionId)) {
      return res.status(400).json({
        success: false,
        message: 'software_id and session_master_id are both required'
      });
    }

    const result = await pool.query(
      `${SELECT_PRICE} WHERE gp.software_id = $1 AND gp.session_master_id = $2`,
      [softwareId, sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No price is configured for that game and session'
      });
    }

    res.status(200).json({ success: true, data: shape(result.rows[0]) });
  } catch (error) {
    console.error('Error looking up gaming price:', error);
    res.status(500).json({ success: false, message: 'Error looking up price' });
  }
};

// GET /api/gaming-prices/:id
export const getPriceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid price id' });
    }
    const result = await pool.query(`${SELECT_PRICE} WHERE gp.id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }
    res.status(200).json({ success: true, data: shape(result.rows[0]) });
  } catch (error) {
    console.error('Error fetching gaming price:', error);
    res.status(500).json({ success: false, message: 'Error fetching price' });
  }
};

// PUT /api/gaming-prices/:id
export const updatePrice = async (req, res) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid price id' });
    }

    const existing = await client.query('SELECT * FROM gaming_prices WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }

    const current = existing.rows[0];
    const softwareId = req.body?.software_id ?? req.body?.game_id ?? current.software_id;
    const sessionId = req.body?.session_master_id ?? current.session_master_id;

    const parsed = req.body?.price === undefined
      ? { price: Number(current.price) }
      : parsePrice(req.body.price);
    if (parsed.error) return res.status(400).json({ success: false, message: parsed.error });

    // Only re-check the masters when the pair actually moves.
    if (Number(softwareId) !== current.software_id || Number(sessionId) !== current.session_master_id) {
      const refs = await checkReferences(client, Number(softwareId), Number(sessionId));
      if (refs.error) return res.status(refs.status).json({ success: false, message: refs.error });
    }

    const currency = (req.body?.currency || current.currency).toUpperCase().slice(0, 8);
    const status = STATUSES.includes(String(req.body?.status || '').toUpperCase())
      ? String(req.body.status).toUpperCase()
      : current.status;

    await client.query(
      `UPDATE gaming_prices
       SET software_id = $1, session_master_id = $2, price = $3, currency = $4,
           status = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [Number(softwareId), Number(sessionId), parsed.price, currency, status, id]
    );

    const full = await client.query(`${SELECT_PRICE} WHERE gp.id = $1`, [id]);
    res.status(200).json({ success: true, message: 'Price updated', data: shape(full.rows[0]) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'That game already has a price for this session'
      });
    }
    console.error('Error updating gaming price:', error);
    res.status(500).json({ success: false, message: 'Error updating price' });
  } finally {
    client.release();
  }
};

// PATCH /api/gaming-prices/:id/status
export const setPriceStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const status = String(req.body?.status || '').toUpperCase();
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACTIVE or INACTIVE' });
    }

    const updated = await pool.query(
      `UPDATE gaming_prices SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING id`,
      [status, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }

    const full = await pool.query(`${SELECT_PRICE} WHERE gp.id = $1`, [id]);
    res.status(200).json({
      success: true,
      message: status === 'ACTIVE' ? 'Price activated' : 'Price deactivated',
      data: shape(full.rows[0])
    });
  } catch (error) {
    console.error('Error updating price status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// DELETE /api/gaming-prices/:id
export const deletePrice = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const result = await pool.query('DELETE FROM gaming_prices WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Price not found' });
    }
    res.status(200).json({ success: true, message: 'Price deleted' });
  } catch (error) {
    console.error('Error deleting gaming price:', error);
    res.status(500).json({ success: false, message: 'Error deleting price' });
  }
};

/**
 * GET /api/gaming-prices/matrix
 * Every active game with its configured prices, for the pricing grid.
 */
export const priceMatrix = async (req, res) => {
  try {
    const games = await pool.query(
      `SELECT software_id, software_name, software_icon
       FROM software_master WHERE is_active = TRUE ORDER BY software_name ASC`
    );
    const sessions = await pool.query(
      `SELECT * FROM session_master WHERE status = 'ACTIVE'
       ORDER BY CASE WHEN duration_minutes IS NULL THEN 1 ELSE 0 END, duration_minutes ASC`
    );
    const prices = await pool.query(`${SELECT_PRICE} WHERE gp.status = 'ACTIVE'`);

    res.status(200).json({
      success: true,
      data: {
        games: games.rows,
        sessions: sessions.rows.map((r) => ({
          session_master_id: r.id,
          session_name: r.session_name,
          duration_type: r.duration_type,
          duration_minutes: r.duration_minutes === null ? null : Number(r.duration_minutes),
          is_unlimited: r.duration_type === 'UNLIMITED'
        })),
        prices: prices.rows.map(shape)
      }
    });
  } catch (error) {
    console.error('Error building price matrix:', error);
    res.status(500).json({ success: false, message: 'Error building price matrix' });
  }
};

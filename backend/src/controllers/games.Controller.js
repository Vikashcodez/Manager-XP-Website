/*
 * The Game Library API.
 *
 * A café's titles and how to launch them, plus which title is on which PC.
 * Everything is scoped to the signing-in café: a game id arrives from a client
 * and is only ever acted on after it is confirmed to belong to this café, so a
 * crafted request can neither read nor edit a neighbour's library.
 */
import pool from '../config/database.js';
import { recordAudit } from '../config/audit.js';

const LAUNCHERS = ['Steam', 'Riot', 'EA', 'Epic', 'Ubisoft', 'Battle.net', 'Rockstar', 'Custom'];

const shape = (r) => ({
  game_id: r.game_id,
  name: r.name,
  category: r.category || null,
  publisher: r.publisher || null,
  launcher: r.launcher,
  launch_type: r.launch_type || null,
  app_id: r.app_id || null,
  executable: r.executable || null,
  process_name: r.process_name || null,
  launch_args: r.launch_args || null,
  icon_url: r.icon_url || null,
  auto_launch: !!r.auto_launch,
  enabled: !!r.enabled,
  sort_order: r.sort_order,
  pc_count: r.pc_count !== undefined ? Number(r.pc_count) : undefined
});

/* Trim to a length, or null for an empty value — one place so every text field
   is stored the same way rather than half of them keeping ''. */
const clean = (v, max) => {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
};

/* The editable fields and how to validate each. Shared by create and update so
   the two cannot drift into accepting different things. Returns {error} or a
   cleaned value. */
const FIELD = {
  name:         (v) => { const s = clean(v, 160); return s ? { value: s } : { error: 'A game name is required' }; },
  category:     (v) => ({ value: clean(v, 48) }),
  publisher:    (v) => ({ value: clean(v, 120) }),
  launcher:     (v) => LAUNCHERS.includes(String(v)) ? { value: String(v) } : { error: `Launcher must be one of ${LAUNCHERS.join(', ')}` },
  launch_type:  (v) => ({ value: clean(v, 48) }),
  app_id:       (v) => ({ value: clean(v, 64) }),
  executable:   (v) => ({ value: clean(v, 255) }),
  process_name: (v) => ({ value: clean(v, 120) }),
  launch_args:  (v) => ({ value: clean(v, 2000) }),
  icon_url:     (v) => ({ value: clean(v, 2000) }),
  auto_launch:  (v) => ({ value: !!v }),
  enabled:      (v) => ({ value: !!v }),
  sort_order:   (v) => { const n = parseInt(v, 10); return Number.isInteger(n) ? { value: n } : { value: 100 }; }
};

/* GET /api/games?search=&launcher=&category=&enabled= */
export const listGames = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const filters = ['g.cafe_id IS NOT DISTINCT FROM $1'];
    const params = [cafeId];

    if (req.query.search) {
      params.push(`%${String(req.query.search).trim()}%`);
      filters.push(`(g.name ILIKE $${params.length} OR g.publisher ILIKE $${params.length})`);
    }
    if (req.query.launcher) { params.push(String(req.query.launcher)); filters.push(`g.launcher = $${params.length}`); }
    if (req.query.category) { params.push(String(req.query.category)); filters.push(`g.category = $${params.length}`); }
    if (req.query.enabled === 'true' || req.query.enabled === 'false') {
      params.push(req.query.enabled === 'true'); filters.push(`g.enabled = $${params.length}`);
    }

    const { rows } = await pool.query(`
      SELECT g.*, (SELECT COUNT(*) FROM pc_games pg WHERE pg.game_id = g.game_id AND pg.installed) AS pc_count
      FROM games g
      WHERE ${filters.join(' AND ')}
      ORDER BY g.sort_order, g.name
    `, params);

    res.json({ success: true, data: rows.map(shape) });
  } catch (error) {
    console.error('Game list failed:', error);
    res.status(500).json({ success: false, message: 'Could not load the game library' });
  }
};

/* GET /api/games/:id */
export const getGame = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const g = (await pool.query(
      'SELECT * FROM games WHERE game_id = $1 AND cafe_id IS NOT DISTINCT FROM $2',
      [parseInt(req.params.id, 10), cafeId])).rows[0];
    if (!g) return res.status(404).json({ success: false, message: 'Game not found' });
    res.json({ success: true, data: shape(g) });
  } catch (error) {
    console.error('Game read failed:', error);
    res.status(500).json({ success: false, message: 'Could not load that game' });
  }
};

/* POST /api/games */
export const createGame = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const cols = ['cafe_id']; const vals = [cafeId]; const ph = ['$1'];
    for (const [key, check] of Object.entries(FIELD)) {
      if (req.body?.[key] === undefined && key !== 'name' && key !== 'launcher') continue;
      const r = check(req.body?.[key]);
      if (r.error) return res.status(400).json({ success: false, message: r.error });
      cols.push(key); vals.push(r.value); ph.push(`$${vals.length}`);
    }

    const dup = await pool.query(
      'SELECT 1 FROM games WHERE cafe_id IS NOT DISTINCT FROM $1 AND LOWER(name) = LOWER($2)',
      [cafeId, req.body?.name]);
    if (dup.rows[0]) return res.status(409).json({ success: false, message: 'A game with that name already exists' });

    const g = (await pool.query(
      `INSERT INTO games (${cols.join(',')}) VALUES (${ph.join(',')}) RETURNING *`, vals)).rows[0];

    await recordAudit(req, {
      action: 'game.create', category: 'games', entity: 'game', entity_id: g.game_id,
      summary: `Added ${g.name} (${g.launcher})`
    });
    res.status(201).json({ success: true, message: `${g.name} added`, data: shape(g) });
  } catch (error) {
    console.error('Game create failed:', error);
    res.status(500).json({ success: false, message: 'Could not add that game' });
  }
};

/* PATCH /api/games/:id */
export const updateGame = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const id = parseInt(req.params.id, 10);
    const before = (await pool.query(
      'SELECT * FROM games WHERE game_id = $1 AND cafe_id IS NOT DISTINCT FROM $2', [id, cafeId])).rows[0];
    if (!before) return res.status(404).json({ success: false, message: 'Game not found' });

    const sets = []; const params = [id];
    for (const [key, check] of Object.entries(FIELD)) {
      if (req.body?.[key] === undefined) continue;
      const r = check(req.body[key]);
      if (r.error) return res.status(400).json({ success: false, message: r.error });
      params.push(r.value); sets.push(`${key} = $${params.length}`);
    }
    if (!sets.length) return res.status(400).json({ success: false, message: 'Nothing to change' });

    const g = (await pool.query(
      `UPDATE games SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE game_id = $1 RETURNING *`,
      params)).rows[0];

    await recordAudit(req, {
      action: 'game.update', category: 'games', entity: 'game', entity_id: id,
      summary: `Edited ${g.name}`
    });
    res.json({ success: true, message: `${g.name} saved`, data: shape(g) });
  } catch (error) {
    console.error('Game update failed:', error);
    res.status(500).json({ success: false, message: 'Could not save that game' });
  }
};

/* DELETE /api/games/:id */
export const deleteGame = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const id = parseInt(req.params.id, 10);
    const g = (await pool.query(
      'DELETE FROM games WHERE game_id = $1 AND cafe_id IS NOT DISTINCT FROM $2 RETURNING name', [id, cafeId])).rows[0];
    if (!g) return res.status(404).json({ success: false, message: 'Game not found' });
    await recordAudit(req, {
      action: 'game.delete', category: 'games', entity: 'game', entity_id: id,
      sensitive: true, summary: `Removed ${g.name} from the library`
    });
    res.json({ success: true, message: `${g.name} removed` });
  } catch (error) {
    console.error('Game delete failed:', error);
    res.status(500).json({ success: false, message: 'Could not remove that game' });
  }
};

/* ==========================================================================
   PC ↔ GAME AVAILABILITY
   ========================================================================== */

/* GET /api/games/pc/:pcId — every library game plus whether it is on this PC. */
export const listPcGames = async (req, res) => {
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const pcId = parseInt(req.params.pcId, 10);

    const pc = (await pool.query(
      'SELECT pc_id, name FROM pcs WHERE pc_id = $1 AND cafe_id IS NOT DISTINCT FROM $2', [pcId, cafeId])).rows[0];
    if (!pc) return res.status(404).json({ success: false, message: 'Station not found' });

    const { rows } = await pool.query(`
      SELECT g.*, (pg.game_id IS NOT NULL AND pg.installed) AS installed
      FROM games g
      LEFT JOIN pc_games pg ON pg.game_id = g.game_id AND pg.pc_id = $2
      WHERE g.cafe_id IS NOT DISTINCT FROM $1
      ORDER BY g.sort_order, g.name
    `, [cafeId, pcId]);

    res.json({
      success: true,
      data: { pc, games: rows.map((r) => ({ ...shape(r), installed: !!r.installed })) }
    });
  } catch (error) {
    console.error('PC games list failed:', error);
    res.status(500).json({ success: false, message: 'Could not load this station\'s games' });
  }
};

/* PUT /api/games/pc/:pcId  { game_ids: [...] } — the exact set installed here. */
export const setPcGames = async (req, res) => {
  const client = await pool.connect();
  try {
    const cafeId = req.actor?.cafe_id ?? null;
    const pcId = parseInt(req.params.pcId, 10);
    const wanted = Array.isArray(req.body?.game_ids)
      ? [...new Set(req.body.game_ids.map((n) => parseInt(n, 10)).filter(Number.isInteger))]
      : null;
    if (!wanted) return res.status(400).json({ success: false, message: 'Send a game_ids array' });

    const pc = (await client.query(
      'SELECT pc_id, name FROM pcs WHERE pc_id = $1 AND cafe_id IS NOT DISTINCT FROM $2', [pcId, cafeId])).rows[0];
    if (!pc) return res.status(404).json({ success: false, message: 'Station not found' });

    /* Only this café's games can be mapped — a game id from another café is
       silently dropped rather than trusted. */
    const valid = wanted.length
      ? (await client.query(
          'SELECT game_id FROM games WHERE cafe_id IS NOT DISTINCT FROM $1 AND game_id = ANY($2)',
          [cafeId, wanted])).rows.map((r) => r.game_id)
      : [];

    await client.query('BEGIN');
    await client.query('DELETE FROM pc_games WHERE pc_id = $1', [pcId]);
    for (const gid of valid) {
      await client.query(
        'INSERT INTO pc_games (pc_id, game_id, installed) VALUES ($1,$2,TRUE)', [pcId, gid]);
    }
    await client.query('COMMIT');

    await recordAudit(req, {
      action: 'game.pc_map', category: 'games', entity: 'pc', entity_id: pcId,
      summary: `Set ${valid.length} game${valid.length === 1 ? '' : 's'} available on ${pc.name}`
    });
    res.json({ success: true, message: `${valid.length} games available on ${pc.name}`, data: { game_ids: valid } });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('PC games set failed:', error);
    res.status(500).json({ success: false, message: 'Could not save this station\'s games' });
  } finally {
    client.release();
  }
};

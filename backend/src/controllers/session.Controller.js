import pool from '../config/database.js';
import { recordAudit } from '../config/audit.js';
import { getSetting } from '../config/settings.js';
import { createBillForSession } from './billing.Controller.js';

/*
 * Play sessions.
 *
 * A session is one customer (or guest) on one station. Time is derived from
 * timestamps rather than counted by a ticker, so a restart of any process
 * never loses or invents time:
 *
 *   elapsed = now - started_at - paused_seconds - (paused_at ? now - paused_at : 0)
 *
 * `paused_seconds` accumulates completed pauses; `paused_at` marks a pause
 * still in progress. On end, the elapsed figure is billed at the rate that was
 * captured when the session started, so later price changes never rewrite
 * history.
 */

const OPEN_STATUSES = ['active', 'paused'];

/**
 * The fallback hourly rate lives in app_settings, so it can be changed without
 * a code edit or a restart. The literal here only covers a database that has
 * not been seeded yet.
 */
const defaultRatePerHour = () => getSetting('session.default_rate_per_hour', 60);

const num = (v) => (v === null || v === undefined ? null : Number(v));

/** Seconds of billable play, evaluated at `at` (defaults to now). */
const elapsedSeconds = (row, at) => {
  const now = at ? new Date(at) : new Date();
  const started = new Date(row.started_at);
  let seconds = Math.floor((now - started) / 1000) - (row.paused_seconds || 0);
  if (row.paused_at) {
    seconds -= Math.floor((now - new Date(row.paused_at)) / 1000);
  }
  return Math.max(0, seconds);
};

const shape = (row) => {
  const elapsed = row.status === 'ended'
    ? (row.billable_seconds || 0)
    : elapsedSeconds(row);
  const plannedSeconds = row.planned_minutes ? row.planned_minutes * 60 : null;

  return {
    session_id: row.session_id,
    pc_id: row.pc_id,
    pc_name: row.pc_name || null,
    customer_id: row.customer_id,
    customer_name: row.customer_name || row.guest_name || null,
    is_guest: !row.customer_id,
    guest_name: row.guest_name,
    guest_phone: row.guest_phone,
    status: row.status,
    planned_minutes: row.planned_minutes,
    rate_per_hour: num(row.rate_per_hour),
    started_at: row.started_at,
    paused_at: row.paused_at,
    ended_at: row.ended_at,
    elapsed_seconds: elapsed,
    remaining_seconds: plannedSeconds === null ? null : Math.max(0, plannedSeconds - elapsed),
    // What the session would cost if it ended right now.
    running_amount: num((num(row.rate_per_hour) * (elapsed / 3600)).toFixed(2)),
    amount_charged: num(row.amount_charged),
    payment_status: row.payment_status,
    end_reason: row.end_reason,
    started_by: row.started_by,
    ended_by: row.ended_by,
    wallet_balance: num(row.wallet_balance)
  };
};

const SELECT_SESSION = `
  SELECT s.*, p.name AS pc_name, c.customer_name, w.balance AS wallet_balance
  FROM sessions s
  LEFT JOIN pcs p ON p.pc_id = s.pc_id
  LEFT JOIN customers c ON c.customer_id = s.customer_id
  LEFT JOIN wallets w ON w.customer_id = s.customer_id
`;

const fetchSession = async (client, id) => {
  const result = await client.query(`${SELECT_SESSION} WHERE s.session_id = $1`, [id]);
  return result.rows[0] || null;
};

/* ==========================================================================
   START
   ========================================================================== */
// POST /api/sessions
export const startSession = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      pc_id, customer_id, guest_name, guest_phone,
      planned_minutes, rate_per_hour, cafe_id
    } = req.body || {};

    const pcId = parseInt(pc_id, 10);
    if (!Number.isInteger(pcId)) {
      return res.status(400).json({ success: false, message: 'A station is required' });
    }

    const customerId = customer_id ? parseInt(customer_id, 10) : null;
    const guestName = guest_name ? String(guest_name).trim().slice(0, 255) : null;

    if (!customerId && !guestName) {
      return res.status(400).json({
        success: false,
        message: 'Choose a customer, or give the guest a name'
      });
    }

    const minutes = planned_minutes === null || planned_minutes === undefined || planned_minutes === ''
      ? null
      : parseInt(planned_minutes, 10);
    if (minutes !== null && (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440)) {
      return res.status(400).json({ success: false, message: 'Duration must be between 1 and 1440 minutes' });
    }

    const rate = rate_per_hour === undefined || rate_per_hour === null || rate_per_hour === ''
      ? await defaultRatePerHour()
      : Number(rate_per_hour);
    if (!Number.isFinite(rate) || rate < 0) {
      return res.status(400).json({ success: false, message: 'Rate must be zero or more' });
    }

    const pc = await client.query('SELECT pc_id, cafe_id FROM pcs WHERE pc_id = $1', [pcId]);
    if (pc.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Station not found' });
    }

    if (customerId) {
      const customer = await client.query('SELECT customer_id FROM customers WHERE customer_id = $1', [customerId]);
      if (customer.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }
    }

    const open = await client.query(
      `SELECT session_id FROM sessions WHERE pc_id = $1 AND status = ANY($2)`,
      [pcId, OPEN_STATUSES]
    );
    if (open.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'That station already has a session running',
        data: { session_id: open.rows[0].session_id }
      });
    }

    const inserted = await client.query(
      `INSERT INTO sessions
         (cafe_id, pc_id, customer_id, guest_name, guest_phone,
          planned_minutes, rate_per_hour, started_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING session_id`,
      [
        cafe_id || pc.rows[0].cafe_id || null,
        pcId,
        customerId,
        customerId ? null : guestName,
        customerId ? null : (guest_phone ? String(guest_phone).trim().slice(0, 20) : null),
        minutes,
        rate,
        req.actor?.label || null
      ]
    );

    const session = await fetchSession(client, inserted.rows[0].session_id);

    await recordAudit(req, {
      action: 'session.start',
      category: 'sessions',
      entity: 'session',
      entity_id: session.session_id,
      summary: `Started a session on ${session.pc_name || 'a station'} for ` +
        `${session.customer_name || session.guest_name || 'a guest'}` +
        (minutes ? ` — ${minutes} minutes` : ' — open-ended') + ` at ${rate}/hr`,
      meta: {
        pc_id: pcId,
        customer_id: customerId,
        guest_name: customerId ? null : guestName,
        planned_minutes: minutes,
        rate_per_hour: rate
      }
    });

    res.status(201).json({ success: true, message: 'Session started', data: shape(session) });
  } catch (error) {
    // The partial unique index is the real guard against a double-book.
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'That station already has a session running' });
    }
    console.error('Error starting session:', error);
    res.status(500).json({ success: false, message: 'Error starting session' });
  } finally {
    client.release();
  }
};

/* ==========================================================================
   LIST / READ
   ========================================================================== */
// GET /api/sessions?status=&pc_id=&customer_id=&limit=&offset=
export const listSessions = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const filters = [];
    const params = [];

    if (req.query.status) {
      const statuses = String(req.query.status).split(',').map((s) => s.trim());
      params.push(statuses);
      filters.push(`s.status = ANY($${params.length})`);
    }
    if (req.query.pc_id) {
      params.push(parseInt(req.query.pc_id, 10));
      filters.push(`s.pc_id = $${params.length}`);
    }
    if (req.query.customer_id) {
      params.push(parseInt(req.query.customer_id, 10));
      filters.push(`s.customer_id = $${params.length}`);
    }
    if (req.query.since) {
      params.push(req.query.since);
      filters.push(`s.started_at >= $${params.length}`);
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const listParams = [...params, limit, offset];

    const result = await pool.query(
      `${SELECT_SESSION} ${where}
       ORDER BY s.started_at DESC
       LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
      listParams
    );

    const total = await pool.query(
      `SELECT COUNT(*)::int AS count FROM sessions s ${where}`,
      params
    );

    res.status(200).json({
      success: true,
      data: result.rows.map(shape),
      pagination: { limit, offset, total: total.rows[0].count }
    });
  } catch (error) {
    console.error('Error listing sessions:', error);
    res.status(500).json({ success: false, message: 'Error fetching sessions' });
  }
};

// GET /api/sessions/:id
export const getSession = async (req, res) => {
  const client = await pool.connect();
  try {
    const session = await fetchSession(client, parseInt(req.params.id, 10));
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: shape(session) });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ success: false, message: 'Error fetching session' });
  } finally {
    client.release();
  }
};

/* ==========================================================================
   PAUSE / RESUME / EXTEND / TRANSFER
   ========================================================================== */
/**
 * Every open-session change funnels through here, so this is also the one
 * place the audit entry has to be written for pause, resume, extend and
 * transfer. `action` names the verb for the trail.
 */
const mutate = async (req, res, handler, action) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id' });
    }

    await client.query('BEGIN');
    const locked = await client.query('SELECT * FROM sessions WHERE session_id = $1 FOR UPDATE', [id]);
    if (locked.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const outcome = await handler(client, locked.rows[0], req);
    if (outcome && outcome.error) {
      await client.query('ROLLBACK');
      return res.status(outcome.status || 400).json({ success: false, message: outcome.error });
    }

    await client.query('COMMIT');

    const fresh = await fetchSession(client, id);

    if (action) {
      await recordAudit(req, {
        action: `session.${action}`,
        category: 'sessions',
        entity: 'session',
        entity_id: id,
        sensitive: action === 'transfer',
        summary: `${outcome?.message || 'Session updated'} — session ${id} on ` +
          `${fresh.pc_name || 'a station'} for ${fresh.customer_name || fresh.guest_name || 'a guest'}`,
        meta: { status: fresh.status, planned_minutes: fresh.planned_minutes }
      });
    }

    res.status(200).json({
      success: true,
      message: outcome?.message || 'Session updated',
      data: shape(fresh)
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error updating session:', error);
    res.status(500).json({ success: false, message: 'Error updating session' });
  } finally {
    client.release();
  }
};

// POST /api/sessions/:id/pause
export const pauseSession = (req, res) => mutate(req, res, async (client, row) => {
  if (row.status !== 'active') {
    return { error: `Only an active session can be paused (this one is ${row.status})`, status: 409 };
  }
  await client.query(
    `UPDATE sessions SET status = 'paused', paused_at = CURRENT_TIMESTAMP,
                         updated_at = CURRENT_TIMESTAMP
     WHERE session_id = $1`,
    [row.session_id]
  );
  return { message: 'Session paused' };
}, 'pause');

// POST /api/sessions/:id/resume
export const resumeSession = (req, res) => mutate(req, res, async (client, row) => {
  if (row.status !== 'paused') {
    return { error: `Only a paused session can be resumed (this one is ${row.status})`, status: 409 };
  }
  // Bank the completed pause, then clear the marker.
  await client.query(
    `UPDATE sessions
     SET status = 'active',
         paused_seconds = paused_seconds + GREATEST(0, EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - paused_at))::int),
         paused_at = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE session_id = $1`,
    [row.session_id]
  );
  return { message: 'Session resumed' };
}, 'resume');

// POST /api/sessions/:id/extend  { minutes }
export const extendSession = (req, res) => mutate(req, res, async (client, row, request) => {
  if (row.status === 'ended') {
    return { error: 'That session has already ended', status: 409 };
  }
  const minutes = parseInt(request.body?.minutes, 10);
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
    return { error: 'Extend by between 1 and 1440 minutes' };
  }
  if (row.planned_minutes === null) {
    return { error: 'This session is open-ended, so there is nothing to extend', status: 409 };
  }
  await client.query(
    `UPDATE sessions SET planned_minutes = planned_minutes + $1, updated_at = CURRENT_TIMESTAMP
     WHERE session_id = $2`,
    [minutes, row.session_id]
  );
  return { message: `Extended by ${minutes} minutes` };
}, 'extend');

// POST /api/sessions/:id/transfer  { pc_id }
export const transferSession = (req, res) => mutate(req, res, async (client, row, request) => {
  if (row.status === 'ended') {
    return { error: 'That session has already ended', status: 409 };
  }
  const target = parseInt(request.body?.pc_id, 10);
  if (!Number.isInteger(target)) return { error: 'Choose a station to move to' };
  if (target === row.pc_id) return { error: 'The session is already on that station' };

  const pc = await client.query('SELECT pc_id FROM pcs WHERE pc_id = $1', [target]);
  if (pc.rows.length === 0) return { error: 'Station not found', status: 404 };

  const busy = await client.query(
    `SELECT session_id FROM sessions WHERE pc_id = $1 AND status = ANY($2)`,
    [target, OPEN_STATUSES]
  );
  if (busy.rows.length > 0) {
    return { error: 'That station already has a session running', status: 409 };
  }

  await client.query(
    `UPDATE sessions SET pc_id = $1, updated_at = CURRENT_TIMESTAMP WHERE session_id = $2`,
    [target, row.session_id]
  );
  return { message: 'Session transferred' };
}, 'transfer');

/* ==========================================================================
   END  (settles against the wallet)
   ========================================================================== */
// POST /api/sessions/:id/end  { charge?: boolean, reason?: string }
export const endSession = async (req, res) => {
  const client = await pool.connect();
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ success: false, message: 'Invalid session id' });
    }

    const shouldCharge = req.body?.charge !== false;   // charging is the default
    const reason = req.body?.reason ? String(req.body.reason).slice(0, 32) : 'staff';

    await client.query('BEGIN');

    const locked = await client.query('SELECT * FROM sessions WHERE session_id = $1 FOR UPDATE', [id]);
    if (locked.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const row = locked.rows[0];
    if (row.status === 'ended') {
      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'That session has already ended' });
    }

    const billableSeconds = elapsedSeconds(row);
    const rate = Number(row.rate_per_hour || 0);
    const amount = Number((rate * (billableSeconds / 3600)).toFixed(2));

    let paymentStatus = 'not_applicable';
    let walletTransactionId = null;

    if (!shouldCharge) {
      paymentStatus = 'waived';
    } else if (row.customer_id && amount > 0) {
      // Settle against the wallet using the same locked-row discipline as the
      // wallet endpoints themselves.
      const wallet = await client.query(
        'SELECT * FROM wallets WHERE customer_id = $1 FOR UPDATE',
        [row.customer_id]
      );

      if (wallet.rows.length === 0) {
        paymentStatus = 'unpaid';
      } else {
        const balance = Number(wallet.rows[0].balance);
        if (balance >= amount) {
          const next = Number((balance - amount).toFixed(2));
          await client.query(
            'UPDATE wallets SET balance = $1, updated_at = CURRENT_TIMESTAMP WHERE wallet_id = $2',
            [next, wallet.rows[0].wallet_id]
          );
          const ledger = await client.query(
            `INSERT INTO wallet_transactions
               (wallet_id, customer_id, direction, amount, balance_after, category, note, performed_by)
             VALUES ($1,$2,'debit',$3,$4,'gaming',$5,$6)
             RETURNING transaction_id`,
            [
              wallet.rows[0].wallet_id,
              row.customer_id,
              amount,
              next,
              `Session #${row.session_id}`,
              req.actor?.label || null
            ]
          );
          walletTransactionId = ledger.rows[0].transaction_id;
          paymentStatus = 'paid';
        } else {
          // Ending is never blocked by a short balance — staff settle it.
          paymentStatus = 'unpaid';
        }
      }
    } else if (!row.customer_id && amount > 0) {
      paymentStatus = 'unpaid';       // guests pay at the counter
    }

    // Every charged session leaves a bill behind, whether or not the wallet
    // covered it — that is the record staff settle against and report on.
    let billId = null;
    if (shouldCharge && amount > 0) {
      const station = await client.query('SELECT name FROM pcs WHERE pc_id = $1', [row.pc_id]);
      const pcName = station.rows[0] ? station.rows[0].name : null;

      billId = await createBillForSession(client, {
        session_id: row.session_id,
        cafe_id: row.cafe_id,
        customer_id: row.customer_id,
        guest_name: row.guest_name,
        pc_name: pcName,
        amount: amount,
        billable_seconds: billableSeconds
      }, req.actor?.label);

      // If the wallet already covered it, record that against the bill so it
      // does not look outstanding.
      if (paymentStatus === 'paid') {
        await client.query(
          `INSERT INTO payments (bill_id, customer_id, method, amount, reference,
                                 wallet_transaction_id, received_by)
           VALUES ($1,$2,'wallet',$3,$4,$5,$6)`,
          [
            billId, row.customer_id, amount,
            `Session #${row.session_id}`, walletTransactionId, req.actor?.label || null
          ]
        );
        await client.query(
          `UPDATE bills SET paid_amount = $1, status = 'PAID',
                            settled_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
           WHERE bill_id = $2`,
          [amount, billId]
        );
      }
    }

    await client.query(
      `UPDATE sessions
       SET status = 'ended',
           ended_at = CURRENT_TIMESTAMP,
           paused_at = NULL,
           billable_seconds = $1,
           amount_charged = $2,
           payment_status = $3,
           wallet_transaction_id = $4,
           end_reason = $5,
           ended_by = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE session_id = $7`,
      [billableSeconds, amount, paymentStatus, walletTransactionId, reason, req.actor?.label || null, id]
    );

    await client.query('COMMIT');

    const fresh = await fetchSession(client, id);

    await recordAudit(req, {
      action: 'session.end',
      category: 'sessions',
      entity: 'session',
      entity_id: id,
      amount: Number(amount),
      // An unpaid or waived close is exactly the kind of thing an owner wants
      // flagged when they scan the trail.
      sensitive: paymentStatus !== 'paid',
      summary: `Ended session ${id} on ${fresh.pc_name || 'a station'} for ` +
        `${fresh.customer_name || fresh.guest_name || 'a guest'} — ` +
        `${Math.round(billableSeconds / 60)} min, ${amount} charged, ${paymentStatus}` +
        (reason ? ` (${reason})` : ''),
      meta: {
        billable_seconds: billableSeconds,
        payment_status: paymentStatus,
        end_reason: reason,
        wallet_transaction_id: walletTransactionId
      }
    });

    res.status(200).json({
      success: true,
      message: paymentStatus === 'paid' ? 'Session ended and charged'
        : paymentStatus === 'unpaid' ? 'Session ended — payment outstanding'
        : 'Session ended',
      data: shape(fresh)
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Error ending session:', error);
    res.status(500).json({ success: false, message: 'Error ending session' });
  } finally {
    client.release();
  }
};

// GET /api/sessions/defaults — read from settings, never a baked-in constant
export const getDefaults = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        rate_per_hour: await getSetting('session.default_rate_per_hour', 60),
        warn_minutes: await getSetting('session.warn_minutes', 15),
        critical_minutes: await getSetting('session.critical_minutes', 5)
      }
    });
  } catch (error) {
    console.error('Error reading session defaults:', error);
    res.status(500).json({ success: false, message: 'Error reading defaults' });
  }
};

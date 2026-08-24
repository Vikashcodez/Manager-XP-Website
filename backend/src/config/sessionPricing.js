import pool from './database.js';

/*
 * The session pricing engine.
 *
 * One path for every gaming type. There is no PS5 branch, no VR branch and no
 * Pool branch — a station's category decides which prices are offered, and the
 * arithmetic below is identical whichever one was chosen. Adding "Bowling"
 * tomorrow needs a row in the Gaming Price Master and no code at all.
 *
 * The Gaming Price Master prices a game against a session length:
 *
 *     PS5  · 1 Hour      · ₹400
 *     VR   · 30 Minutes  · ₹200
 *     Pool · Any Time    · ₹300      (unlimited)
 *
 * Two shapes come out of that, not six:
 *
 *   HOUR  a block of known length. Converted to its hourly equivalent once,
 *         when the session starts, and billed pro-rata from there. "₹200 per
 *         30 minutes" becomes ₹400/hour, so 45 minutes costs ₹300. This reuses
 *         the rate_per_hour arithmetic sessions have always used rather than
 *         introducing a second way to compute money.
 *
 *   FLAT  an unlimited session. There is no rate to derive, so the price is
 *         charged whole however long the customer stays.
 *
 * Everything here is a snapshot taken at start. A later edit to the Gaming
 * Price Master must never change what a session already running, or long
 * finished, is worth.
 */

const round2 = (n) => Number(Number(n).toFixed(2));

/**
 * Load a gaming price and turn it into the fields a session stores.
 *
 * Returns `{ error }` rather than throwing, so the caller decides the status
 * code — consistent with how the rest of the controllers here report refusals.
 */
export const resolveGamingPrice = async (client, gamingPriceId, { stationCategory } = {}) => {
  const db = client || pool;
  const id = parseInt(gamingPriceId, 10);
  if (!Number.isInteger(id)) return { error: 'A gaming price is required' };

  const result = await db.query(
    `SELECT gp.id, gp.price, gp.currency, gp.status,
            sm.software_id, sm.software_name, sm.category, sm.is_active AS software_active,
            s.session_name, s.duration_minutes, s.duration_type, s.status AS session_status
       FROM gaming_prices gp
       JOIN software_master sm ON sm.software_id = gp.software_id
       JOIN session_master  s  ON s.id = gp.session_master_id
      WHERE gp.id = $1`,
    [id]
  );

  const row = result.rows[0];
  if (!row) return { error: 'That gaming price no longer exists' };

  /* Each of these is a price the café has deliberately withdrawn. Selling at
     it because a stale dropdown still offered it is how a customer is charged
     something nobody meant to charge. */
  if (row.status !== 'ACTIVE') return { error: 'That price is not currently on sale' };
  if (!row.software_active) return { error: `${row.software_name} is no longer available` };
  if (row.session_status !== 'ACTIVE') return { error: 'That session length is no longer offered' };

  /* A PS5 price on a pool table is a mis-charge, not a preference. Only
     enforced when the station says what it is; an uncategorised station is
     treated as general purpose rather than refused. */
  if (stationCategory && row.category && stationCategory !== row.category) {
    return {
      error: `${row.software_name} is a ${row.category} price and this station is ${stationCategory}`
    };
  }

  const price = Number(row.price);
  const label = `${row.software_name} · ${row.session_name} · ${row.currency === 'INR' ? '₹' : row.currency + ' '}${price}`;

  const unlimited = row.duration_type === 'UNLIMITED' || row.duration_minutes === null;

  if (unlimited) {
    return {
      snapshot: {
        gaming_price_id: row.id,
        pricing_unit: 'FLAT',
        rate_per_hour: 0,
        flat_amount: round2(price),
        price_label: label,
        category: row.category,
        software_name: row.software_name,
        session_name: row.session_name,
        currency: row.currency
      }
    };
  }

  /* A zero-length block would divide by zero and produce an infinite rate.
     It should not be possible to save one, but a bad row must not become a
     bill of ₹Infinity. */
  if (!row.duration_minutes || row.duration_minutes <= 0) {
    return { error: 'That price has no usable duration' };
  }

  return {
    snapshot: {
      gaming_price_id: row.id,
      pricing_unit: 'HOUR',
      rate_per_hour: round2(price / (row.duration_minutes / 60)),
      flat_amount: null,
      price_label: label,
      category: row.category,
      software_name: row.software_name,
      session_name: row.session_name,
      currency: row.currency
    }
  };
};

/**
 * What a session is worth for a given number of seconds played.
 *
 * Takes the session row — its snapshot — never the price master, so the answer
 * is the same today as it will be after the next price rise. Used for both the
 * running estimate and the final charge, so the number a customer is quoted
 * mid-session is produced by the same code that bills them.
 */
export const amountForSeconds = (session, seconds) => {
  if (session.pricing_unit === 'FLAT') {
    return round2(session.flat_amount || 0);
  }
  const rate = Number(session.rate_per_hour) || 0;
  return round2(rate * (Math.max(0, seconds) / 3600));
};

export default { resolveGamingPrice, amountForSeconds };

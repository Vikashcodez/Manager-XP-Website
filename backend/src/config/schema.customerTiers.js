/* ==========================================================================
   Normal and regular customers.

   A café knows the difference between somebody who walked in once and
   somebody who is there every week. The second gets treated differently:
   a standing discount, and the ability to run a tab and settle later.

   Deliberately not the membership system. A membership is something a
   customer *buys* — it has a plan, a price, an expiry, and its perk is
   gaming-only. Being a regular is something the café *grants*: no expiry,
   no charge, and the discount is on the whole bill because it is a
   relationship rather than a product.

   ── Credit ────────────────────────────────────────────────────────────────
   `credit_limit` is what the café is willing to be owed at any one time, not
   a balance. What they actually owe is derived from their unsettled bills,
   so it can never drift out of step with the bills themselves — there is no
   second number to keep correct.

   Zero means no credit, which is what a normal customer gets and what a
   regular gets until somebody sets a figure. Refusing by default is the
   right way round: a limit nobody set should not be an unlimited one.
   ========================================================================== */
export const initializeCustomerTiers = async (client) => {
  await client.query(`
    ALTER TABLE customers
      ADD COLUMN IF NOT EXISTS customer_type VARCHAR(16) NOT NULL DEFAULT 'NORMAL',
      ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS credit_limit NUMERIC(12,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS tier_note VARCHAR(255)
  `);

  /* Constraints added separately and only when absent — ALTER TABLE has no
     IF NOT EXISTS for these, and this runs on every boot. */
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_type_check') THEN
        ALTER TABLE customers ADD CONSTRAINT customers_type_check
          CHECK (customer_type IN ('NORMAL','REGULAR'));
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_discount_check') THEN
        ALTER TABLE customers ADD CONSTRAINT customers_discount_check
          CHECK (discount_percent >= 0 AND discount_percent <= 100);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_credit_check') THEN
        ALTER TABLE customers ADD CONSTRAINT customers_credit_check
          CHECK (credit_limit >= 0);
      END IF;

      /*
       * The privileges belong to the tier that grants them.
       *
       * A normal customer carrying a discount or a credit limit is a
       * contradiction the till would have to guess about — this makes the
       * two states mean exactly one thing each.
       */
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'customers_tier_shape') THEN
        ALTER TABLE customers ADD CONSTRAINT customers_tier_shape
          CHECK (customer_type = 'REGULAR' OR (discount_percent = 0 AND credit_limit = 0));
      END IF;
    END $$;
  `);

  await client.query(`
    CREATE INDEX IF NOT EXISTS idx_customers_type ON customers (cafe_id, customer_type)
  `);

  console.log('✅ Customer tiers (normal / regular) created/verified');
};

export default { initializeCustomerTiers };

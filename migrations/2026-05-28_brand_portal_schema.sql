-- NiBL Brand Partner Portal — schema.
--
-- Adds the auth-user → brand mapping (brand_partners), a brand_campaigns
-- table, a qr_scans table, and extra taste-dimension columns on the
-- customer_icp table (which already exists in the main NiBL Supabase project).
--
-- This portal stores brand-partner accounts in their own table linked to
-- Supabase Auth users, then enforces row-level security so each brand only
-- ever sees their own campaign + scan data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS brand_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brand_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brand_partners(id) ON DELETE CASCADE,
  name text NOT NULL,
  drink_name text NOT NULL,
  drink_variants text[] NOT NULL DEFAULT '{}',
  start_date date NOT NULL,
  end_date date,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'completed')),
  total_budget integer NOT NULL DEFAULT 0,
  cost_per_sample numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS brand_campaigns_brand_idx
  ON brand_campaigns(brand_id);

CREATE TABLE IF NOT EXISTS qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES brand_campaigns(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  scanned_at timestamptz NOT NULL DEFAULT now(),
  neighborhood text
);
CREATE INDEX IF NOT EXISTS qr_scans_campaign_idx ON qr_scans(campaign_id);
CREATE INDEX IF NOT EXISTS qr_scans_scanned_at_idx ON qr_scans(scanned_at);

-- Extra taste dimensions; NULL until populated by an ETL/Claude pass.
ALTER TABLE customer_icp
  ADD COLUMN IF NOT EXISTS sweet_affinity numeric(5,2),
  ADD COLUMN IF NOT EXISTS citrus_pref numeric(5,2),
  ADD COLUMN IF NOT EXISTS carbonation_pref numeric(5,2),
  ADD COLUMN IF NOT EXISTS umami_pref numeric(5,2),
  ADD COLUMN IF NOT EXISTS bold_pref numeric(5,2);

-- Row-level security on the new brand-scoped tables only.
-- product_pairings / drink_reviews / customer_icp keep their current no-RLS
-- posture so the consumer / driver / admin apps continue to work; the brand
-- portal filters those shared tables in SQL via the partner's brand_id.

ALTER TABLE brand_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS brand_partners_self ON brand_partners;
CREATE POLICY brand_partners_self ON brand_partners
  FOR SELECT USING (supabase_user_id = (auth.uid())::text);

DROP POLICY IF EXISTS brand_partners_self_insert ON brand_partners;
CREATE POLICY brand_partners_self_insert ON brand_partners
  FOR INSERT WITH CHECK (supabase_user_id = (auth.uid())::text);

DROP POLICY IF EXISTS brand_campaigns_own ON brand_campaigns;
CREATE POLICY brand_campaigns_own ON brand_campaigns
  FOR SELECT USING (brand_id IN (
    SELECT id FROM brand_partners
    WHERE supabase_user_id = (auth.uid())::text
  ));

DROP POLICY IF EXISTS qr_scans_own ON qr_scans;
CREATE POLICY qr_scans_own ON qr_scans
  FOR SELECT USING (campaign_id IN (
    SELECT c.id FROM brand_campaigns c
    JOIN brand_partners p ON p.id = c.brand_id
    WHERE p.supabase_user_id = (auth.uid())::text
  ));

-- Add notes and location columns to the leads table
ALTER TABLE IF EXISTS leads 
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS potential_value TEXT,
  ADD COLUMN IF NOT EXISTS contact_platform TEXT;

-- Comment on the columns to document their purpose
COMMENT ON COLUMN leads.notes IS 'Additional notes about the lead';
COMMENT ON COLUMN leads.location IS 'Geographic location of the lead';
COMMENT ON COLUMN leads.potential_value IS 'Estimated potential value of this lead';
COMMENT ON COLUMN leads.contact_platform IS 'Platform used to contact this lead (LinkedIn, Email, etc.)';

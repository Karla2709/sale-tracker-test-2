-- Set the search path to our schema
SET search_path TO sales_tracker, public;

-- Function to get leads grouped by status
CREATE OR REPLACE FUNCTION get_leads_by_status()
RETURNS TABLE (
  status TEXT,
  count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    status,
    COUNT(*) as count
  FROM 
    leads
  GROUP BY 
    status
  ORDER BY 
    count DESC;
$$;

-- Function to get deals grouped by stage with sum of amounts
CREATE OR REPLACE FUNCTION get_deals_by_stage()
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  total_amount NUMERIC
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    stage,
    COUNT(*) as count,
    SUM(amount) as total_amount
  FROM 
    deals
  GROUP BY 
    stage
  ORDER BY 
    count DESC;
$$;

-- Function to get leads by company
CREATE OR REPLACE FUNCTION get_leads_by_company(company_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  position TEXT,
  email TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    id,
    name,
    position,
    email,
    status,
    created_at
  FROM 
    leads
  WHERE 
    company_id = $1
  ORDER BY 
    created_at DESC;
$$;

-- Function to get deals by lead
CREATE OR REPLACE FUNCTION get_deals_by_lead(lead_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  amount NUMERIC,
  currency TEXT,
  stage TEXT,
  close_date DATE,
  probability INTEGER,
  created_at TIMESTAMPTZ
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    id,
    title,
    amount,
    currency,
    stage,
    close_date,
    probability,
    created_at
  FROM 
    deals
  WHERE 
    lead_id = $1
  ORDER BY 
    created_at DESC;
$$;

-- Function to get interactions by lead
CREATE OR REPLACE FUNCTION get_interactions_by_lead(lead_id UUID)
RETURNS TABLE (
  id UUID,
  type TEXT,
  date TIMESTAMPTZ,
  notes TEXT,
  user_id UUID,
  user_name TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    i.id,
    i.type,
    i.date,
    i.notes,
    i.user_id,
    u.full_name as user_name
  FROM 
    interactions i
  LEFT JOIN
    users u ON i.user_id = u.id
  WHERE 
    i.lead_id = $1
  ORDER BY 
    i.date DESC;
$$;

-- Function to search leads
CREATE OR REPLACE FUNCTION search_leads(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  position TEXT,
  email TEXT,
  status TEXT,
  company_id UUID,
  company_name TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    l.id,
    l.name,
    l.position,
    l.email,
    l.status,
    l.company_id,
    c.name as company_name
  FROM 
    leads l
  LEFT JOIN
    companies c ON l.company_id = c.id
  WHERE 
    l.name ILIKE '%' || search_term || '%' OR
    l.email ILIKE '%' || search_term || '%' OR
    c.name ILIKE '%' || search_term || '%'
  ORDER BY 
    l.name ASC
  LIMIT 20;
$$; 
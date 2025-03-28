-- Enable RLS on all tables
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that we'll be replacing with role-based versions
DROP POLICY IF EXISTS "All users can view leads" ON leads;
DROP POLICY IF EXISTS "Users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can update leads" ON leads;
DROP POLICY IF EXISTS "Users can delete leads" ON leads;

-- Leads policies with RBAC
CREATE POLICY "Viewers can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Salers can insert leads" ON leads
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    user_has_role_or_higher('saler')
  );

CREATE POLICY "Salers can update leads" ON leads
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND 
    user_has_role_or_higher('saler')
  );

CREATE POLICY "Salers can delete leads" ON leads
  FOR DELETE USING (
    auth.role() = 'authenticated' AND 
    user_has_role_or_higher('saler')
  ); 
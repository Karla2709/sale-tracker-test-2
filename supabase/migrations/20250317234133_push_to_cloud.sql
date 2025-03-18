-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'pending',
  expected_close_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
DO $$
BEGIN
  -- Enable row level security if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'companies' AND rowsecurity = true
  ) THEN
    ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'leads' AND rowsecurity = true
  ) THEN
    ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'interactions' AND rowsecurity = true
  ) THEN
    ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'deals' AND rowsecurity = true
  ) THEN
    ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'tasks' AND rowsecurity = true
  ) THEN
    ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Create policies if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'companies' AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" ON companies
    FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads' AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" ON leads
    FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'interactions' AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" ON interactions
    FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'deals' AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" ON deals
    FOR ALL USING (auth.role() = 'authenticated');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'tasks' AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" ON tasks
    FOR ALL USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Seed companies - Use ON CONFLICT DO NOTHING to avoid duplicates
INSERT INTO companies (id, name, industry, website)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'Technology', 'https://acme.example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Globex', 'Manufacturing', 'https://globex.example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Initech', 'Finance', 'https://initech.example.com')
ON CONFLICT (id) DO NOTHING;

-- Seed leads - Use ON CONFLICT DO NOTHING to avoid duplicates
INSERT INTO leads (id, name, email, phone, position, status, company_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John Doe', 'john@acme.example.com', '555-1234', 'CTO', 'new', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane Smith', 'jane@globex.example.com', '555-5678', 'CEO', 'contacted', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bob Johnson', 'bob@initech.example.com', '555-9012', 'CFO', 'qualified', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (id) DO NOTHING;

-- Seed interactions - Check if they already exist before inserting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM interactions 
    WHERE lead_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' AND type = 'email'
  ) THEN
    INSERT INTO interactions (lead_id, type, notes)
    VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', 'Sent initial outreach email');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM interactions 
    WHERE lead_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND type = 'call'
  ) THEN
    INSERT INTO interactions (lead_id, type, notes)
    VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'call', 'Discussed product features');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM interactions 
    WHERE lead_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND type = 'meeting'
  ) THEN
    INSERT INTO interactions (lead_id, type, notes)
    VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'meeting', 'Presented proposal');
  END IF;
END $$;

-- Seed deals - Check if they already exist before inserting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM deals 
    WHERE lead_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' AND status = 'negotiation'
  ) THEN
    INSERT INTO deals (lead_id, amount, status, expected_close_date)
    VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 25000.00, 'negotiation', '2025-04-15');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM deals 
    WHERE lead_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND status = 'pending'
  ) THEN
    INSERT INTO deals (lead_id, amount, status, expected_close_date)
    VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 50000.00, 'pending', '2025-05-30');
  END IF;
END $$;

-- Seed tasks - Check if they already exist before inserting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM tasks 
    WHERE title = 'Follow up with John' AND lead_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  ) THEN
    INSERT INTO tasks (title, description, status, priority, due_date, lead_id)
    VALUES ('Follow up with John', 'Send product documentation', 'pending', 'high', NOW() + INTERVAL '2 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM tasks 
    WHERE title = 'Prepare proposal for Jane' AND lead_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
  ) THEN
    INSERT INTO tasks (title, description, status, priority, due_date, lead_id)
    VALUES ('Prepare proposal for Jane', 'Include custom pricing', 'in_progress', 'medium', NOW() + INTERVAL '5 days', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM tasks 
    WHERE title = 'Schedule demo with Bob' AND lead_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
  ) THEN
    INSERT INTO tasks (title, description, status, priority, due_date, lead_id)
    VALUES ('Schedule demo with Bob', 'Show new features', 'pending', 'low', NOW() + INTERVAL '7 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc');
  END IF;
END $$;

-- Schema SQL
-- Create schema for our application
CREATE SCHEMA IF NOT EXISTS sales_tracker;

-- Set the search path to our schema
SET search_path TO sales_tracker, public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_contact_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Interactions table
CREATE TABLE IF NOT EXISTS interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  stage TEXT NOT NULL DEFAULT 'proposal',
  close_date DATE,
  probability INTEGER DEFAULT 50,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_contact_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security Policies

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Users policy (users can only see and edit their own data)
CREATE POLICY "Users can view their own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Companies policies (all authenticated users can view, only admins can modify)
CREATE POLICY "All users can view companies" ON companies
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Only admins can modify companies" ON companies
  FOR ALL USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- Leads policies
CREATE POLICY "All users can view leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');
  
CREATE POLICY "Users can insert leads" ON leads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated' AND 
    EXISTS (SELECT 1 FROM interactions WHERE interactions.lead_id = leads.id AND interactions.user_id = auth.uid())
  );

-- Similar policies for interactions and deals
-- (Add more specific policies as needed)

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_contact_date when a new interaction is created
CREATE OR REPLACE FUNCTION update_last_contact_date()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leads
  SET last_contact_date = NEW.date
  WHERE id = NEW.lead_id;
  
  -- Also update the last_contact_date in any related deals
  UPDATE deals
  SET last_contact_date = NEW.date
  WHERE lead_id = NEW.lead_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_companies_modtime
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_leads_modtime
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_interactions_modtime
BEFORE UPDATE ON interactions
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_deals_modtime
BEFORE UPDATE ON deals
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Trigger to update last_contact_date when a new interaction is created
CREATE TRIGGER update_last_contact_date_trigger
AFTER INSERT OR UPDATE ON interactions
FOR EACH ROW EXECUTE FUNCTION update_last_contact_date(); 

-- Seed SQL
-- Set the search path to our schema
SET search_path TO sales_tracker, public;

-- Insert sample companies
INSERT INTO companies (name, industry, website, created_at) VALUES
('Acme Corporation', 'Technology', 'https://acme.example.com', '2024-01-05T10:00:00Z'),
('TechNova Solutions', 'Software Development', 'https://technova.example.com', '2024-01-10T14:30:00Z'),
('Global Innovations', 'Consulting', 'https://globalinnovations.example.com', '2024-01-15T09:15:00Z'),
('Quantum Enterprises', 'Manufacturing', 'https://quantum.example.com', '2024-01-20T11:45:00Z'),
('Pinnacle Systems', 'Hardware', 'https://pinnacle.example.com', '2024-01-25T16:20:00Z'),
('Horizon Financial', 'Finance', 'https://horizon.example.com', '2024-02-01T08:30:00Z'),
('Evergreen Solutions', 'Environmental', 'https://evergreen.example.com', '2024-02-05T13:10:00Z'),
('Stellar Communications', 'Telecommunications', 'https://stellar.example.com', '2024-02-10T15:45:00Z'),
('Apex Healthcare', 'Healthcare', 'https://apex.example.com', '2024-02-15T10:30:00Z'),
('Momentum Media', 'Media', 'https://momentum.example.com', '2024-02-20T14:00:00Z'),
('Fusion Dynamics', 'Energy', 'https://fusion.example.com', '2024-02-25T09:45:00Z'),
('Catalyst Research', 'Research', 'https://catalyst.example.com', '2024-03-01T11:20:00Z'),
('Elevate Education', 'Education', 'https://elevate.example.com', '2024-03-05T16:15:00Z'),
('Synergy Retail', 'Retail', 'https://synergy.example.com', '2024-03-10T08:50:00Z'),
('Precision Engineering', 'Engineering', 'https://precision.example.com', '2024-03-15T13:25:00Z');

-- Store company IDs for reference
DO $$
DECLARE
    company_ids UUID[];
    lead_ids UUID[];
    user_id UUID = '00000000-0000-0000-0000-000000000001'; -- Placeholder user ID
    i INTEGER;
    random_company_index INTEGER;
    random_date TIMESTAMPTZ;
    lead_id UUID;
    interaction_type TEXT;
    interaction_types TEXT[] := ARRAY['call', 'email', 'meeting', 'social', 'other'];
    lead_statuses TEXT[] := ARRAY['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    deal_stages TEXT[] := ARRAY['proposal', 'negotiation', 'contract', 'closed-won', 'closed-lost'];
    sources TEXT[] := ARRAY['website', 'referral', 'conference', 'social media', 'cold call', 'partner'];
    positions TEXT[] := ARRAY['CEO', 'CTO', 'CFO', 'COO', 'VP of Sales', 'VP of Marketing', 'Director', 'Manager', 'Specialist', 'Consultant'];
BEGIN
    -- Get all company IDs
    SELECT ARRAY(SELECT id FROM companies) INTO company_ids;
    
    -- Insert sample leads
    FOR i IN 1..50 LOOP
        -- Select a random company
        random_company_index := floor(random() * array_length(company_ids, 1)) + 1;
        
        -- Generate a random creation date in the past year
        random_date := NOW() - (random() * INTERVAL '365 days');
        
        -- Insert the lead
        INSERT INTO leads (
            company_id, 
            name, 
            position, 
            email, 
            phone, 
            status, 
            source, 
            notes, 
            created_at
        ) VALUES (
            company_ids[random_company_index],
            'Lead ' || i,
            positions[floor(random() * array_length(positions, 1)) + 1],
            'lead' || i || '@example.com',
            '+1-555-' || LPAD(CAST(floor(random() * 10000) AS TEXT), 4, '0'),
            lead_statuses[floor(random() * array_length(lead_statuses, 1)) + 1],
            sources[floor(random() * array_length(sources, 1)) + 1],
            'Notes for lead ' || i,
            random_date
        ) RETURNING id INTO lead_id;
        
        -- Add to lead_ids array
        lead_ids := array_append(lead_ids, lead_id);
        
        -- Add 1-3 interactions for each lead
        FOR j IN 1..floor(random() * 3) + 1 LOOP
            -- Generate a random interaction date after lead creation
            random_date := random_date + (random() * INTERVAL '60 days');
            
            -- Select random interaction type
            interaction_type := interaction_types[floor(random() * array_length(interaction_types, 1)) + 1];
            
            -- Insert the interaction
            INSERT INTO interactions (
                lead_id,
                user_id,
                type,
                date,
                notes,
                created_at
            ) VALUES (
                lead_id,
                user_id,
                interaction_type,
                random_date,
                'Interaction ' || j || ' with lead ' || i,
                random_date
            );
        END LOOP;
        
        -- Add a deal for some leads (about 60%)
        IF random() < 0.6 THEN
            -- Generate a random deal date after lead creation
            random_date := random_date + (random() * INTERVAL '30 days');
            
            -- Insert the deal
            INSERT INTO deals (
                lead_id,
                user_id,
                title,
                amount,
                currency,
                stage,
                close_date,
                probability,
                notes,
                created_at
            ) VALUES (
                lead_id,
                user_id,
                'Deal for ' || 'Lead ' || i,
                (random() * 100000)::DECIMAL(12,2),
                'USD',
                deal_stages[floor(random() * array_length(deal_stages, 1)) + 1],
                (random_date + INTERVAL '30 days')::DATE,
                floor(random() * 100),
                'Deal notes for lead ' || i,
                random_date
            );
        END IF;
    END LOOP;
END $$; 
-- Add sample tasks
DO 95723
DECLARE
    lead_ids UUID[];
    user_id UUID = '00000000-0000-0000-0000-000000000001'; -- Placeholder user ID
    i INTEGER;
    random_lead_index INTEGER;
    random_date TIMESTAMPTZ;
    task_statuses TEXT[] := ARRAY['pending', 'in_progress', 'completed', 'cancelled'];
    task_titles TEXT[] := ARRAY['Follow up call', 'Send proposal', 'Schedule demo', 'Check references', 'Send contract', 'Quarterly review'];
BEGIN
    -- Get all lead IDs
    SELECT ARRAY(SELECT id FROM leads) INTO lead_ids;
    
    -- Insert sample tasks
    FOR i IN 1..30 LOOP
        -- Select a random lead
        random_lead_index := floor(random() * array_length(lead_ids, 1)) + 1;
        
        -- Generate a random due date in the future
        random_date := NOW() + (random() * INTERVAL '30 days');
        
        -- Insert the task
        INSERT INTO tasks (
            lead_id,
            user_id,
            title,
            description,
            due_date,
            status,
            created_at
        ) VALUES (
            lead_ids[random_lead_index],
            user_id,
            task_titles[floor(random() * array_length(task_titles, 1)) + 1],
            'Task description for task ' || i,
            random_date,
            task_statuses[floor(random() * array_length(task_statuses, 1)) + 1],
            NOW() - (random() * INTERVAL '10 days')
        );
    END LOOP;
END 95723;
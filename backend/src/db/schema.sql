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
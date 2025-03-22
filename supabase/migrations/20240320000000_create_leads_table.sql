-- Drop existing tables if they exist
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table with new schema
CREATE TABLE leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN (
        'New',
        'Reached Out',
        'Meeting Scheduled',
        'First Meeting Complete',
        'Second Meeting Completed',
        'In Dilligence',
        'Close Deal',
        'Prospect Decline'
    )),
    client_domain VARCHAR(50) NOT NULL CHECK (client_domain IN (
        'Container Shipping',
        'Ecommerce',
        'Healthcare',
        'Others'
    )),
    contact_platform VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact_date TIMESTAMP WITH TIME ZONE,
    note TEXT CHECK (length(note) <= 4000)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_contact_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_last_contact
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert seed data
INSERT INTO leads (
    name,
    email,
    phone,
    status,
    client_domain,
    contact_platform,
    location,
    created_at,
    last_contact_date,
    note
) VALUES
    (
        'John Smith',
        'john.smith@maersk.com',
        '+1 (555) 123-4567',
        'New',
        'Container Shipping',
        'LinkedIn',
        'United States',
        '2024-03-15 10:00:00+00',
        '2024-03-15 10:00:00+00',
        'Initial contact through LinkedIn. Interested in supply chain optimization.'
    ),
    (
        'Sarah Johnson',
        'sarah.j@shopify.com',
        '+1 (555) 234-5678',
        'Reached Out',
        'Ecommerce',
        'Email',
        'United States',
        '2024-03-10 09:30:00+00',
        '2024-03-16 14:20:00+00',
        'Potential integration with Shopify platform.'
    ),
    (
        'Dr. Michael Chen',
        'mchen@healthcare.org',
        '+1 (555) 345-6789',
        'Meeting Scheduled',
        'Healthcare',
        'Conference',
        'United States',
        '2024-03-05 15:45:00+00',
        '2024-03-17 11:00:00+00',
        'Met at Healthcare Innovation Summit. Meeting scheduled for next week.'
    ),
    (
        'Nguyen Van Anh',
        'vananh@vingroup.vn',
        '+84 90 123 4567',
        'First Meeting Complete',
        'Others',
        'Referral',
        'Vietnam',
        '2024-03-01 08:00:00+00',
        '2024-03-15 09:30:00+00',
        'Positive first meeting. Interested in technology integration.'
    ),
    (
        'Emily Davis',
        'emily.d@evergreen.com',
        '+1 (555) 456-7890',
        'Second Meeting Completed',
        'Container Shipping',
        'Website',
        'United States',
        '2024-02-28 11:20:00+00',
        '2024-03-14 16:45:00+00',
        'Second meeting focused on technical requirements. Very promising.'
    ),
    (
        'Le Minh Tuan',
        'tuanlm@tiki.vn',
        '+84 90 234 5678',
        'In Dilligence',
        'Ecommerce',
        'Email',
        'Vietnam',
        '2024-02-25 13:15:00+00',
        '2024-03-18 10:30:00+00',
        'Currently reviewing technical documentation and pricing.'
    ),
    (
        'David Wilson',
        'dwilson@hospital.com',
        '+1 (555) 567-8901',
        'Close Deal',
        'Healthcare',
        'LinkedIn',
        'United States',
        '2024-02-20 14:30:00+00',
        '2024-03-19 15:00:00+00',
        'Contract signed. Implementation starting next month.'
    ),
    (
        'Tran Thi Mai',
        'mai.tran@vinmec.vn',
        '+84 90 345 6789',
        'Prospect Decline',
        'Healthcare',
        'Conference',
        'Vietnam',
        '2024-02-15 09:45:00+00',
        '2024-03-13 11:20:00+00',
        'Budget constraints. May revisit next fiscal year.'
    ),
    (
        'James Anderson',
        'james.a@cosco.com',
        '+1 (555) 789-0123',
        'Meeting Scheduled',
        'Container Shipping',
        'Industry Event',
        'United States',
        '2024-02-10 13:30:00+00',
        '2024-03-18 09:15:00+00',
        'Met at Global Shipping Summit. Interested in automation solutions.'
    ),
    (
        'Pham Thi Hong',
        'hong.pham@fpt.com.vn',
        '+84 90 456 7890',
        'First Meeting Complete',
        'Others',
        'Partner Referral',
        'Vietnam',
        '2024-02-05 10:15:00+00',
        '2024-03-17 14:45:00+00',
        'Strong interest in digital transformation. Technical team review scheduled.'
    ); 
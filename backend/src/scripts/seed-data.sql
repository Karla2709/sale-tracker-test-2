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
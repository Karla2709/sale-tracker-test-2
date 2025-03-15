-- Seed companies
INSERT INTO companies (id, name, industry, website)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'Technology', 'https://acme.example.com'),
  ('22222222-2222-2222-2222-222222222222', 'Globex', 'Manufacturing', 'https://globex.example.com'),
  ('33333333-3333-3333-3333-333333333333', 'Initech', 'Finance', 'https://initech.example.com');

-- Seed leads
INSERT INTO leads (id, name, email, phone, position, status, company_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'John Doe', 'john@acme.example.com', '555-1234', 'CTO', 'new', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Jane Smith', 'jane@globex.example.com', '555-5678', 'CEO', 'contacted', '22222222-2222-2222-2222-222222222222'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Bob Johnson', 'bob@initech.example.com', '555-9012', 'CFO', 'qualified', '33333333-3333-3333-3333-333333333333');

-- Seed interactions
INSERT INTO interactions (lead_id, type, notes)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'email', 'Sent initial outreach email'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'call', 'Discussed product features'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'meeting', 'Presented proposal');

-- Seed deals
INSERT INTO deals (lead_id, amount, status, expected_close_date)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 25000.00, 'negotiation', '2025-04-15'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 50000.00, 'pending', '2025-05-30');

-- Seed tasks
INSERT INTO tasks (title, description, status, priority, due_date, lead_id)
VALUES
  ('Follow up with John', 'Send product documentation', 'pending', 'high', NOW() + INTERVAL '2 days', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('Prepare proposal for Jane', 'Include custom pricing', 'in_progress', 'medium', NOW() + INTERVAL '5 days', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
  ('Schedule demo with Bob', 'Show new features', 'pending', 'low', NOW() + INTERVAL '7 days', 'cccccccc-cccc-cccc-cccc-cccccccccccc'); 
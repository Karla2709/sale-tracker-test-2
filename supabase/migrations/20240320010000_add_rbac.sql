-- Create role enum
CREATE TYPE user_role AS ENUM ('viewer', 'saler');

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to check user role
CREATE OR REPLACE FUNCTION check_user_role(required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT role::text = required_role
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has at least a specific role level (for hierarchy)
CREATE OR REPLACE FUNCTION user_has_role_or_higher(required_minimum_role text)
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT
      CASE
        WHEN required_minimum_role = 'viewer' THEN TRUE -- Everyone has at least viewer access
        WHEN required_minimum_role = 'saler' THEN (role::text = 'saler')
        ELSE FALSE -- Any unknown roles default to no access
      END
    FROM users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_user_role IS 'Checks if the current user has a specific role';
COMMENT ON FUNCTION user_has_role_or_higher IS 'Checks if the current user has at least the specified role level'; 
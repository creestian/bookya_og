-- Add missing columns to existing users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS username character varying UNIQUE,
ADD COLUMN IF NOT EXISTS title character varying DEFAULT 'Professional',
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS timezone character varying DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS meeting_duration integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT now();

-- Add missing columns to existing bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS host_id uuid REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS host_email character varying,
ADD COLUMN IF NOT EXISTS host_name character varying,
ADD COLUMN IF NOT EXISTS booking_date date,
ADD COLUMN IF NOT EXISTS booking_time time without time zone,
ADD COLUMN IF NOT EXISTS meeting_link text,
ADD COLUMN IF NOT EXISTS updated_at timestamp without time zone DEFAULT now();

-- Update existing bookings to use new column names (migrate data)
UPDATE public.bookings 
SET 
  host_name = client_name,
  host_email = client_email
WHERE host_name IS NULL AND host_email IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their bookings" ON bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Hosts can update their bookings" ON bookings;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (email = auth.jwt() ->> 'email');

-- Create RLS policies for bookings table
CREATE POLICY "Users can view their bookings" ON bookings
  FOR SELECT USING (
    host_email = auth.jwt() ->> 'email' OR 
    client_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Hosts can update their bookings" ON bookings
  FOR UPDATE USING (host_email = auth.jwt() ->> 'email');

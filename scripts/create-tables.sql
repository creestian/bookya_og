-- Create users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  username TEXT UNIQUE,
  title TEXT DEFAULT 'Professional',
  bio TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  meeting_duration INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table for storing booking information
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  host_email TEXT NOT NULL,
  host_name TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  message TEXT,
  meeting_link TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

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
    guest_email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Hosts can update their bookings" ON bookings
  FOR UPDATE USING (host_email = auth.jwt() ->> 'email');

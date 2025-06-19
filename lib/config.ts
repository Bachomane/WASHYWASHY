// Supabase Configuration
// To set up your Supabase project:
// 1. Go to https://supabase.com and create a new project
// 2. Get your project URL and anon key from Settings > API
// 3. Create a .env file in your project root with:
//    EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
//    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

export const config = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY',
  },
};

// Database schema setup instructions:
/*
1. Create the following tables in your Supabase database:

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT NOT NULL,
  plate TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('upcoming', 'completed', 'in-progress', 'cancelled')) DEFAULT 'upcoming',
  service TEXT NOT NULL,
  washer TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  has_interior_wash BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cars INTEGER NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'cancelled')) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  add_ons TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

2. Enable Row Level Security (RLS) and create policies:

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can only access own data" ON users
  FOR ALL USING (auth.uid()::text = id::text);

CREATE POLICY "Users can only access own vehicles" ON vehicles
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can only access own bookings" ON bookings
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can only access own subscriptions" ON subscriptions
  FOR ALL USING (auth.uid()::text = user_id::text);

3. Enable phone authentication in Supabase Auth settings
*/ 
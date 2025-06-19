# 🚀 Supabase Setup Guide for WashyApp

## 📋 Prerequisites
- A Supabase account (free at https://supabase.com)
- Your WashyApp project ready
- Twilio account (for SMS authentication)

## 🎯 Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com
   - Sign up/Login with your account
   - Click "New Project"

2. **Project Setup**
   - **Name**: `washyapp` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users (e.g., `West Europe` for UAE)
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see "Project is ready" when complete

## 🗄️ Step 2: Create Database Tables

1. **Go to SQL Editor**
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the following SQL commands:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to Supabase Auth)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for vehicles table
CREATE POLICY "Users can view own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Insert sample data (optional - for testing)
-- You can run this after creating a user account

-- Sample subscription plans (static data)
CREATE TABLE plan_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cars INTEGER NOT NULL,
  description TEXT,
  features TEXT[]
);

INSERT INTO plan_templates (id, name, price, cars, description, features) VALUES
('sapphire-single', 'Sapphire Single', 160.00, 1, 'Premium care for a single ride, flawless shine every time!', ARRAY['Exterior wash twice weekly', 'High-pressure pre-rinse', 'Foam cannon snow application', 'Hand wash with microfiber mitts', 'Wheel and rim wipe', 'Final microfiber towel dry', 'Same washer assigned (Emmanuel)', 'WhatsApp updates & reminders']),
('emerald-duo', 'Emerald Duo', 220.00, 2, 'Double the cars, double the shine! Premium care for your duo!', ARRAY['Exterior wash twice weekly', 'High-pressure pre-rinse', 'Foam cannon snow application', 'Hand wash with microfiber mitts', 'Wheel and rim wipe', 'Final microfiber towel dry', 'Same washer assigned (Emmanuel)', 'WhatsApp updates & reminders']),
('diamond-deluxe', 'Diamond Deluxe', 260.00, 3, 'Luxury care for 3+ cars because every vehicle deserves a diamond standard shine!', ARRAY['Exterior wash twice weekly', 'High-pressure pre-rinse', 'Foam cannon snow application', 'Hand wash with microfiber mitts', 'Wheel and rim wipe', 'Final microfiber towel dry', 'Same washer assigned (Emmanuel)', 'WhatsApp updates & reminders']);
```

3. **Click "Run" to execute the SQL**

## 📱 Step 4: Configure Authentication

1. **Go to Authentication Settings**
   - In Supabase dashboard, click "Authentication" → "Settings"

2. **Enable Phone Auth**
   - Scroll to "Phone Auth"
   - Enable "Enable phone confirmations"
   - For development, you can use test phone numbers

3. **Configure SMS Provider (Twilio)**

### Option A: Use Twilio (Recommended for Production)

1. **Create Twilio Account**
   - Go to https://www.twilio.com
   - Sign up for a free account
   - Get your Account SID and Auth Token

2. **Get a Twilio Phone Number**
   - In Twilio Console, go to "Phone Numbers" → "Manage" → "Buy a number"
   - Buy a phone number (preferably UAE number for your app)

3. **Configure Twilio in Supabase**
   - In Supabase Dashboard, go to "Authentication" → "Settings" → "SMS Provider"
   - Select "Twilio"
   - Enter your Twilio credentials:
     - **Account SID**: Your Twilio Account SID
     - **Auth Token**: Your Twilio Auth Token
     - **Message Service ID**: Your Twilio phone number (with country code, e.g., +971501234567)

### Option B: Use Supabase Test Mode (For Development)

1. **Enable Test Mode**
   - In Supabase Dashboard, go to "Authentication" → "Settings" → "SMS Provider"
   - Select "Test mode"
   - This allows you to test without real SMS

2. **Test Phone Numbers**
   - Use these test numbers for development:
     - `+1234567890` (US)
     - `+971501234567` (UAE)
   - Any 6-digit code will work for verification

## 🔑 Step 5: Get API Credentials

1. **Go to API Settings**
   - Click "Settings" → "API" in the left sidebar

2. **Copy Credentials**
   - **Project URL**: Copy the "Project URL"
   - **Anon Key**: Copy the "anon public" key

## ⚙️ Step 6: Configure Your App

1. **Create Environment File**
   - In your WashyApp project root, create a `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Replace Placeholder Values**
   - Replace `your-project-id` with your actual project ID
   - Replace `your-anon-key-here` with your actual anon key

## 🧪 Step 7: Test the Setup

1. **Start Your App**
   ```bash
   npx expo start --clear
   ```

2. **Test Authentication**
   - Try signing up with a phone number
   - Check if OTP is received
   - Verify login works

3. **Check Database**
   - Go to Supabase Dashboard → "Table Editor"
   - You should see your tables and any test data

## 🚀 Step 8: Enable Real-time Features

1. **Real-time is automatically enabled**
   - Supabase provides real-time subscriptions out of the box
   - No additional configuration needed

## 📊 Step 9: Monitor Usage

1. **Check Usage Dashboard**
   - Go to Supabase Dashboard → "Usage"
   - Monitor API calls, database usage, etc.

2. **Set Up Alerts (Optional)**
   - Configure usage alerts for when you approach limits

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid API key" error**
   - Double-check your `.env` file
   - Make sure you're using the anon key, not the service role key

2. **"RLS policy violation" error**
   - Check that RLS policies are correctly set up
   - Verify user authentication is working

3. **"Twilio Authentication Error - invalid username"**
   - **Solution**: Your Twilio credentials are not properly configured
   - **Steps to fix**:
     1. Go to Supabase Dashboard → "Authentication" → "Settings" → "SMS Provider"
     2. Verify your Twilio Account SID and Auth Token are correct
     3. Make sure your Twilio phone number is properly formatted
     4. Check that your Twilio account is active and has credits
     5. For testing, switch to "Test mode" temporarily

4. **"Error sending confirmation OTP to provider"**
   - **Solution**: SMS provider configuration issue
   - **Steps to fix**:
     1. Check your SMS provider settings in Supabase
     2. Verify phone number format (should include country code)
     3. Ensure your Twilio account has sufficient credits
     4. Try using test mode for development

### Quick Fix for Development:

If you're getting Twilio errors and want to test quickly:

1. **Switch to Test Mode**:
   - Go to Supabase Dashboard → "Authentication" → "Settings" → "SMS Provider"
   - Select "Test mode" instead of Twilio
   - Use test phone numbers like `+1234567890`
   - Any 6-digit code will work for verification

2. **Test Phone Numbers for Development**:
   - US: `+1234567890`
   - UAE: `+971501234567`
   - Any other number with proper country code

### Production Checklist:

Before going live, ensure:
- [ ] Twilio account is properly configured
- [ ] Twilio phone number is verified
- [ ] Sufficient Twilio credits
- [ ] RLS policies are tested
- [ ] Database tables are created
- [ ] Environment variables are set correctly

## 🎉 You're Ready!

Your WashyApp is now connected to Supabase with:
- ✅ User authentication with phone numbers
- ✅ Secure database with RLS
- ✅ Real-time updates
- ✅ Scalable infrastructure

The app will now:
- Save user data to the cloud
- Sync across devices
- Provide real-time booking updates
- Scale automatically as you grow

Happy coding! 🚗💧 
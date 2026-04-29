-- UniLost Advanced AI-Powered Schema

-- 0. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. ENUMS
CREATE TYPE item_status AS ENUM (
  'open',
  'claimed',
  'resolved',
  'expired',
  'donated'
);

CREATE TYPE transaction_type AS ENUM (
  'reward',
  'referral',
  'bonus'
);

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  student_id TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  credits INTEGER DEFAULT 0 NOT NULL,
  contributor_badge TEXT DEFAULT 'Newcomer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure 'role' column exists (migration helper)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='student_id') THEN
        ALTER TABLE profiles ADD COLUMN student_id TEXT;
    END IF;
END $$;


-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, student_id, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'student_id',
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. LOST ITEMS (Text + Image embeddings)
CREATE TABLE IF NOT EXISTS lost_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT, -- Optional for lost items
  image_embedding vector(512), 
  text_embedding vector(512), -- Semantic text embedding
  location TEXT NOT NULL,
  date_lost DATE NOT NULL,
  contact_info TEXT,
  reward_amount INTEGER DEFAULT 0,
  tags TEXT[], -- Array of tags
  status item_status DEFAULT 'open' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. FOUND ITEMS (Text + Image embeddings + Expiry)
CREATE TABLE IF NOT EXISTS found_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL, -- Mandatory for found items
  image_embedding vector(512),
  text_embedding vector(512),
  location TEXT NOT NULL,
  date_found DATE NOT NULL,
  contact_info TEXT,
  tags TEXT[], -- Array of tags
  status item_status DEFAULT 'open' NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days') NOT NULL,
  is_donated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. MATCHES (AI Tracking)
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lost_item_id UUID REFERENCES lost_items(id) ON DELETE CASCADE,
  found_item_id UUID REFERENCES found_items(id) ON DELETE CASCADE,
  confidence_score FLOAT NOT NULL, -- Percentage (0-100)
  match_type TEXT DEFAULT 'AI' NOT NULL, -- 'AI' or 'Manual'
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. REWARD TRANSACTIONS
CREATE TABLE IF NOT EXISTS reward_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type transaction_type DEFAULT 'reward' NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'match', 'expiry', 'reward', 'system'
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. FUNCTIONS & TRIGGERS

-- Function to handle successful recovery rewards
CREATE OR REPLACE FUNCTION handle_recovery_reward()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    -- Award credits to the found item uploader
    UPDATE profiles 
    SET credits = credits + 100 
    WHERE id = (SELECT user_id FROM found_items WHERE id = NEW.found_item_id);
    
    -- Record transaction
    INSERT INTO reward_transactions (user_id, amount, description)
    VALUES (
      (SELECT user_id FROM found_items WHERE id = NEW.found_item_id),
      100,
      'Reward for successful item recovery'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rewards
-- Assuming 'matches' table records the resolution
-- CREATE TRIGGER on_recovery_resolved
-- AFTER UPDATE ON matches
-- FOR EACH ROW EXECUTE FUNCTION handle_recovery_reward();

-- Advanced AI Matching Function (Hybrid Search)
CREATE OR REPLACE FUNCTION find_intelligent_matches(
  p_text_embedding vector(512), 
  p_image_embedding vector(512) DEFAULT NULL,
  p_threshold float DEFAULT 0.5,
  p_limit int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  image_url text,
  confidence_score float,
  category text,
  location text,
  status item_status
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.title,
    f.image_url,
    (
      (1 - (f.text_embedding <=> p_text_embedding)) * 0.4 + -- Text relevance 40%
      (CASE WHEN p_image_embedding IS NOT NULL AND f.image_embedding IS NOT NULL 
            THEN (1 - (f.image_embedding <=> p_image_embedding)) 
            ELSE 0 END) * 0.6 -- Image relevance 60%
    ) * 100 AS confidence_score,
    f.category,
    f.location,
    f.status
  FROM found_items f
  WHERE f.status = 'open'
    AND (
      (1 - (f.text_embedding <=> p_text_embedding)) > p_threshold OR
      (p_image_embedding IS NOT NULL AND f.image_embedding IS NOT NULL AND (1 - (f.image_embedding <=> p_image_embedding)) > p_threshold)
    )
  ORDER BY confidence_score DESC
  LIMIT p_limit;
END;
$$;

-- 9. RLS POLICIES (Row Level Security)


-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Lost Items
ALTER TABLE lost_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lost items are viewable by everyone" ON lost_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own lost items" ON lost_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lost items" ON lost_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lost items" ON lost_items
  FOR DELETE USING (auth.uid() = user_id);

-- Found Items
ALTER TABLE found_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Found items are viewable by everyone" ON found_items
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own found items" ON found_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own found items" ON found_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own found items" ON found_items
  FOR DELETE USING (auth.uid() = user_id);

-- Matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches related to their items" ON matches
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lost_items WHERE id = lost_item_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM found_items WHERE id = found_item_id AND user_id = auth.uid())
  );

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Reward Transactions
ALTER TABLE reward_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON reward_transactions
  FOR SELECT USING (auth.uid() = user_id);


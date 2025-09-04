-- Custodian Economy Platform - Supabase Database Schema
-- Execute this in your Supabase SQL Editor to create all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- CORE SYSTEM TABLES
-- =====================================================================

-- System Metrics Table
CREATE TABLE IF NOT EXISTS metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT DEFAULT 'anonymous',
    stories_analyzed INTEGER DEFAULT 0,
    brand_tests_active INTEGER DEFAULT 0,
    content_items INTEGER DEFAULT 0,
    brand_score REAL DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT DEFAULT 'anonymous',
    type TEXT NOT NULL CHECK (type IN ('content', 'brand', 'analytics', 'system')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Users Table (for staff authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('staff', 'admin')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    password_hash TEXT NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'))
);

-- =====================================================================
-- CONTENT MANAGEMENT TABLES
-- =====================================================================

-- Stories Table
CREATE TABLE IF NOT EXISTS stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    participant_name TEXT NOT NULL,
    participant_age INTEGER,
    location TEXT,
    date_recorded DATE,
    themes TEXT[] DEFAULT ARRAY[]::TEXT[],
    impact_level TEXT CHECK (impact_level IN ('individual', 'family', 'community', 'business')),
    summary TEXT,
    transcript_id TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id TEXT DEFAULT 'anonymous'
);

-- Media Assets Table
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    category TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    uploaded_by TEXT DEFAULT 'anonymous',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Brand Analysis Table
CREATE TABLE IF NOT EXISTS brand_analyses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    brand_values_demonstrated JSONB DEFAULT '[]',
    authenticity_score REAL DEFAULT 0,
    emotional_resonance REAL DEFAULT 0,
    community_impact REAL DEFAULT 0,
    overall_score REAL DEFAULT 0,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analyst_id TEXT DEFAULT 'system'
);

-- =====================================================================
-- BRAND TESTING TABLES
-- =====================================================================

-- Brand Tests Table
CREATE TABLE IF NOT EXISTS brand_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    test_type TEXT NOT NULL CHECK (test_type IN ('messaging', 'visual', 'content', 'strategy')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'paused')),
    start_date DATE,
    end_date DATE,
    target_audience TEXT,
    hypothesis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author_id TEXT DEFAULT 'anonymous'
);

-- Brand Test Variants Table
CREATE TABLE IF NOT EXISTS brand_test_variants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES brand_tests(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    content JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brand Test Results Table
CREATE TABLE IF NOT EXISTS brand_test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES brand_tests(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES brand_test_variants(id) ON DELETE CASCADE,
    participant_id TEXT,
    response_data JSONB DEFAULT '{}',
    engagement_score REAL DEFAULT 0,
    conversion_score REAL DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================================
-- BACKUP SYSTEM TABLES
-- =====================================================================

-- Backup Metadata Table
CREATE TABLE IF NOT EXISTS backups (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    size_bytes BIGINT DEFAULT 0,
    checksum TEXT,
    data_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'creating' CHECK (status IN ('creating', 'completed', 'failed', 'corrupted')),
    created_by TEXT DEFAULT 'system',
    description TEXT,
    metadata JSONB DEFAULT '{}'
);

-- =====================================================================
-- SEARCH AND INDEXING
-- =====================================================================

-- Search History Table
CREATE TABLE IF NOT EXISTS search_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT DEFAULT 'anonymous',
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    results_count INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Searches Table
CREATE TABLE IF NOT EXISTS saved_searches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    query TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    user_id TEXT DEFAULT 'anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    use_count INTEGER DEFAULT 0
);

-- =====================================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================================

-- Metrics indexes
CREATE INDEX IF NOT EXISTS idx_metrics_user_id ON metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_metrics_last_updated ON metrics(last_updated);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);

-- Stories indexes
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_themes ON stories USING GIN(themes);
CREATE INDEX IF NOT EXISTS idx_stories_tags ON stories USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_stories_date_recorded ON stories(date_recorded);
CREATE INDEX IF NOT EXISTS idx_stories_impact_level ON stories(impact_level);

-- Media indexes
CREATE INDEX IF NOT EXISTS idx_media_category ON media_assets(category);
CREATE INDEX IF NOT EXISTS idx_media_tags ON media_assets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_at ON media_assets(uploaded_at);

-- Brand tests indexes
CREATE INDEX IF NOT EXISTS idx_brand_tests_status ON brand_tests(status);
CREATE INDEX IF NOT EXISTS idx_brand_tests_type ON brand_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_brand_tests_dates ON brand_tests(start_date, end_date);

-- Search indexes
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_timestamp ON search_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Basic policies for authenticated users
-- Note: You may want to customize these based on your specific security requirements

-- Allow authenticated users to read/write their own data
CREATE POLICY "Users can manage their own metrics" ON metrics
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                   OR user_id = 'anonymous');

CREATE POLICY "Users can manage their own activities" ON activities
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                   OR user_id = 'anonymous');

-- Allow staff/admin access to content
CREATE POLICY "Authenticated users can manage content" ON stories
    FOR ALL USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Authenticated users can manage media" ON media_assets
    FOR ALL USING (auth.jwt() IS NOT NULL);

-- Allow authenticated users to manage brand data
CREATE POLICY "Authenticated users can manage brand analyses" ON brand_analyses
    FOR ALL USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Authenticated users can manage brand tests" ON brand_tests
    FOR ALL USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Authenticated users can manage test variants" ON brand_test_variants
    FOR ALL USING (auth.jwt() IS NOT NULL);

CREATE POLICY "Authenticated users can manage test results" ON brand_test_results
    FOR ALL USING (auth.jwt() IS NOT NULL);

-- Admin-only access to backups and users
CREATE POLICY "Admin users can manage backups" ON backups
    FOR ALL USING (
        (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
    );

CREATE POLICY "Admin users can manage users" ON users
    FOR ALL USING (
        (current_setting('request.jwt.claims', true)::json->>'role')::text = 'admin'
    );

-- Allow users to manage their own search data
CREATE POLICY "Users can manage their own search history" ON search_history
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                   OR user_id = 'anonymous');

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
    FOR ALL USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                   OR user_id = 'anonymous');

-- =====================================================================
-- INITIAL DATA
-- =====================================================================

-- Insert default admin user (password should be hashed in production)
INSERT INTO users (email, username, name, role, permissions, password_hash) 
VALUES (
    'admin@custodianeconomy.org',
    'admin',
    'System Administrator',
    'admin',
    ARRAY['read', 'write', 'delete', 'admin'],
    'admin2024'  -- In production, this should be properly hashed
) ON CONFLICT (username) DO NOTHING;

-- Insert default staff user
INSERT INTO users (email, username, name, role, permissions, password_hash)
VALUES (
    'staff@custodianeconomy.org',
    'staff',
    'Staff Member',
    'staff',
    ARRAY['read', 'write'],
    'custodian2024'  -- In production, this should be properly hashed
) ON CONFLICT (username) DO NOTHING;

-- Insert initial metrics
INSERT INTO metrics (user_id, stories_analyzed, brand_tests_active, content_items, brand_score)
VALUES ('anonymous', 0, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update metrics when stories are added
CREATE OR REPLACE FUNCTION update_metrics_on_story_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Update content_items count in metrics
    UPDATE metrics 
    SET 
        content_items = (SELECT COUNT(*) FROM stories WHERE status = 'published'),
        last_updated = NOW()
    WHERE user_id = 'anonymous';
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Add trigger for automatic metrics updates
CREATE TRIGGER update_metrics_on_story_change 
    AFTER INSERT OR UPDATE OR DELETE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_metrics_on_story_change();
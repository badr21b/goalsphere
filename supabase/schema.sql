-- GoalSphere Supabase Database Schema
-- This file contains the complete database schema for the GoalSphere application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    image_url VARCHAR(1000),
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    related_team_ids UUID[] DEFAULT '{}',
    related_player_ids UUID[] DEFAULT '{}',
    is_breaking BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    external_id VARCHAR(200),
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    logo_url VARCHAR(1000),
    league VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    founded INTEGER,
    stadium VARCHAR(200),
    website VARCHAR(500),
    social_media JSONB DEFAULT '{}',
    external_id VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    position VARCHAR(50) NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    nationality VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    image_url VARCHAR(1000),
    external_id VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live scores table
CREATE TABLE live_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_team VARCHAR(200) NOT NULL,
    away_team VARCHAR(200) NOT NULL,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('live', 'finished', 'upcoming')),
    league VARCHAR(50) NOT NULL,
    minute INTEGER,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    external_id VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad units table
CREATE TABLE ad_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('banner', 'in-article', 'video')),
    position VARCHAR(20) NOT NULL CHECK (position IN ('header', 'footer', 'sidebar', 'in-content')),
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    target_category VARCHAR(50),
    click_count INTEGER DEFAULT 0,
    impression_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content ingestion jobs table
CREATE TABLE content_ingestion_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    articles_processed INTEGER DEFAULT 0,
    articles_created INTEGER DEFAULT 0,
    articles_updated INTEGER DEFAULT 0,
    errors TEXT[] DEFAULT '{}',
    categories VARCHAR(50)[] DEFAULT '{}',
    force_refresh BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source configurations table
CREATE TABLE source_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) UNIQUE NOT NULL,
    api_key VARCHAR(500),
    base_url VARCHAR(500),
    rate_limit INTEGER DEFAULT 100,
    last_sync TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad clicks tracking table
CREATE TABLE ad_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_unit_id UUID REFERENCES ad_units(id) ON DELETE CASCADE,
    user_id UUID,
    page_url VARCHAR(1000),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Ingestion errors table
CREATE TABLE ingestion_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES content_ingestion_jobs(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL,
    error_message TEXT NOT NULL,
    error_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_team_ids ON articles USING GIN(related_team_ids);
CREATE INDEX idx_articles_external_id ON articles(external_id);
CREATE INDEX idx_articles_title_search ON articles USING GIN(to_tsvector('arabic', title));
CREATE INDEX idx_articles_body_search ON articles USING GIN(to_tsvector('arabic', body));

CREATE INDEX idx_teams_league ON teams(league);
CREATE INDEX idx_teams_external_id ON teams(external_id);
CREATE INDEX idx_teams_name_search ON teams USING GIN(to_tsvector('arabic', name_ar));

CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_external_id ON players(external_id);

CREATE INDEX idx_live_scores_status ON live_scores(status);
CREATE INDEX idx_live_scores_league ON live_scores(league);
CREATE INDEX idx_live_scores_start_time ON live_scores(start_time);
CREATE INDEX idx_live_scores_external_id ON live_scores(external_id);

CREATE INDEX idx_ad_units_active ON ad_units(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_ad_units_position ON ad_units(position);
CREATE INDEX idx_ad_units_type ON ad_units(type);

CREATE INDEX idx_content_ingestion_jobs_status ON content_ingestion_jobs(status);
CREATE INDEX idx_content_ingestion_jobs_source ON content_ingestion_jobs(source);
CREATE INDEX idx_content_ingestion_jobs_created_at ON content_ingestion_jobs(created_at DESC);

CREATE INDEX idx_ad_clicks_ad_unit_id ON ad_clicks(ad_unit_id);
CREATE INDEX idx_ad_clicks_timestamp ON ad_clicks(timestamp);

CREATE INDEX idx_ingestion_errors_job_id ON ingestion_errors(job_id);
CREATE INDEX idx_ingestion_errors_created_at ON ingestion_errors(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_errors ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables
CREATE POLICY "Public read access for articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read access for teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read access for players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read access for live_scores" ON live_scores FOR SELECT USING (true);
CREATE POLICY "Public read access for ad_units" ON ad_units FOR SELECT USING (true);

-- Admin access for content ingestion
CREATE POLICY "Admin access for content_ingestion_jobs" ON content_ingestion_jobs FOR ALL USING (true);
CREATE POLICY "Admin access for source_configurations" ON source_configurations FOR ALL USING (true);
CREATE POLICY "Admin access for ad_clicks" ON ad_clicks FOR ALL USING (true);
CREATE POLICY "Admin access for ingestion_errors" ON ingestion_errors FOR ALL USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_units_updated_at BEFORE UPDATE ON ad_units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_source_configurations_updated_at BEFORE UPDATE ON source_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Functions for content ingestion
CREATE OR REPLACE FUNCTION process_external_article(article_data JSONB)
RETURNS JSONB AS $$
DECLARE
    article_id UUID;
    existing_article articles%ROWTYPE;
    result JSONB;
BEGIN
    -- Check if article already exists by external_id
    SELECT * INTO existing_article 
    FROM articles 
    WHERE external_id = (article_data->>'external_id')::VARCHAR;
    
    IF existing_article.id IS NOT NULL THEN
        -- Update existing article
        UPDATE articles SET
            title = (article_data->>'title')::VARCHAR,
            body = (article_data->>'body')::TEXT,
            image_url = (article_data->>'image_url')::VARCHAR,
            published_at = (article_data->>'published_at')::TIMESTAMP WITH TIME ZONE,
            source = (article_data->>'source')::VARCHAR,
            category = (article_data->>'category')::VARCHAR,
            raw_data = article_data->'raw_data',
            updated_at = NOW()
        WHERE id = existing_article.id
        RETURNING id INTO article_id;
        
        result := jsonb_build_object(
            'article_id', article_id,
            'action', 'updated',
            'success', true
        );
    ELSE
        -- Create new article
        INSERT INTO articles (
            title, body, image_url, published_at, source, category,
            external_id, raw_data
        ) VALUES (
            (article_data->>'title')::VARCHAR,
            (article_data->>'body')::TEXT,
            (article_data->>'image_url')::VARCHAR,
            (article_data->>'published_at')::TIMESTAMP WITH TIME ZONE,
            (article_data->>'source')::VARCHAR,
            (article_data->>'category')::VARCHAR,
            (article_data->>'external_id')::VARCHAR,
            article_data->'raw_data'
        ) RETURNING id INTO article_id;
        
        result := jsonb_build_object(
            'article_id', article_id,
            'action', 'created',
            'success', true
        );
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sample data
INSERT INTO teams (name, name_ar, league, country, founded, stadium) VALUES
('Manchester United', 'مانشستر يونايتد', 'premier-league', 'England', 1878, 'Old Trafford'),
('Real Madrid', 'ريال مدريد', 'la-liga', 'Spain', 1902, 'Santiago Bernabéu'),
('Al-Hilal', 'الهلال', 'saudi-pro-league', 'Saudi Arabia', 1957, 'King Fahd Stadium'),
('Barcelona', 'برشلونة', 'la-liga', 'Spain', 1899, 'Camp Nou'),
('Liverpool', 'ليفربول', 'premier-league', 'England', 1892, 'Anfield'),
('Al-Nassr', 'النصر', 'saudi-pro-league', 'Saudi Arabia', 1955, 'Mrsool Park'),
('PSG', 'باريس سان جيرمان', 'ligue-1', 'France', 1970, 'Parc des Princes'),
('Bayern Munich', 'بايرن ميونخ', 'bundesliga', 'Germany', 1900, 'Allianz Arena');

INSERT INTO articles (title, body, image_url, published_at, source, category, is_breaking) VALUES
('انتقالات الصيف: صفقة جديدة في الدوري الإنجليزي', 'تفاصيل كاملة عن آخر الصفقات في الدوري الإنجليزي الممتاز مع تحليل مفصل للتأثير على الفرق المشاركة.', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', NOW() - INTERVAL '2 hours', 'GoalSphere', 'transfers', true),
('تحليل: أداء الفريق في المباراة الأخيرة', 'تحليل مفصل لأداء الفريق والتكتيكات المستخدمة في المباراة الأخيرة مع تقييم شامل للاعبين.', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', NOW() - INTERVAL '4 hours', 'GoalSphere', 'analysis', false),
('أخبار دوري أبطال أوروبا', 'آخر الأخبار من دوري أبطال أوروبا مع تغطية شاملة للمباريات والنتائج.', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', NOW() - INTERVAL '6 hours', 'GoalSphere', 'champions-league', false);

INSERT INTO live_scores (home_team, away_team, home_score, away_score, status, league, minute, start_time) VALUES
('مانشستر يونايتد', 'ليفربول', 2, 1, 'live', 'الدوري الإنجليزي', 67, NOW() - INTERVAL '67 minutes'),
('ريال مدريد', 'برشلونة', 0, 0, 'upcoming', 'الدوري الإسباني', NULL, NOW() + INTERVAL '2 hours'),
('الهلال', 'النصر', 1, 0, 'finished', 'الدوري السعودي', 90, NOW() - INTERVAL '3 hours');

INSERT INTO ad_units (type, position, content, is_active, target_category) VALUES
('banner', 'header', 'إعلان راعي - منتجات رياضية', true, 'transfers'),
('in-article', 'in-content', 'إعلان في المحتوى - خدمات رياضية', true, 'transfers'),
('banner', 'footer', 'إعلان ترويجي - معدات رياضية', true, NULL);

INSERT INTO source_configurations (source, api_key, base_url, rate_limit, is_active) VALUES
('sportmonks', '', 'https://api.sportmonks.com/v3/football', 100, true),
('api_football', '', 'https://v3.football.api-sports.io', 100, true);

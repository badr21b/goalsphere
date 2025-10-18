-- GoalSphere Database Schema (PostgreSQL)

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    logo_url VARCHAR(1000),
    league VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    founded INTEGER,
    stadium VARCHAR(200),
    website VARCHAR(500),
    social_media JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    position VARCHAR(50) NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    nationality VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    image_url VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live scores table
CREATE TABLE live_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_team VARCHAR(200) NOT NULL,
    away_team VARCHAR(200) NOT NULL,
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL CHECK (status IN ('live', 'finished', 'upcoming')),
    league VARCHAR(50) NOT NULL,
    minute INTEGER,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad units table
CREATE TABLE ad_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('banner', 'in-article', 'video')),
    position VARCHAR(20) NOT NULL CHECK (position IN ('header', 'footer', 'sidebar', 'in-content')),
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    target_category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_team_ids ON articles USING GIN(related_team_ids);
CREATE INDEX idx_teams_league ON teams(league);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_live_scores_status ON live_scores(status);
CREATE INDEX idx_live_scores_league ON live_scores(league);
CREATE INDEX idx_ad_units_active ON ad_units(is_active) WHERE is_active = TRUE;

-- Sample data
INSERT INTO teams (name, name_ar, league, country, founded, stadium) VALUES
('Manchester United', 'مانشستر يونايتد', 'premier-league', 'England', 1878, 'Old Trafford'),
('Real Madrid', 'ريال مدريد', 'la-liga', 'Spain', 1902, 'Santiago Bernabéu'),
('Al-Hilal', 'الهلال', 'saudi-pro-league', 'Saudi Arabia', 1957, 'King Fahd Stadium'),
('Barcelona', 'برشلونة', 'la-liga', 'Spain', 1899, 'Camp Nou'),
('Liverpool', 'ليفربول', 'premier-league', 'England', 1892, 'Anfield');

INSERT INTO articles (title, body, image_url, published_at, source, category, is_breaking) VALUES
('انتقالات الصيف: صفقة جديدة في الدوري الإنجليزي', 'تفاصيل كاملة عن آخر الصفقات في الدوري الإنجليزي الممتاز...', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', NOW() - INTERVAL '2 hours', 'GoalSphere', 'transfers', true),
('تحليل: أداء الفريق في المباراة الأخيرة', 'تحليل مفصل لأداء الفريق والتكتيكات المستخدمة...', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', NOW() - INTERVAL '4 hours', 'GoalSphere', 'analysis', false),
('أخبار دوري أبطال أوروبا', 'آخر الأخبار من دوري أبطال أوروبا...', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', NOW() - INTERVAL '6 hours', 'GoalSphere', 'champions-league', false);

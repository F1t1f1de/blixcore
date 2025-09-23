-- Blixcore Database Schema for Fitness Businesses
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom enums for fitness industry
CREATE TYPE business_type AS ENUM (
    'personal_trainer',
    'gym', 
    'physiotherapy',
    'yoga_studio',
    'nutrition',
    'other'
);

CREATE TYPE subscription_plan AS ENUM (
    'free',
    'starter',
    'professional', 
    'enterprise'
);

CREATE TYPE subscription_status AS ENUM (
    'active',
    'trialing',
    'past_due',
    'canceled',
    'unpaid'
);

CREATE TYPE activity_level AS ENUM (
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active'
);

CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted', 
    'qualified',
    'converted',
    'lost'
);

CREATE TYPE campaign_type AS ENUM (
    'email',
    'sms',
    'social',
    'referral'
);

CREATE TYPE integration_provider AS ENUM (
    'myfitnesspal',
    'strava',
    'trainerize',
    'mindbody',
    'webhook'
);

-- Users table (fitness business owners)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    business_name TEXT,
    business_type business_type NOT NULL,
    phone TEXT,
    location TEXT,
    website TEXT,
    avatar_url TEXT,
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table (fitness clients/prospects)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    location TEXT,
    
    -- Fitness specific fields
    fitness_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
    current_activity_level activity_level,
    previous_gym_experience BOOLEAN,
    preferred_workout_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    health_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    budget_range TEXT,
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
    preferred_workout_times TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Lead management
    lead_source TEXT,
    campaign_id UUID,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    status lead_status DEFAULT 'new',
    notes TEXT,
    contacted_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, email)
);

-- Lead activities tracking
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'email_opened', 'email_clicked', 'website_visit', 'form_submitted', 
        'called', 'meeting_scheduled', 'note_added'
    )),
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type campaign_type NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    target_audience JSONB,
    settings JSONB,
    stats JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider integration_provider NOT NULL,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
    credentials JSONB,
    settings JSONB,
    last_sync TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, provider)
);

-- Analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'leads_generated', 'leads_converted', 'revenue', 'campaign_performance'
    )),
    value NUMERIC NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_analytics_user_id_date ON analytics(user_id, date);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own profile" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view their own leads" ON leads
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own lead activities" ON lead_activities
    FOR ALL USING (
        EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_activities.lead_id AND leads.user_id = auth.uid())
    );

CREATE POLICY "Users can view their own campaigns" ON campaigns
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own integrations" ON integrations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics" ON analytics
    FOR ALL USING (auth.uid() = user_id);

-- Function to calculate lead score based on fitness industry criteria
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    lead_record RECORD;
    calculated_score INTEGER := 0;
    activity_count INTEGER := 0;
BEGIN
    -- Get lead data
    SELECT * INTO lead_record FROM leads WHERE id = lead_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Demographics scoring (25 points max)
    IF lead_record.age IS NOT NULL THEN
        -- Prime fitness age range 25-45 gets higher scores
        IF lead_record.age BETWEEN 25 AND 45 THEN
            calculated_score := calculated_score + 15;
        ELSIF lead_record.age BETWEEN 18 AND 55 THEN
            calculated_score := calculated_score + 10;
        ELSE
            calculated_score := calculated_score + 5;
        END IF;
    END IF;
    
    IF lead_record.location IS NOT NULL THEN
        calculated_score := calculated_score + 5; -- Location provided
    END IF;
    
    IF lead_record.phone IS NOT NULL THEN
        calculated_score := calculated_score + 5; -- Phone number provided
    END IF;
    
    -- Fitness interest signals (30 points max)
    IF lead_record.previous_gym_experience = true THEN
        calculated_score := calculated_score + 10; -- Previous gym experience is valuable
    END IF;
    
    IF lead_record.current_activity_level IS NOT NULL THEN
        CASE lead_record.current_activity_level
            WHEN 'sedentary' THEN calculated_score := calculated_score + 15; -- High potential for improvement
            WHEN 'lightly_active' THEN calculated_score := calculated_score + 12;
            WHEN 'moderately_active' THEN calculated_score := calculated_score + 8;
            WHEN 'very_active' THEN calculated_score := calculated_score + 5;
            WHEN 'extremely_active' THEN calculated_score := calculated_score + 3;
        END CASE;
    END IF;
    
    IF array_length(lead_record.fitness_goals, 1) > 0 THEN
        calculated_score := calculated_score + 5; -- Has specific fitness goals
    END IF;
    
    -- Engagement level (25 points max)
    SELECT COUNT(*) INTO activity_count 
    FROM lead_activities 
    WHERE lead_activities.lead_id = lead_record.id;
    
    -- Score based on engagement activities
    IF activity_count > 10 THEN
        calculated_score := calculated_score + 25;
    ELSIF activity_count > 5 THEN
        calculated_score := calculated_score + 20;
    ELSIF activity_count > 2 THEN
        calculated_score := calculated_score + 15;
    ELSIF activity_count > 0 THEN
        calculated_score := calculated_score + 10;
    END IF;
    
    -- Purchase intent (20 points max)
    IF lead_record.budget_range IS NOT NULL THEN
        calculated_score := calculated_score + 10; -- Budget consideration shows intent
    END IF;
    
    IF lead_record.preferred_contact_method IS NOT NULL THEN
        calculated_score := calculated_score + 5; -- Contact preference shows readiness
    END IF;
    
    IF array_length(lead_record.preferred_workout_times, 1) > 0 THEN
        calculated_score := calculated_score + 5; -- Specific timing shows commitment
    END IF;
    
    -- Ensure score doesn't exceed 100
    IF calculated_score > 100 THEN
        calculated_score := 100;
    END IF;
    
    -- Update the lead with calculated score
    UPDATE leads SET score = calculated_score, updated_at = NOW() WHERE id = lead_id;
    
    RETURN calculated_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically calculate score when lead is updated
CREATE OR REPLACE FUNCTION trigger_calculate_lead_score()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM calculate_lead_score(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lead_score
    AFTER INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION trigger_calculate_lead_score();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (id, email, full_name, business_name, business_type, location) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'demo@blixcore.com.au', 'Sarah Johnson', 'FitLife Personal Training', 'personal_trainer', 'Sydney, Australia'),
    ('550e8400-e29b-41d4-a716-446655440001', 'john@gympower.com.au', 'John Smith', 'PowerGym Sydney', 'gym', 'Sydney, Australia');

INSERT INTO leads (user_id, email, full_name, phone, age, gender, fitness_goals, current_activity_level, previous_gym_experience, budget_range, status) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'mike@example.com', 'Mike Wilson', '+61400123456', 32, 'male', ARRAY['weight_loss', 'muscle_gain'], 'lightly_active', true, '$100-200/week', 'new'),
    ('550e8400-e29b-41d4-a716-446655440000', 'sarah.jones@example.com', 'Sarah Jones', '+61400654321', 28, 'female', ARRAY['general_fitness', 'strength'], 'moderately_active', false, '$50-100/week', 'contacted'),
    ('550e8400-e29b-41d4-a716-446655440001', 'david.brown@example.com', 'David Brown', '+61400987654', 35, 'male', ARRAY['cardio', 'flexibility'], 'sedentary', true, '$200+/week', 'qualified');
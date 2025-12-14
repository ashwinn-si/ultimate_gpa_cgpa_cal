-- CGPA Calculator Database Schema
-- Run this SQL in Supabase SQL Editor to create all tables and policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Semesters table
CREATE TABLE IF NOT EXISTS semesters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2100),
    term VARCHAR(20) CHECK (term IN ('fall', 'spring', 'summer', 'winter', NULL)),
    gpa DECIMAL(4, 2) DEFAULT 0 CHECK (gpa >= 0 AND gpa <= 10),
    total_credits DECIMAL(5, 1) DEFAULT 0 CHECK (total_credits >= 0),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE semesters IS 'Stores academic semester information for each user';
COMMENT ON COLUMN semesters.gpa IS 'Calculated GPA for the semester (0-10 scale)';
COMMENT ON COLUMN semesters.total_credits IS 'Total credits accumulated in this semester';
COMMENT ON COLUMN semesters.order IS 'Display order for sorting semesters';

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    grade_points DECIMAL(4, 2) NOT NULL CHECK (grade_points >= 0 AND grade_points <= 10),
    credits DECIMAL(4, 1) NOT NULL CHECK (credits >= 0.5 AND credits <= 10 AND MOD(credits::numeric * 2, 1) = 0),
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE subjects IS 'Stores subject/course information for each semester';
COMMENT ON COLUMN subjects.grade_points IS 'Grade points for the subject (0-10 scale)';
COMMENT ON COLUMN subjects.credits IS 'Credit hours for the subject (0.5-10 in 0.5 increments)';

-- Grade configurations table
CREATE TABLE IF NOT EXISTS grade_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL,
    points DECIMAL(4, 2) NOT NULL CHECK (points >= 0 AND points <= 10),
    description VARCHAR(100),
    min_percentage DECIMAL(5, 2) CHECK (min_percentage >= 0 AND min_percentage <= 100),
    max_percentage DECIMAL(5, 2) CHECK (max_percentage >= 0 AND max_percentage <= 100 AND max_percentage >= min_percentage),
    "order" INTEGER DEFAULT 0,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_grade_per_user UNIQUE (user_id, name)
);

COMMENT ON TAIF NOT EXISTS user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(10) DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
    default_grading_system VARCHAR(20) DEFAULT '10-point',
    decimal_precision INTEGER DEFAULT 2 CHECK (decimal_precision >= 0 AND decimal_precision <= 4),
    include_failed_courses BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE user_settings IS 'User-specific application settings and preferences'   default_grading_system VARCHAR(20) DEFAULT '10-point',
    decimal_precision INTEGER DEFAULT 2,
    include_failed_courses BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Semesters policies
CREATE POLICY "Users can view their own semesters" ON semesters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own semesters" ON semesters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own semesters" ON semesters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own semesters" ON semesters
    FOR DELETE USING (auth.uid() = user_id);

-- Subjects policies (check semester ownership)
CREATE POLICY "Users can view subjects in their semesters" ON subjects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert subjects in their semesters" ON subjects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update subjects in their semesters" ON subjects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete subjects in their semesters" ON subjects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM semesters 
            WHERE semesters.id = subjects.semester_id 
            AND semesters.user_id = auth.uid()
        )
    );

-- Grade configs policies
CREATE POLICY "Users can view their own grade configs" ON grade_configs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grade configs" ON grade_configs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grade configs" ON grade_configs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grade configs" ON grade_configs
    FOR DELETE USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_semesters_user_id ON semesters(user_id);
CREATE INDEX idx_subjects_semester_id ON subjects(semester_id);
CREATE INDEX idx_grade_configs_user_id ON grade_configs(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON semesters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grade_configs_updated_at BEFORE UPDATE ON grade_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to calculate CGPA across all semesters for a user
CREATE OR REPLACE FUNCTION calculate_user_cgpa(p_user_id UUID)
RETURNS DECIMAL(4, 2) AS $$
DECLARE
    v_total_grade_points DECIMAL(10, 2) := 0;
    v_total_credits DECIMAL(10, 2) := 0;
    v_cgpa DECIMAL(4, 2);
BEGIN
    SELECT 
        COALESCE(SUM(sub.grade_points * sub.credits), 0),
        COALESCE(SUM(sub.credits), 0)
    INTO v_total_grade_points, v_total_credits
    FROM subjects sub
    INNER JOIN semesters sem ON sub.semester_id = sem.id
    WHERE sem.user_id = p_user_id;
    
    IF v_total_credits = 0 THEN
        RETURN 0;
    END IF;
    
    v_cgpa := v_total_grade_points / v_total_credits;
    RETURN ROUND(v_cgpa, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_user_cgpa IS 'Calculates overall CGPA for a user across all semesters';

-- Helper function to get semester statistics
CREATE OR REPLACE FUNCTION get_semester_stats(p_semester_id UUID)
RETURNS TABLE (
    gpa DECIMAL(4, 2),
    total_credits DECIMAL(5, 1),
    subject_count INTEGER,
    average_grade_points DECIMAL(4, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN COALESCE(SUM(s.credits), 0) = 0 THEN 0
            ELSE ROUND(COALESCE(SUM(s.grade_points * s.credits), 0) / COALESCE(SUM(s.credits), 1), 2)
        END AS gpa,
        COALESCE(SUM(s.credits), 0)::DECIMAL(5, 1) AS total_credits,
        COUNT(*)::INTEGER AS subject_count,
        COALESCE(AVG(s.grade_points), 0)::DECIMAL(4, 2) AS average_grade_points
    FROM subjects s
    WHERE s.semester_id = p_semester_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_semester_stats IS 'Returns calculated statistics for a semester';

-- View for user dashboard statistics
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    sem.user_id,
    COUNT(DISTINCT sem.id) as total_semesters,
    COUNT(sub.id) as total_subjects,
    COALESCE(SUM(sub.credits), 0) as total_credits_earned,
    CASE 
        WHEN COALESCE(SUM(sub.credits), 0) = 0 THEN 0
        ELSE ROUND(COALESCE(SUM(sub.grade_points * sub.credits), 0) / COALESCE(SUM(sub.credits), 1), 2)
    END as overall_cgpa
FROM semesters sem
LEFT JOIN subjects sub ON sub.semester_id = sem.id
GROUP BY sem.user_id;

COMMENT ON VIEW user_dashboard_stats IS 'Aggregated statistics for user dashboard';

-- Grant permissions on the view
GRANT SELECT ON user_dashboard_stats TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Users can view their own stats" ON user_dashboard_stats
    FOR SELECT USING (auth.uid() = user_id);CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

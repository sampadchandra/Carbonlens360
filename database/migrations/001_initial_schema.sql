-- CarbonLens 360 Initial Database Schema Migration
-- PostgreSQL / Supabase Compatible

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'campus_admin', 'industry_manager', 'sustainability_admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    baseline_emissions_tco2e NUMERIC(12, 4) DEFAULT 1200.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hostels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT DEFAULT 300,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'student_club',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- academic, residential, dining, admin
    area_sqft NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT NOT NULL,
    phone_optional TEXT,
    campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
    hostel_id UUID REFERENCES hostels(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EMISSION FACTORS & CALCULATIONS
CREATE TABLE IF NOT EXISTS emission_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (category IN ('Travel', 'Electricity', 'Food', 'Waste', 'Fuel', 'Industry')),
    activity_type TEXT NOT NULL,
    factor_value NUMERIC(14, 6) NOT NULL,
    input_unit TEXT NOT NULL,
    output_unit TEXT NOT NULL DEFAULT 'kgCO2e',
    region TEXT DEFAULT 'IN',
    source_name TEXT NOT NULL,
    source_url TEXT,
    source_date TEXT,
    methodology_notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Travel', 'Electricity', 'Food', 'Waste', 'Fuel')),
    activity_type TEXT NOT NULL,
    quantity NUMERIC(12, 4) NOT NULL,
    original_unit TEXT NOT NULL,
    normalized_quantity NUMERIC(12, 4) NOT NULL,
    normalized_unit TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    emission_factor_id UUID REFERENCES emission_factors(id),
    calculated_co2e NUMERIC(12, 4) NOT NULL,
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'ocr', 'meter', 'api')),
    evidence_level INT DEFAULT 1 CHECK (evidence_level BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emission_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    input_data JSONB NOT NULL,
    factor_used NUMERIC(14, 6) NOT NULL,
    calculation_formula TEXT NOT NULL,
    climatiq_response JSONB,
    confidence_score INT DEFAULT 85 CHECK (confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AGGREGATES & BENCHMARKS
CREATE TABLE IF NOT EXISTS monthly_aggregates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    year_month TEXT NOT NULL, -- e.g. '2026-09'
    total_co2e NUMERIC(12, 4) NOT NULL,
    travel_co2e NUMERIC(12, 4) DEFAULT 0,
    electricity_co2e NUMERIC(12, 4) DEFAULT 0,
    food_co2e NUMERIC(12, 4) DEFAULT 0,
    waste_co2e NUMERIC(12, 4) DEFAULT 0,
    fuel_co2e NUMERIC(12, 4) DEFAULT 0,
    saved_co2e NUMERIC(12, 4) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, year_month)
);

CREATE TABLE IF NOT EXISTS benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    scope TEXT NOT NULL CHECK (scope IN ('individual', 'campus', 'hostel', 'department', 'industry')),
    region TEXT DEFAULT 'IN',
    average_co2e NUMERIC(12, 4) NOT NULL,
    target_co2e NUMERIC(12, 4) NOT NULL,
    unit TEXT NOT NULL,
    methodology_source TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RECOMMENDATIONS & CHALLENGES
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    baseline_co2e NUMERIC(12, 4) NOT NULL,
    estimated_co2_saved NUMERIC(12, 4) NOT NULL,
    estimated_money_saved NUMERIC(10, 2) DEFAULT 0,
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    frequency TEXT DEFAULT 'Daily',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_co2_saved NUMERIC(12, 4) NOT NULL,
    green_points_reward INT DEFAULT 100,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE(challenge_id, user_id)
);

CREATE TABLE IF NOT EXISTS challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES challenge_participants(id) ON DELETE CASCADE,
    current_co2_saved NUMERIC(12, 4) DEFAULT 0,
    completion_percentage NUMERIC(5, 2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL CHECK (entity_type IN ('hostel', 'department', 'team')),
    entity_id UUID NOT NULL,
    entity_name TEXT NOT NULL,
    rank INT NOT NULL,
    co2_reduction_tco2e NUMERIC(12, 4) NOT NULL,
    participant_count INT DEFAULT 0,
    period TEXT DEFAULT 'monthly',
    snapshot_date DATE DEFAULT CURRENT_DATE
);

-- 5. GREENPOINTS & REWARDS
CREATE TABLE IF NOT EXISTS green_points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    points INT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'spend')),
    source_event TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points_required INT NOT NULL,
    sponsor TEXT DEFAULT 'CarbonLens Campus Partner',
    stock INT DEFAULT 100,
    category TEXT DEFAULT 'Perks',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. POLLUTION & CLEANROUTE
CREATE TABLE IF NOT EXISTS pollution_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    area_type TEXT DEFAULT 'Campus/Industrial Zone',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pollution_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES pollution_locations(id) ON DELETE CASCADE,
    aqi INT NOT NULL,
    pm25 NUMERIC(8, 2) NOT NULL,
    pm10 NUMERIC(8, 2) NOT NULL,
    no2 NUMERIC(8, 2) NOT NULL,
    so2 NUMERIC(8, 2) NOT NULL,
    co NUMERIC(8, 2) NOT NULL,
    ozone NUMERIC(8, 2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pollution_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES pollution_locations(id) ON DELETE CASCADE,
    pollutant TEXT NOT NULL,
    current_value NUMERIC(8, 2) NOT NULL,
    threshold_value NUMERIC(8, 2) NOT NULL,
    severity TEXT CHECK (severity IN ('moderate', 'high', 'critical')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    fastest_time_mins INT NOT NULL,
    fastest_distance_km NUMERIC(8, 2) NOT NULL,
    fastest_exposure_index NUMERIC(5, 2) NOT NULL,
    clean_time_mins INT NOT NULL,
    clean_distance_km NUMERIC(8, 2) NOT NULL,
    clean_exposure_index NUMERIC(5, 2) NOT NULL,
    exposure_reduction_pct NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. INDUSTRY & INDUSTRIAL NODE
CREATE TABLE IF NOT EXISTS industry_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sector TEXT NOT NULL,
    location TEXT NOT NULL,
    annual_production_target NUMERIC(12, 2) DEFAULT 50000.0,
    target_ghg_intensity NUMERIC(10, 4) DEFAULT 0.85, -- tCO2e / unit
    greengrade_score INT DEFAULT 88,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS industrial_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industry_profiles(id) ON DELETE CASCADE,
    node_code TEXT UNIQUE NOT NULL,
    device_name TEXT NOT NULL,
    location_tag TEXT NOT NULL,
    status TEXT DEFAULT 'online',
    last_ping TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES industrial_nodes(id) ON DELETE CASCADE,
    kwh_consumed NUMERIC(10, 2) NOT NULL,
    fuel_liter_consumed NUMERIC(10, 2) NOT NULL,
    production_units NUMERIC(10, 2) NOT NULL,
    runtime_hours NUMERIC(8, 2) NOT NULL,
    calculated_co2e NUMERIC(10, 4) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ghg_intensity_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industry_profiles(id) ON DELETE CASCADE,
    period TEXT NOT NULL,
    total_co2e_tco2e NUMERIC(12, 4) NOT NULL,
    total_production_units NUMERIC(12, 4) NOT NULL,
    intensity_value NUMERIC(10, 4) NOT NULL, -- tCO2e per unit
    target_intensity NUMERIC(10, 4) NOT NULL,
    gap_value NUMERIC(10, 4) NOT NULL,
    compliance_status TEXT CHECK (compliance_status IN ('On Target', 'Near Target', 'Exceeded')),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS industry_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    industry_id UUID REFERENCES industry_profiles(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    baseline_emissions_tco2e NUMERIC(12, 4) NOT NULL,
    current_emissions_tco2e NUMERIC(12, 4) NOT NULL,
    target_reduction_tco2e NUMERIC(12, 4) NOT NULL,
    estimated_cost_inr NUMERIC(14, 2) NOT NULL,
    estimated_annual_savings_inr NUMERIC(14, 2) NOT NULL,
    payback_years NUMERIC(5, 2) NOT NULL,
    roi_percentage NUMERIC(6, 2) NOT NULL,
    status TEXT DEFAULT 'In Progress' CHECK (status IN ('Proposed', 'In Progress', 'Implemented', 'Evidence Submitted', 'Ready for Review', 'Externally Verified')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES industry_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    evidence_type TEXT NOT NULL CHECK (evidence_type IN ('Bill Document', 'Meter API Data', 'IoT Sensor Log', 'Audit Report', 'Photo Proof')),
    evidence_level INT DEFAULT 3 CHECK (evidence_level BETWEEN 1 AND 4),
    file_url TEXT,
    verified BOOLEAN DEFAULT TRUE,
    confidence_score INT DEFAULT 90 CHECK (confidence_score BETWEEN 0 AND 100),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CARBON PROJECT PASSPORT & CREDIT POTENTIAL
CREATE TABLE IF NOT EXISTS carbon_project_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES industry_projects(id) ON DELETE CASCADE UNIQUE,
    passport_code TEXT UNIQUE NOT NULL,
    baseline_period TEXT NOT NULL,
    measured_reduction_tco2e NUMERIC(12, 4) NOT NULL,
    potential_credit_equivalent_tco2e NUMERIC(12, 4) NOT NULL,
    credit_readiness_status TEXT DEFAULT 'Needs Evidence Review' CHECK (credit_readiness_status IN ('Potentially Suitable', 'Needs Evidence Review', 'Insufficient Data')),
    evidence_confidence_score INT DEFAULT 88,
    disclaimer TEXT DEFAULT 'CarbonLens estimates potential. External verification by accredited body required.',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WHAT-IF SCENARIOS & OCR
CREATE TABLE IF NOT EXISTS what_if_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL, -- Solar, EV, AC Efficiency, Waste, Efficient Motors, Waste Heat
    implementation_pct NUMERIC(5, 2) NOT NULL,
    baseline_co2e NUMERIC(12, 4) NOT NULL,
    projected_co2e NUMERIC(12, 4) NOT NULL,
    co2_saved_tco2e NUMERIC(12, 4) NOT NULL,
    investment_cost_inr NUMERIC(14, 2) NOT NULL,
    annual_savings_inr NUMERIC(14, 2) NOT NULL,
    payback_years NUMERIC(5, 2) NOT NULL,
    roi_pct NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ocr_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    extracted_text TEXT,
    extracted_kwh NUMERIC(10, 2),
    extracted_fuel_liters NUMERIC(10, 2),
    extracted_amount NUMERIC(10, 2),
    extracted_date DATE,
    confidence NUMERIC(5, 2),
    status TEXT DEFAULT 'reviewed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CONSENTS, AUDIT LOGS & REPORTS
CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL,
    agreed BOOLEAN DEFAULT TRUE,
    ip_address TEXT,
    agreed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS report_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    scope TEXT NOT NULL, -- campus, industry, student
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date);
CREATE INDEX IF NOT EXISTS idx_monthly_aggregates_user_month ON monthly_aggregates(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_node_ts ON sensor_readings(node_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_ts ON audit_logs(actor_user_id, timestamp);

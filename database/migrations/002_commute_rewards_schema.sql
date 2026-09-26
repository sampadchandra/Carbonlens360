-- CarbonLens 360 - Migration 002: College Campus Commute, Live Proof & Canteen Rewards
-- Extends PostgreSQL schema for student/teacher/staff/canteen roles, live commute tracking, travel evidence, green credits ledger, and canteen QR reward redemptions.

-- 1. UPDATE USER ROLE CONSTRAINT FOR COLLEGE SPECIFICATION
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN (
    'student', 'teacher', 'staff', 'team_lead', 'campus_admin', 'sustainability_admin', 'canteen_staff'
));

-- 2. TRAVEL TRIPS (GPS Tracking + Commute Sessions)
CREATE TABLE IF NOT EXISTS travel_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    travel_mode TEXT NOT NULL CHECK (travel_mode IN ('walking', 'cycling', 'bus', 'train', 'motorcycle', 'car', 'other')),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    start_lat NUMERIC(10, 6),
    start_lng NUMERIC(10, 6),
    end_lat NUMERIC(10, 6),
    end_lng NUMERIC(10, 6),
    distance_km NUMERIC(10, 3) DEFAULT 0.0,
    duration_minutes NUMERIC(8, 2) DEFAULT 0.0,
    calculated_co2e_kg NUMERIC(10, 4) DEFAULT 0.0,
    baseline_co2e_kg NUMERIC(10, 4) DEFAULT 0.0,
    saved_co2e_kg NUMERIC(10, 4) DEFAULT 0.0,
    credits_earned INT DEFAULT 0,
    verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'REVIEW_REQUIRED', 'REJECTED', 'UNVERIFIED')),
    campus_geofence_verified BOOLEAN DEFAULT FALSE,
    arrival_qr_verified BOOLEAN DEFAULT FALSE,
    evidence_confidence_score INT DEFAULT 85 CHECK (evidence_confidence_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRAVEL TRACK POINTS (GPS Detailed Commute Points)
CREATE TABLE IF NOT EXISTS travel_track_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES travel_trips(id) ON DELETE CASCADE,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    speed_kmh NUMERIC(6, 2),
    accuracy_m NUMERIC(6, 2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRAVEL EVIDENCE (Live Device Camera Capture Proof metadata)
CREATE TABLE IF NOT EXISTS travel_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID REFERENCES travel_trips(id) ON DELETE CASCADE UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    captured_at TIMESTAMPTZ DEFAULT NOW(),
    claimed_mode TEXT NOT NULL,
    file_size_bytes INT,
    mime_type TEXT DEFAULT 'image/jpeg',
    sha256_hash TEXT,
    automated_consistency_check TEXT DEFAULT 'CONSISTENT_MATCH',
    verification_status TEXT DEFAULT 'VERIFIED' CHECK (verification_status IN ('VERIFIED', 'REVIEW_REQUIRED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GREEN CREDIT WALLETS & LEDGER (Campus Reward Currency)
CREATE TABLE IF NOT EXISTS green_credit_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    available_credits INT DEFAULT 0 CHECK (available_credits >= 0),
    lifetime_earned INT DEFAULT 0,
    lifetime_redeemed INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS green_credit_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('EARN', 'REDEEM', 'BONUS', 'ADJUSTMENT')),
    source_event TEXT NOT NULL,
    reference_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REWARD DISCOUNTS & CANTEEN QR TOKENS
CREATE TABLE IF NOT EXISTS reward_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    credit_cost INT NOT NULL CHECK (credit_cost > 0),
    discount_value_inr NUMERIC(10, 2) NOT NULL,
    category TEXT DEFAULT 'Canteen Benefit',
    daily_limit INT DEFAULT 2,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_qr_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES reward_catalog(id) ON DELETE CASCADE,
    credit_cost INT NOT NULL,
    discount_value_inr NUMERIC(10, 2) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_redeemed BOOLEAN DEFAULT FALSE,
    redeemed_at TIMESTAMPTZ,
    redeemed_by_canteen_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code TEXT UNIQUE NOT NULL,
    qr_token_id UUID REFERENCES reward_qr_tokens(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    canteen_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reward_title TEXT NOT NULL,
    credits_deducted INT NOT NULL,
    discount_applied_inr NUMERIC(10, 2) NOT NULL,
    canteen_location TEXT DEFAULT 'Main Campus Canteen',
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST LOOKUP
CREATE INDEX IF NOT EXISTS idx_travel_trips_user ON travel_trips(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_travel_evidence_trip ON travel_evidence(trip_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_code ON reward_qr_tokens(token_code);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_canteen ON reward_redemptions(canteen_staff_id, redeemed_at);

-- CarbonLens 360 Seed Data for College Commute, Wallet & Canteen Rewards

INSERT INTO reward_catalog (id, campus_id, title, description, credit_cost, discount_value_inr, category, daily_limit, active) VALUES
('r1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', '₹10 Canteen Discount', 'Valid at Main Campus Canteen for fresh meals and beverages.', 100, 10.00, 'Canteen Benefit', 2, true),
('r2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', '₹20 Canteen Discount', 'Valid at Main Campus Canteen & Fresh Juice Counter.', 180, 20.00, 'Canteen Benefit', 2, true),
('r3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Free Fresh Beverage', 'Choice of Lemonade or Green Tea at Canteen Counter.', 150, 15.00, 'Beverage Benefit', 1, true),
('r4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'Campus Green Certificate', 'Official Digital Sustainability Certificate from Campus Admin.', 500, 0.00, 'Recognition', 1, true)
ON CONFLICT DO NOTHING;

-- CANTEEN STAFF DEMO USER
INSERT INTO users (id, auth_user_id, email, role, status) VALUES
('u5555555-5555-5555-5555-555555555555', 'auth-canteen-1', 'canteen@carbonlens.io', 'canteen_staff', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, user_id, full_name, campus_id) VALUES
('p5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', 'Ramesh Kumar (Canteen Staff Demo)', 'c1111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- STUDENT GREEN CREDIT WALLET SEED
INSERT INTO green_credit_wallets (user_id, available_credits, lifetime_earned, lifetime_redeemed) VALUES
('u1111111-1111-1111-1111-111111111111', 850, 1250, 400)
ON CONFLICT (user_id) DO UPDATE SET available_credits = EXCLUDED.available_credits;

-- SAMPLE VERIFIED COMMUTE TRIP SEED
INSERT INTO travel_trips (id, user_id, campus_id, travel_mode, distance_km, duration_minutes, calculated_co2e_kg, baseline_co2e_kg, saved_co2e_kg, credits_earned, verification_status, campus_geofence_verified, evidence_confidence_score) VALUES
('t1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'cycling', 8.4, 28, 0.0, 1.61, 1.61, 161, 'VERIFIED', true, 95)
ON CONFLICT DO NOTHING;

INSERT INTO green_credit_ledger (user_id, amount, transaction_type, source_event, reference_id, description) VALUES
('u1111111-1111-1111-1111-111111111111', 161, 'EARN', 'VERIFIED_COMMUTE', 't1111111-1111-1111-1111-111111111111', 'Verified bicycle commute (8.4 km) saved 1.61 kg CO2e')
ON CONFLICT DO NOTHING;

-- CarbonLens 360 Comprehensive Demo Seed Data

-- 1. CAMPUES & SUB-ENTITIES
INSERT INTO campuses (id, name, code, city, country, baseline_emissions_tco2e)
VALUES ('c1111111-1111-1111-1111-111111111111', 'CarbonLens University — DEMO', 'CLU-MAIN', 'Bengaluru', 'India', 1450.50)
ON CONFLICT DO NOTHING;

INSERT INTO hostels (id, campus_id, name, capacity) VALUES
('h1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Green Hostel', 350),
('h2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'River Hostel', 400),
('h3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Eco Residency', 250)
ON CONFLICT DO NOTHING;

INSERT INTO departments (id, campus_id, name, code) VALUES
('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Computer Science & Engineering', 'CSE'),
('d2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Artificial Intelligence & ML', 'AIML'),
('d3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Electronics & Comm', 'ECE'),
('d4444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 'Mechanical Engineering', 'MECH')
ON CONFLICT DO NOTHING;

INSERT INTO teams (id, campus_id, name, category) VALUES
('t1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Team Terra', 'Sustainability Club'),
('t2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Team Green', 'Solar Innovation'),
('t3333333-3333-3333-3333-333333333333', 'c1111111-1111-1111-1111-111111111111', 'Team EcoTech', 'Robotics for Planet')
ON CONFLICT DO NOTHING;

-- 2. DEMO USERS & PROFILES
INSERT INTO users (id, auth_user_id, email, role, status) VALUES
('u1111111-1111-1111-1111-111111111111', 'auth-student-1', 'student@carbonlens.io', 'student', 'active'),
('u2222222-2222-2222-2222-222222222222', 'auth-campus-1', 'campus@carbonlens.io', 'campus_admin', 'active'),
('u3333333-3333-3333-3333-333333333333', 'auth-industry-1', 'industry@carbonlens.io', 'industry_manager', 'active'),
('u4444444-4444-4444-4444-444444444444', 'auth-admin-1', 'admin@carbonlens.io', 'sustainability_admin', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (id, user_id, full_name, campus_id, hostel_id, department_id, team_id) VALUES
('p1111111-1111-1111-1111-111111111111', 'u1111111-1111-1111-1111-111111111111', 'Aarav Sharma (Student Demo)', 'c1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 't1111111-1111-1111-1111-111111111111'),
('p2222222-2222-2222-2222-222222222222', 'u2222222-2222-2222-2222-222222222222', 'Dr. Priya Ramesh (Campus Admin Demo)', 'c1111111-1111-1111-1111-111111111111', NULL, 'd1111111-1111-1111-1111-111111111111', NULL),
('p3333333-3333-3333-3333-333333333333', 'u3333333-3333-3333-3333-333333333333', 'Vikram Patel (Industry Manager Demo)', NULL, NULL, NULL, NULL),
('p4444444-4444-4444-4444-444444444444', 'u4444444-4444-4444-4444-444444444444', 'Ananya Roy (Sustainability Admin Demo)', 'c1111111-1111-1111-1111-111111111111', NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- 3. OFFICIAL EMISSION FACTORS WITH CITED SOURCES
INSERT INTO emission_factors (id, category, activity_type, factor_value, input_unit, output_unit, region, source_name, source_url, source_date, methodology_notes) VALUES
('ef111111-1111-1111-1111-111111111111', 'Travel', 'Car (Petrol)', 0.192000, 'km', 'kgCO2e', 'IN', 'DEFRA / India GHG Program', 'https://ghgprotocol.org', '2025', 'Passenger car average emission per vehicle km'),
('ef222222-2222-2222-2222-222222222222', 'Travel', 'Motorcycle', 0.103000, 'km', 'kgCO2e', 'IN', 'India GHG Program', 'https://ghgprotocol.org', '2025', 'Two-wheeler petrol average factor'),
('ef333333-3333-3333-3333-333333333333', 'Travel', 'Bus (Public)', 0.038000, 'km', 'kgCO2e', 'IN', 'CEA Grid / DEFRA Transit', 'https://cea.nic.in', '2025', 'Urban bus per passenger km'),
('ef444444-4444-4444-4444-444444444444', 'Travel', 'Electric Bus / EV', 0.012000, 'km', 'kgCO2e', 'IN', 'CEA Grid Factor', 'https://cea.nic.in', '2025', 'EV based on regional grid carbon intensity'),
('ef555555-5555-5555-5555-555555555555', 'Electricity', 'Grid Electricity (India Average)', 0.716000, 'kWh', 'kgCO2e', 'IN', 'Central Electricity Authority (CEA)', 'https://cea.nic.in', '2025-v20', 'Weighted average grid emission factor for India'),
('ef666666-6666-6666-6666-666666666666', 'Electricity', 'Rooftop Solar PV', 0.041000, 'kWh', 'kgCO2e', 'IN', 'NREL Life Cycle Assessment', 'https://nrel.gov', '2024', 'LCA emissions for PV panel lifecycle'),
('ef777777-7777-7777-7777-777777777777', 'Food', 'Non-Vegetarian Meal', 3.250000, 'meal', 'kgCO2e', 'IN', 'IPCC / World Resources Institute', 'https://wri.org', '2024', 'High livestock & poultry diet lifecycle factor'),
('ef888888-8888-8888-8888-888888888888', 'Food', 'Vegetarian Meal', 1.150000, 'meal', 'kgCO2e', 'IN', 'WRI Diets & Carbon Impact', 'https://wri.org', '2024', 'Plant-based meal lifecycle factor'),
('ef999999-9999-9999-9999-999999999999', 'Waste', 'Municipal Solid Waste (Landfill)', 1.450000, 'kg', 'kgCO2e', 'IN', 'CPCB India Waste Guidelines', 'https://cpcb.nic.in', '2024', 'Methane generation potential in unmanaged landfill'),
('efaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Waste', 'Recycled / Segregated Waste', 0.180000, 'kg', 'kgCO2e', 'IN', 'CPCB India Waste Guidelines', 'https://cpcb.nic.in', '2024', 'Avoided landfill emissions credit applied'),
('efbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Fuel', 'Diesel Generator / Boiler', 2.680000, 'liter', 'kgCO2e', 'IN', 'BEE Energy Manager Guide', 'https://beeindia.gov.in', '2025', 'Diesel combustion CO2e factor'),
('efcccccc-cccc-cccc-cccc-cccccccccccc', 'Fuel', 'LPG / Natural Gas', 2.980000, 'kg', 'kgCO2e', 'IN', 'BEE Energy Manager Guide', 'https://beeindia.gov.in', '2025', 'LPG cylinder combustion factor')
ON CONFLICT DO NOTHING;

-- 4. DEMO ACTIVITIES
INSERT INTO activities (user_id, category, activity_type, quantity, original_unit, normalized_quantity, normalized_unit, date, calculated_co2e, source, evidence_level) VALUES
('u1111111-1111-1111-1111-111111111111', 'Travel', 'Car (Petrol)', 25.0, 'km', 25.0, 'km', CURRENT_DATE - INTERVAL '1 day', 4.80, 'manual', 1),
('u1111111-1111-1111-1111-111111111111', 'Electricity', 'Grid Electricity (India Average)', 12.5, 'kWh', 12.5, 'kWh', CURRENT_DATE - INTERVAL '2 days', 8.95, 'ocr', 2),
('u1111111-1111-1111-1111-111111111111', 'Food', 'Vegetarian Meal', 3.0, 'meal', 3.0, 'meal', CURRENT_DATE - INTERVAL '1 day', 3.45, 'manual', 1),
('u1111111-1111-1111-1111-111111111111', 'Waste', 'Municipal Solid Waste (Landfill)', 2.0, 'kg', 2.0, 'kg', CURRENT_DATE - INTERVAL '3 days', 2.90, 'manual', 1),
('u1111111-1111-1111-1111-111111111111', 'Travel', 'Bus (Public)', 15.0, 'km', 15.0, 'km', CURRENT_DATE, 0.57, 'manual', 1)
ON CONFLICT DO NOTHING;

-- 5. BENCHMARKS
INSERT INTO benchmarks (category, scope, region, average_co2e, target_co2e, unit, methodology_source) VALUES
('Individual Footprint', 'individual', 'IN', 210.0, 140.0, 'kgCO2e/month', 'India National Climate Baseline (MoEFCC)'),
('Hostel Per Capita', 'hostel', 'IN', 160.0, 105.0, 'kgCO2e/student/month', 'Campus Energy Audit Benchmark'),
('Industry GHG Intensity', 'industry', 'IN', 1.15, 0.75, 'tCO2e/tonne product', 'BEE Perform Achieve Trade (PAT) Scheme')
ON CONFLICT DO NOTHING;

-- 6. CHALLENGES & REWARDS
INSERT INTO challenges (id, title, description, category, start_date, end_date, target_co2_saved, green_points_reward) VALUES
('ch111111-1111-1111-1111-111111111111', 'No-Car Campus Week', 'Switch to walking, bicycle or electric shuttles for 7 consecutive days.', 'Travel', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', 18.5, 250),
('ch222222-2222-2222-2222-222222222222', 'Zero Food Waste Challenge', 'Finish meals completely and segregate wet waste for campus composting.', 'Food & Waste', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 12.0, 200),
('ch333333-3333-3333-3333-333333333333', 'Hostel Low-Power Night', 'Unplug idle electronics and turn off standby ACs during peak hours.', 'Electricity', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 25.0, 300)
ON CONFLICT DO NOTHING;

INSERT INTO rewards (title, description, points_required, sponsor, stock, category) VALUES
('Campus Eco-Cafe Voucher', 'INR 150 discount coupon for organic snacks at Central Canteen.', 350, 'Green Canteen Co.', 50, 'Food & Beverage'),
('Tree Plantation Certificate', 'Plant a native shade tree on campus registered under your student ID.', 500, 'Green Campus Initiative', 100, 'Certificates'),
('EV Shuttle Priority Pass', '1-Month priority seating pass on internal electric shuttle campus routes.', 400, 'Transport Office', 30, 'Transit Perks')
ON CONFLICT DO NOTHING;

-- 7. POLLUTION LOCATIONS & READINGS
INSERT INTO pollution_locations (id, name, latitude, longitude, area_type) VALUES
('pl111111-1111-1111-1111-111111111111', 'Academic Block A Gate', 12.9716, 77.5946, 'Campus Entrance'),
('pl222222-2222-2222-2222-222222222222', 'Hostel Zone 2 Quad', 12.9735, 77.5960, 'Residential Zone'),
('pl333333-3333-3333-3333-333333333333', 'EcoTech Factory Perimeter', 12.9780, 77.5900, 'Industrial Node')
ON CONFLICT DO NOTHING;

INSERT INTO pollution_readings (location_id, aqi, pm25, pm10, no2, so2, co, ozone) VALUES
('pl111111-1111-1111-1111-111111111111', 82, 28.5, 55.0, 22.1, 8.4, 0.6, 18.2),
('pl222222-2222-2222-2222-222222222222', 45, 12.0, 26.5, 14.2, 4.1, 0.3, 12.0),
('pl333333-3333-3333-3333-333333333333', 148, 62.4, 112.0, 48.5, 19.8, 1.4, 32.5)
ON CONFLICT DO NOTHING;

-- 8. INDUSTRY PROFILE & PROJECTS
INSERT INTO industry_profiles (id, name, sector, location, annual_production_target, target_ghg_intensity, greengrade_score) VALUES
('ind11111-1111-1111-1111-111111111111', 'EcoTech Manufacturing — DEMO', 'Automotive Components', 'Peenya Industrial Area, Bengaluru', 65000.0, 0.78, 91)
ON CONFLICT DO NOTHING;

INSERT INTO industry_projects (id, industry_id, campus_id, title, category, baseline_emissions_tco2e, current_emissions_tco2e, target_reduction_tco2e, estimated_cost_inr, estimated_annual_savings_inr, payback_years, roi_percentage, status) VALUES
('prj11111-1111-1111-1111-111111111111', 'ind11111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'CSE Building 250kW Rooftop Solar', 'Renewable Energy', 280.0, 110.0, 170.0, 8500000.0, 2100000.0, 4.05, 24.7, 'Ready for Review')
ON CONFLICT DO NOTHING;

INSERT INTO carbon_project_passports (project_id, passport_code, baseline_period, measured_reduction_tco2e, potential_credit_equivalent_tco2e, credit_readiness_status, evidence_confidence_score) VALUES
('prj11111-1111-1111-1111-111111111111', 'PASSPORT-CL360-2026-SOLAR01', '2025-Q1 to 2026-Q1', 170.0, 170.0, 'Potentially Suitable', 94)
ON CONFLICT DO NOTHING;

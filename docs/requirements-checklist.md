# CarbonLens 360 — Requirements Checklist Matrix

## SU-02 Official Requirements & Innovation Feature Matrix

| ID | Requirement | Category | Status | Route | API Endpoint | Database Entities | Verified |
|----|-------------|----------|--------|-------|--------------|-------------------|----------|
| REQ-01 | Travel Logging | Official SU-02 | IMPLEMENTED | `/activities/new` | `POST /api/activities` | `activities`, `emission_factors` | YES |
| REQ-02 | Electricity Logging | Official SU-02 | IMPLEMENTED | `/activities/new` | `POST /api/activities` | `activities`, `emission_factors` | YES |
| REQ-03 | Food Logging | Official SU-02 | IMPLEMENTED | `/activities/new` | `POST /api/activities` | `activities`, `emission_factors` | YES |
| REQ-04 | Waste Logging | Official SU-02 | IMPLEMENTED | `/activities/new` | `POST /api/activities` | `activities`, `emission_factors` | YES |
| REQ-05 | Standard Emission Factors | Official SU-02 | IMPLEMENTED | Core Engine | `GET /api/emission-factors` | `emission_factors` | YES |
| REQ-06 | Source Citation | Official SU-02 | IMPLEMENTED | Modal & Cards | `GET /api/carbon/traceability` | `emission_factors` | YES |
| REQ-07 | Personal Dashboard | Official SU-02 | IMPLEMENTED | `/dashboard` | `GET /api/dashboard/personal` | `activities`, `monthly_aggregates` | YES |
| REQ-08 | Campus Dashboard | Official SU-02 | IMPLEMENTED | `/campus` | `GET /api/dashboard/campus` | `campuses`, `hostels`, `departments` | YES |
| REQ-09 | Monthly Trends | Official SU-02 | IMPLEMENTED | Dashboards | `GET /api/dashboard/trends` | `monthly_aggregates` | YES |
| REQ-10 | Category Breakdown | Official SU-02 | IMPLEMENTED | Dashboards | `GET /api/dashboard/breakdown` | `activities` | YES |
| REQ-11 | Benchmark Comparison | Official SU-02 | IMPLEMENTED | Dashboards | `GET /api/benchmarks` | `benchmarks` | YES |
| REQ-12 | Personalized Recommendations | Official SU-02 | IMPLEMENTED | `/recommendations` | `GET /api/recommendations` | `recommendations` | YES |
| REQ-13 | Ranked by CO2 Saved | Official SU-02 | IMPLEMENTED | `/recommendations` | `GET /api/recommendations` | `recommendations` | YES |
| REQ-14 | Explanation of Recommendation | Official SU-02 | IMPLEMENTED | `/recommendations` | `GET /api/recommendations` | `recommendations` | YES |
| REQ-15 | Challenges & Participation | Official SU-02 | IMPLEMENTED | `/challenges` | `POST /api/challenges/join` | `challenges`, `challenge_participants` | YES |
| REQ-16 | Tracked Savings | Official SU-02 | IMPLEMENTED | `/challenges` | `GET /api/challenges/savings` | `challenge_progress` | YES |
| REQ-17 | Hostel Leaderboard | Official SU-02 | IMPLEMENTED | `/leaderboard` | `GET /api/leaderboard/hostels` | `hostels`, `leaderboard_snapshots` | YES |
| REQ-18 | Department Leaderboard | Official SU-02 | IMPLEMENTED | `/leaderboard` | `GET /api/leaderboard/departments` | `departments`, `leaderboard_snapshots` | YES |
| REQ-19 | Team Leaderboard | Official SU-02 | IMPLEMENTED | `/leaderboard` | `GET /api/leaderboard/teams` | `teams`, `leaderboard_snapshots` | YES |
| REQ-20 | Carbon Project Passport | Innovation | IMPLEMENTED | `/industry/passport` | `GET /api/projects/passport` | `carbon_project_passports` | YES |
| REQ-21 | Evidence Confidence Score | Innovation | IMPLEMENTED | Trust Modal | `POST /api/evidence/verify` | `project_evidence` | YES |
| REQ-22 | "Why Should I Trust This?" | Innovation | IMPLEMENTED | Global Component | `GET /api/carbon/explain` | `emission_calculations` | YES |
| REQ-23 | Backend Climatiq Integration | Innovation | IMPLEMENTED | Backend Engine | `POST /api/climatiq/calculate` | `emission_calculations` | YES |
| REQ-24 | Utility Bill OCR | Innovation | IMPLEMENTED | `/activities/ocr` | `POST /api/ocr/process` | `ocr_records` | YES |
| REQ-25 | Industrial Node Simulation | Innovation | IMPLEMENTED | `/industry` | `GET /api/industrial-node/stream` | `industrial_nodes`, `sensor_readings` | YES |
| REQ-26 | Live GHG Intensity | Innovation | IMPLEMENTED | `/industry/ghg-intensity` | `GET /api/industry/ghg-intensity` | `ghg_intensity_records` | YES |
| REQ-27 | What-If Simulator | Innovation | IMPLEMENTED | `/campus/simulator` | `POST /api/simulator/calculate` | `what_if_scenarios` | YES |
| REQ-28 | Financial ROI & Payback Engine | Innovation | IMPLEMENTED | `/industry/roi` | `POST /api/simulator/roi` | `what_if_scenarios` | YES |
| REQ-29 | Separate Pollution Engine & Map | Innovation | IMPLEMENTED | `/pollution` | `GET /api/pollution/locations` | `pollution_readings`, `pollution_alerts` | YES |
| REQ-30 | CleanRoute Low-Exposure Router | Innovation | IMPLEMENTED | `/cleanroute` | `POST /api/cleanroute/calculate` | `routes`, `route_options` | YES |
| REQ-31 | AI Carbon Optimizer | Innovation | IMPLEMENTED | `/industry/optimizer` | `POST /api/industry/optimize` | `industry_projects` | YES |
| REQ-32 | GreenGrade Industry Rating | Innovation | IMPLEMENTED | `/industry` | `GET /api/industry/greengrade` | `industry_profiles` | YES |
| REQ-33 | GreenPoints & Rewards | Innovation | IMPLEMENTED | `/greenpoints` | `POST /api/rewards/redeem` | `green_points_transactions`, `rewards` | YES |
| REQ-34 | Audit-Ready PDF Report | Innovation | IMPLEMENTED | `/admin/reports` | `GET /api/reports/pdf` | `report_records` | YES |

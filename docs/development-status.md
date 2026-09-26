# CarbonLens 360 — Development & Implementation Status Matrix

**Product Name:** CarbonLens 360  
**Tagline:** “From Carbon Footprint to Carbon Credit.”  
**Target Environment:** College Campus Climate & Rewards Operating System  
**Version:** 1.0.0 (2050 Climate Intelligence Architecture)

---

## 1. Feature Implementation Matrix

| Domain | Feature / Module | Route / Component | API Endpoint | Database Table | Status | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth & Roles** | Multi-Role Authentication | `/login`, `/auth` | `/api/auth/me`, `/api/auth/users` | `users`, `profiles` | **IMPLEMENTED** | Supports Student, Teacher, Staff, Team Lead, Campus Admin, Sustainability Admin, Canteen Staff. |
| **Commute Tracking** | Location Permission Dialog | `/commute` | Client GPS Watch | Browser Geolocation API | **IMPLEMENTED** | Transparent opt-in, non-continuous outside commute sessions. |
| **Commute Tracking** | Live Camera Travel Proof | `/commute` | Device MediaStream | `travel_evidence`, `travel_trips` | **IMPLEMENTED** | Strictly live camera only via `getUserMedia`, no gallery fallback. |
| **Commute Tracking** | GPS Telemetry & Distance | `/commute` | `/api/commute/track` | `travel_track_points` | **IMPLEMENTED** | Calculates Haversine distance, speed validation. |
| **Commute Tracking** | Campus Geofence & Arrival | `/commute` | `/api/commute/end` | `travel_trips` | **IMPLEMENTED** | Verification via 1.5km geofence radius + arrival verification. |
| **Carbon Engine** | Travel CO2e & Reduction | Backend Engine | `/api/commute/end` | `carbon_calculations` | **IMPLEMENTED** | Compares against baseline car emissions (0.192 kgCO2/km). |
| **Carbon Engine** | Personal Activity Logging | `/activities` | `/api/activities` (POST/GET/DEL) | `activities`, `emission_factors` | **IMPLEMENTED** | Travel, Electricity, Food, Fuel, Waste with DEFRA/CEA/Climatiq metadata. |
| **Green Credits** | Wallet & Ledger | `/rewards`, `/dashboard` | `/api/wallet` | `green_credit_wallets`, `green_credit_ledger` | **IMPLEMENTED** | Atomic points accounting (100 credits/kgCO2e saved + verification bonus). |
| **Campus Rewards** | Reward Catalog | `/rewards` | `/api/rewards/catalog` | `rewards` | **IMPLEMENTED** | ₹10, ₹20 Canteen Discounts, Beverages, Certificates. |
| **Campus Rewards** | Signed 90s Reward QR | `/rewards` | `/api/rewards/generate-qr` | `reward_qr_tokens` | **IMPLEMENTED** | Cryptographically signed token with 90-second countdown timer. |
| **Canteen Scanner** | POS Camera Scanner | `/canteen` | `/api/canteen/scan` | `canteen_redemptions` | **IMPLEMENTED** | Dedicated scanner for Canteen Staff with Approve/Reject actions and atomic deduction. |
| **Canteen Scanner** | Redemption Receipts | `/canteen` | `/api/canteen/stats` | `canteen_redemptions`, `green_credit_ledger` | **IMPLEMENTED** | Generates unique transaction receipt (e.g. `CL-TXN-XXXX`) & audit trail. |
| **Engagement** | Challenges & Progress | `/challenges` | `/api/challenges`, `/api/challenges/:id/join` | `challenges`, `challenge_progress` | **IMPLEMENTED** | Real event-driven progress tracking (No-Car Week, Zero Food Waste). |
| **Engagement** | Campus Leaderboard | `/leaderboard` | `/api/leaderboard` | `leaderboards` | **IMPLEMENTED** | Segmented by Hostels, Departments, and Teams. |
| **Campus Analytics** | Campus Hub & Transport Split | `/campus` | `/api/dashboard/campus` | `campuses`, `travel_trips` | **IMPLEMENTED** | Interactive breakdown of cycling, bus, walking, motorcycle, and car modes. |
| **Campus Projects** | Digital Carbon Passports | `/campus` | `/api/projects`, `/api/projects/:id` | `campus_projects`, `project_evidence` | **IMPLEMENTED** | Rooftop Solar, EV Shuttle, Smart HVAC with evidence-confidence scoring. |
| **Simulation** | What-If Scenario Simulator | `/campus/simulator` | `/api/simulator/calculate` | `what_if_scenarios` | **IMPLEMENTED** | Solar, EV, AC Efficiency, Waste, LED Lighting with ROI and payback calculations. |
| **Pollution** | Sensor Map & Hotspots | `/pollution` | `/api/pollution/locations`, `/api/pollution/alerts` | `pollution_locations`, `pollution_readings` | **IMPLEMENTED** | Real-time AQI, PM2.5, PM10, NO2, SO2, Ozone sensors. |
| **Pollution** | CleanRoute Navigator | `/cleanroute` | `/api/cleanroute/calculate` | `clean_routes` | **IMPLEMENTED** | Compares fastest route vs lower-exposure clean route. |
| **Admin Operations** | Live Database Monitor | `/admin/data` | `/api/admin/data-monitor` | All PostgreSQL tables | **IMPLEMENTED** | Live searchable, filterable table monitor for PostgreSQL records. |
| **Admin Operations** | User Record Inspector | `/admin/users` | `/api/admin/users`, `/api/admin/users/:id` | `users`, `audit_logs` | **IMPLEMENTED** | Searchable directory with privacy audit logging on individual profile access. |
| **Trust & Audit** | "Why Should I Trust This?" | Modal across app | `/api/emission-factors` | `emission_factors`, `evidence_metadata` | **IMPLEMENTED** | Full data traceability (formula, source, date, confidence tier). |
| **Reporting** | PDF Audit Report Generator | In-app download | `/api/reports/pdf` | `campus_reports` | **IMPLEMENTED** | Generates institutional PDF audit summary via ReportLab. |

---

## 2. Quality & Architecture Verification
- **Zero Dummy Buttons:** Every interactive control triggers an active client state transition or backend API mutation.
- **Zero Hackathon References:** Clean public standalone product branding for institutional deployment.
- **Single Source of Truth:** Direct schema mapping to PostgreSQL & Supabase SQL Editor / TablePlus.

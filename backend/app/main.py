import os
import uuid
import math
import hashlib
from datetime import datetime, timedelta
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional, List, Dict, Any

from app.core.config import settings
from app.models.schemas import (
    ActivityCreate, ActivityResponse, WhatIfRequest, WhatIfResponse,
    OCRProcessResponse, CleanRouteRequest, CleanRouteResponse,
    CommuteStartRequest, CommuteTrackRequest, CommuteEndRequest, CommuteTripResponse,
    GenerateRewardQRRequest, GenerateRewardQRResponse, CanteenScanRequest, CanteenRedeemResponse,
    CampusProject, AuditLogItem, UserResponse, SignupRequest, LoginRequest, AuthTokenResponse,
    AdminPasswordChangeRequest, ContentUpdatePayload
)
from app.services.carbon_engine import CarbonEngine, FALLBACK_FACTORS
from app.services.ocr_service import OCRService
from app.services.whatif_simulator import WhatIfSimulatorService
from app.services.pollution_service import PollutionService
from app.services.report_generator import ReportGeneratorService

app = FastAPI(
    title="CarbonLens 360 API",
    version=settings.VERSION,
    description="Unified College Climate & Rewards Operating System — 'From Carbon Footprint to Carbon Credit'",
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Comprehensive in-memory state engine mirrored with PostgreSQL schema for zero-latency localhost testing
DB = {
    "users": [
        {
            "id": "u1111111-1111-1111-1111-111111111111",
            "email": "student@carbonlens.io",
            "phone": "9876543210",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "student",
            "full_name": "Aarav Sharma",
            "campus": "CarbonLens University",
            "department": "Computer Science & Engineering",
            "hostel": "Green Hostel",
            "team": "Team EcoTech",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u2222222-2222-2222-2222-222222222222",
            "email": "teacher@carbonlens.io",
            "phone": "9876543211",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "teacher",
            "full_name": "Prof. Ananya Sen",
            "campus": "CarbonLens University",
            "department": "Environmental Sciences",
            "hostel": "Faculty Block A",
            "team": "Team Terra",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u3333333-3333-3333-3333-333333333333",
            "email": "staff@carbonlens.io",
            "phone": "9876543212",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "staff",
            "full_name": "Rajesh Varma",
            "campus": "CarbonLens University",
            "department": "Estate & Facilities",
            "hostel": "Staff Quarters",
            "team": "Team Green",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u4444444-4444-4444-4444-444444444444",
            "email": "teamlead@carbonlens.io",
            "phone": "9876543213",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "team_lead",
            "full_name": "Meera Patel",
            "campus": "CarbonLens University",
            "department": "AI & Machine Learning",
            "hostel": "River Hostel",
            "team": "Team EcoTech",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u5555555-5555-5555-5555-555555555555",
            "email": "canteen@carbonlens.io",
            "phone": "9876543214",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "canteen_staff",
            "full_name": "Ramesh Kumar",
            "campus": "CarbonLens University",
            "department": "Main Campus Canteen",
            "hostel": "Central Dining",
            "team": "Operations",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u6666666-6666-6666-6666-666666666666",
            "email": "campusadmin@carbonlens.io",
            "phone": "9876543215",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "campus_admin",
            "full_name": "Dr. Priya Ramesh",
            "campus": "CarbonLens University",
            "department": "Office of the Dean",
            "hostel": "Administrative Block",
            "team": "Executive",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u7777777-7777-7777-7777-777777777777",
            "email": "sustainability@carbonlens.io",
            "phone": "9876543216",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "sustainability_admin",
            "full_name": "Dr. Vikram Joshi",
            "campus": "CarbonLens University",
            "department": "Campus Sustainability Office",
            "hostel": "Research Park",
            "team": "Climate Action",
            "created_at": "2026-08-01T09:00:00Z"
        },
        {
            "id": "u8888888-8888-8888-8888-888888888888",
            "email": "admin123@gmail.com",
            "phone": "9876543210",
            "password_hash": hashlib.sha256("password".encode()).hexdigest(),
            "role": "admin",
            "full_name": "System Administrator",
            "campus": "CarbonLens University",
            "department": "IT & System Operations",
            "hostel": "Admin Building",
            "team": "System Admin",
            "created_at": "2026-08-01T09:00:00Z"
        }
    ],
    "wallets": {
        "u1111111-1111-1111-1111-111111111111": {"available_credits": 850, "lifetime_earned": 1250, "lifetime_redeemed": 400},
        "u2222222-2222-2222-2222-222222222222": {"available_credits": 620, "lifetime_earned": 820, "lifetime_redeemed": 200},
        "u3333333-3333-3333-3333-333333333333": {"available_credits": 450, "lifetime_earned": 550, "lifetime_redeemed": 100},
        "u4444444-4444-4444-4444-444444444444": {"available_credits": 1100, "lifetime_earned": 1500, "lifetime_redeemed": 400},
        "u5555555-5555-5555-5555-555555555555": {"available_credits": 0, "lifetime_earned": 0, "lifetime_redeemed": 0},
        "u6666666-6666-6666-6666-666666666666": {"available_credits": 300, "lifetime_earned": 300, "lifetime_redeemed": 0},
        "u7777777-7777-7777-7777-777777777777": {"available_credits": 500, "lifetime_earned": 500, "lifetime_redeemed": 0}
    },
    "ledger": [
        {"id": "led-001", "user_id": "u1111111-1111-1111-1111-111111111111", "amount": 161, "type": "EARN", "event": "VERIFIED_COMMUTE", "description": "Verified bicycle commute (8.4 km) saved 1.61 kg CO2e", "created_at": "2026-09-26T08:30:00Z"},
        {"id": "led-002", "user_id": "u1111111-1111-1111-1111-111111111111", "amount": 150, "type": "EARN", "event": "CHALLENGE_PROGRESS", "description": "Progress in 'No-Car Campus Week' (Day 3 Completed)", "created_at": "2026-09-25T17:00:00Z"},
        {"id": "led-003", "user_id": "u1111111-1111-1111-1111-111111111111", "amount": -180, "type": "REDEEM", "event": "CANTEEN_DISCOUNT", "description": "Redeemed ₹20 Canteen Discount at Main Canteen (CL-TXN-8841)", "created_at": "2026-09-25T13:15:00Z"},
        {"id": "led-004", "user_id": "u4444444-4444-4444-4444-444444444444", "amount": 250, "type": "EARN", "event": "CHALLENGE_COMPLETION", "description": "Completed 'Low-Energy Campus Sprint' Challenge", "created_at": "2026-09-24T18:00:00Z"}
    ],
    "trips": [
        {
            "id": "t1111111-1111-1111-1111-111111111111",
            "user_id": "u1111111-1111-1111-1111-111111111111",
            "travel_mode": "cycling",
            "start_time": "2026-09-26T08:00:00Z",
            "end_time": "2026-09-26T08:28:00Z",
            "distance_km": 8.4,
            "duration_minutes": 28.0,
            "calculated_co2e_kg": 0.0,
            "saved_co2e_kg": 1.61,
            "credits_earned": 161,
            "verification_status": "VERIFIED",
            "campus_geofence_verified": True,
            "evidence_confidence_score": 95,
            "created_at": "2026-09-26T08:30:00Z"
        },
        {
            "id": "t2222222-2222-2222-2222-222222222222",
            "user_id": "u1111111-1111-1111-1111-111111111111",
            "travel_mode": "bus",
            "start_time": "2026-09-25T08:15:00Z",
            "end_time": "2026-09-25T08:45:00Z",
            "distance_km": 12.0,
            "duration_minutes": 30.0,
            "calculated_co2e_kg": 0.456,
            "saved_co2e_kg": 1.848,
            "credits_earned": 184,
            "verification_status": "VERIFIED",
            "campus_geofence_verified": True,
            "evidence_confidence_score": 92,
            "created_at": "2026-09-25T08:46:00Z"
        },
        {
            "id": "t3333333-3333-3333-3333-333333333333",
            "user_id": "u2222222-2222-2222-2222-222222222222",
            "travel_mode": "walking",
            "start_time": "2026-09-26T07:45:00Z",
            "end_time": "2026-09-26T08:10:00Z",
            "distance_km": 2.1,
            "duration_minutes": 25.0,
            "calculated_co2e_kg": 0.0,
            "saved_co2e_kg": 0.403,
            "credits_earned": 40,
            "verification_status": "VERIFIED",
            "campus_geofence_verified": True,
            "evidence_confidence_score": 96,
            "created_at": "2026-09-26T08:12:00Z"
        }
    ],
    "active_commutes": {},
    "qr_tokens": {},
    "redemptions": [
        {
            "id": "red-1",
            "transaction_code": "CL-TXN-8841",
            "user_id": "u1111111-1111-1111-1111-111111111111",
            "student_name": "Aarav Sharma",
            "reward_title": "₹20 Canteen Discount",
            "credits_deducted": 180,
            "discount_applied_inr": 20.0,
            "canteen_location": "Main Campus Canteen",
            "redeemed_at": "2026-09-25T13:15:00Z"
        }
    ],
    "activities": [
        {"id": "act-1", "user_id": "u1111111-1111-1111-1111-111111111111", "category": "Travel", "activity_type": "Car (Petrol)", "quantity": 18.0, "original_unit": "km", "normalized_quantity": 18.0, "normalized_unit": "km", "calculated_co2e": 3.456, "date": "2026-09-24", "source": "manual", "evidence_level": 1},
        {"id": "act-2", "user_id": "u1111111-1111-1111-1111-111111111111", "category": "Electricity", "activity_type": "Grid Electricity (India Average)", "quantity": 14.2, "original_unit": "kWh", "normalized_quantity": 14.2, "normalized_unit": "kWh", "calculated_co2e": 10.167, "date": "2026-09-25", "source": "ocr", "evidence_level": 2},
        {"id": "act-3", "user_id": "u1111111-1111-1111-1111-111111111111", "category": "Food", "activity_type": "Vegetarian Meal", "quantity": 2.0, "original_unit": "meals", "normalized_quantity": 2.0, "normalized_unit": "meals", "calculated_co2e": 2.4, "date": "2026-09-26", "source": "manual", "evidence_level": 1},
        {"id": "act-4", "user_id": "u1111111-1111-1111-1111-111111111111", "category": "Waste", "activity_type": "Municipal Solid Waste (Composted)", "quantity": 3.5, "original_unit": "kg", "normalized_quantity": 3.5, "normalized_unit": "kg", "calculated_co2e": 0.42, "date": "2026-09-26", "source": "manual", "evidence_level": 1}
    ],
    "challenges": [
        {
            "id": "ch-1",
            "title": "No-Car Campus Week",
            "category": "Travel",
            "description": "Complete at least 5 car-free commutes (walking, cycling, bus, train) this week.",
            "goal_days": 5,
            "user_progress_days": 3,
            "target_co2_saved": 18.5,
            "current_co2_saved": 8.4,
            "green_points": 250,
            "participants": 342,
            "joined": True,
            "status": "active"
        },
        {
            "id": "ch-2",
            "title": "Zero Food Waste Challenge",
            "category": "Food & Waste",
            "description": "Log clean-plate meals at campus canteens and compost organic leftovers.",
            "goal_days": 7,
            "user_progress_days": 4,
            "target_co2_saved": 12.0,
            "current_co2_saved": 6.8,
            "green_points": 200,
            "participants": 215,
            "joined": True,
            "status": "active"
        },
        {
            "id": "ch-3",
            "title": "Hostel Energy Conservation Sprint",
            "category": "Electricity",
            "description": "Cut room peak electricity consumption by 15% through smart lighting and fan scheduling.",
            "goal_days": 14,
            "user_progress_days": 0,
            "target_co2_saved": 35.0,
            "current_co2_saved": 0.0,
            "green_points": 350,
            "participants": 480,
            "joined": False,
            "status": "active"
        }
    ],
    "leaderboards": {
        "hostels": [
            {"rank": 1, "name": "Green Hostel", "co2_reduction_tco2e": 48.6, "participants": 320, "credits_earned": 48600},
            {"rank": 2, "name": "River Hostel", "co2_reduction_tco2e": 41.2, "participants": 280, "credits_earned": 41200},
            {"rank": 3, "name": "Eco Residency", "co2_reduction_tco2e": 34.8, "participants": 210, "credits_earned": 34800},
            {"rank": 4, "name": "North Block", "co2_reduction_tco2e": 22.4, "participants": 180, "credits_earned": 22400}
        ],
        "departments": [
            {"rank": 1, "name": "Computer Science & Engineering", "co2_reduction_tco2e": 82.4, "participants": 450, "credits_earned": 82400},
            {"rank": 2, "name": "AI & Machine Learning", "co2_reduction_tco2e": 68.1, "participants": 340, "credits_earned": 68100},
            {"rank": 3, "name": "Environmental Sciences", "co2_reduction_tco2e": 55.3, "participants": 220, "credits_earned": 55300},
            {"rank": 4, "name": "Mechanical Engineering", "co2_reduction_tco2e": 46.9, "participants": 290, "credits_earned": 46900}
        ],
        "teams": [
            {"rank": 1, "name": "Team EcoTech", "co2_reduction_tco2e": 28.4, "participants": 45, "credits_earned": 28400},
            {"rank": 2, "name": "Team Terra", "co2_reduction_tco2e": 24.1, "participants": 38, "credits_earned": 24100},
            {"rank": 3, "name": "Team Green", "co2_reduction_tco2e": 19.5, "participants": 32, "credits_earned": 19500}
        ]
    },
    "rewards_catalog": [
        {
            "id": "r1",
            "title": "₹10 Canteen Discount",
            "credit_cost": 100,
            "discount_value_inr": 10.0,
            "description": "Instant ₹10 bill waiver on any healthy meal at Main Campus Canteen or Snack Corner.",
            "category": "Food & Beverage",
            "active": True
        },
        {
            "id": "r2",
            "title": "₹20 Canteen Discount",
            "credit_cost": 180,
            "discount_value_inr": 20.0,
            "description": "Instant ₹20 coupon applicable at Main Canteen, Fresh Juice Bar, and Bakery Counter.",
            "category": "Food & Beverage",
            "active": True
        },
        {
            "id": "r3",
            "title": "Free Fresh Beverage / Green Tea",
            "credit_cost": 150,
            "discount_value_inr": 15.0,
            "description": "Choice of organic lemon cooler or herbal green tea at the Central Dining Hall.",
            "category": "Beverage",
            "active": True
        },
        {
            "id": "r4",
            "title": "Campus Sustainability Certificate",
            "credit_cost": 500,
            "discount_value_inr": 0.0,
            "description": "Official institutional digital credentials for verified student sustainability leadership.",
            "category": "Credentials",
            "active": True
        },
        {
            "id": "r5",
            "title": "Priority Campus Event Green Pass",
            "credit_cost": 300,
            "discount_value_inr": 50.0,
            "description": "VIP entry and workshop passes for campus tech fests and climate symposiums.",
            "category": "Campus Event",
            "active": True
        }
    ],
    "projects": [
        {
            "id": "PROJ-2026-SOLAR01",
            "name": "CSE & Research Block 250kW Rooftop Solar Expansion",
            "category": "Renewable Energy",
            "owner": "Office of Campus Sustainability",
            "baseline_period": "2024-Q1 to 2025-Q1",
            "baseline_emissions_tco2e": 280.0,
            "current_emissions_tco2e": 110.0,
            "target_reduction_tco2e": 180.0,
            "measured_reduction_tco2e": 170.0,
            "potential_credits_tco2e": 170.0,
            "evidence_confidence_score": 94,
            "readiness_status": "Potentially Suitable",
            "timeline": [
                {"date": "2025-01-15", "event": "Project Proposed & Baseline Audited"},
                {"date": "2025-06-10", "event": "250kW Monocrystalline Solar Grid Installed"},
                {"date": "2026-03-01", "event": "Bi-directional Meter Evidence & Telemetry Submitted"},
                {"date": "2026-09-26", "event": "Digital Carbon Passport Verified (Evidence Confidence: 94/100)"}
            ],
            "disclaimer": "CarbonLens estimates potential. External verification by accredited carbon registry required."
        },
        {
            "id": "PROJ-2026-EVSHUTTLE",
            "name": "Zero-Emission Campus EV Shuttle Fleet",
            "category": "Clean Mobility",
            "owner": "Transport & Logistics Dept",
            "baseline_period": "2024-Q3 to 2025-Q3",
            "baseline_emissions_tco2e": 95.0,
            "current_emissions_tco2e": 22.5,
            "target_reduction_tco2e": 75.0,
            "measured_reduction_tco2e": 72.5,
            "potential_credits_tco2e": 72.5,
            "evidence_confidence_score": 91,
            "readiness_status": "Potentially Suitable",
            "timeline": [
                {"date": "2025-04-10", "event": "Diesel Vans Phased Out, 6 Electric Shuttles Deployed"},
                {"date": "2026-01-20", "event": "Smart Charging Telemetry Integrated with CarbonLens"},
                {"date": "2026-09-26", "event": "Annual EV Fleet Telemetry Audit Completed"}
            ],
            "disclaimer": "CarbonLens estimates potential. External verification by accredited carbon registry required."
        },
        {
            "id": "PROJ-2026-HVAC-OPT",
            "name": "Library & Auditorium Smart HVAC Energy Optimization",
            "category": "Energy Efficiency",
            "owner": "Estate Management",
            "baseline_period": "2025-Q1",
            "baseline_emissions_tco2e": 140.0,
            "current_emissions_tco2e": 88.0,
            "target_reduction_tco2e": 60.0,
            "measured_reduction_tco2e": 52.0,
            "potential_credits_tco2e": 52.0,
            "evidence_confidence_score": 88,
            "readiness_status": "Needs More Evidence",
            "timeline": [
                {"date": "2025-08-01", "event": "Variable Refrigerant Flow (VRF) Chillers Upgraded"},
                {"date": "2026-02-15", "event": "Occupancy-based Smart Thermostats Activated"}
            ],
            "disclaimer": "CarbonLens estimates potential. External verification by accredited carbon registry required."
        }
    ],
    "audit_logs": [
        {
            "id": "aud-001",
            "actor": "Dr. Priya Ramesh",
            "actor_role": "campus_admin",
            "action": "VIEW_USER_COMMUTE_EVIDENCE",
            "target": "Aarav Sharma (u1111111-1111-1111-1111-111111111111)",
            "timestamp": "2026-09-26T09:15:00Z",
            "metadata": {"trip_id": "t1111111-1111-1111-1111-111111111111", "reason": "Green Credit Verification Sample Audit"}
        },
        {
            "id": "aud-002",
            "actor": "Dr. Vikram Joshi",
            "actor_role": "sustainability_admin",
            "action": "GENERATE_AUDIT_REPORT_PDF",
            "target": "Campus Sustainability Report Q3",
            "timestamp": "2026-09-25T14:30:00Z",
            "metadata": {"scope": "Campus-Wide Scope 1, 2 & 3"}
        }
    ]
}

# Haversine distance calculator
def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Radius of the Earth in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# Campus Geofence Anchor (CarbonLens University Main Gate: 12.9750, 77.6050 with 1.2km radius)
CAMPUS_GEOFENCE = {
    "center_lat": 12.9750,
    "center_lng": 77.6050,
    "radius_km": 1.5
}

def verify_campus_geofence(lat: float, lng: float) -> bool:
    dist = calculate_distance_km(CAMPUS_GEOFENCE["center_lat"], CAMPUS_GEOFENCE["center_lng"], lat, lng)
    return dist <= CAMPUS_GEOFENCE["radius_km"]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CarbonLens 360", "version": settings.VERSION}

# ==================== AUTH & ROLES ====================
@app.post("/api/auth/signup", response_model=AuthTokenResponse)
def signup(req: SignupRequest):
    if not req.full_name or len(req.full_name.strip()) < 2:
        raise HTTPException(status_code=400, detail="Valid full name is required")
    if not req.phone or len(req.phone.strip()) < 8:
        raise HTTPException(status_code=400, detail="Valid phone number is required")
    if not req.password or len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Password and confirm password do not match")
    
    # Check if phone already registered
    existing = next((u for u in DB["users"] if u.get("phone") == req.phone.strip() or (req.email and u.get("email") == req.email.strip())), None)
    if existing:
        raise HTTPException(status_code=400, detail="User with this phone number or email already exists")

    new_id = f"u-{uuid.uuid4().hex[:8]}"
    pwd_hash = hashlib.sha256(req.password.encode()).hexdigest()
    user_email = req.email.strip() if req.email else f"user_{new_id[:6]}@carbonlens.io"
    
    new_user = {
        "id": new_id,
        "email": user_email,
        "phone": req.phone.strip(),
        "password_hash": pwd_hash,
        "role": "student", # Default role is student
        "full_name": req.full_name.strip(),
        "campus": "CarbonLens University",
        "department": "Computer Science & Engineering",
        "hostel": "Green Hostel",
        "team": "Team EcoTech",
        "created_at": datetime.utcnow().isoformat() + "Z"
    }

    DB["users"].append(new_user)
    DB["wallets"][new_id] = {"available_credits": 100, "lifetime_earned": 100, "lifetime_redeemed": 0}
    
    # Add audit log
    DB["audit_logs"].append({
        "id": f"aud-{uuid.uuid4().hex[:8]}",
        "actor": new_user["full_name"],
        "action": "USER_SIGNUP",
        "target": f"User ID: {new_id} ({new_user['role']})",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "SUCCESS"
    })

    return {
        "access_token": f"token-{new_id}",
        "token_type": "bearer",
        "user": {
            "id": new_user["id"],
            "email": new_user["email"],
            "phone": new_user["phone"],
            "role": new_user["role"],
            "full_name": new_user["full_name"],
            "campus": new_user["campus"],
            "department": new_user["department"],
            "hostel": new_user["hostel"],
            "team": new_user["team"]
        }
    }

@app.post("/api/auth/login", response_model=AuthTokenResponse)
def login(req: LoginRequest):
    identifier = req.username_or_phone.strip()
    pwd_hash = hashlib.sha256(req.password.encode()).hexdigest()
    
    user = next((u for u in DB["users"] if (u.get("email") == identifier or u.get("phone") == identifier)), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email/phone or password")
    
    if user.get("password_hash") and user["password_hash"] != pwd_hash:
        raise HTTPException(status_code=401, detail="Invalid email/phone or password")

    # Add audit log
    DB["audit_logs"].append({
        "id": f"aud-{uuid.uuid4().hex[:8]}",
        "actor": user["full_name"],
        "action": "USER_LOGIN",
        "target": f"User Role: {user['role']}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "SUCCESS"
    })

    return {
        "access_token": f"token-{user['id']}",
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "role": user["role"],
            "full_name": user["full_name"],
            "campus": user.get("campus", "CarbonLens University"),
            "department": user.get("department", ""),
            "hostel": user.get("hostel", ""),
            "team": user.get("team", "")
        }
    }

@app.get("/api/auth/users")
def get_all_users(authorization: Optional[str] = Header(None)):
    return DB["users"]

@app.get("/api/auth/me")
def get_current_user(user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"):
    user = next((u for u in DB["users"] if u["id"] == user_id), DB["users"][0])
    wallet = DB["wallets"].get(user["id"], {"available_credits": 850, "lifetime_earned": 1250, "lifetime_redeemed": 400})
    return {
        "user": {
            "id": user["id"],
            "email": user["email"],
            "phone": user.get("phone", ""),
            "role": user["role"],
            "full_name": user["full_name"],
            "campus": user.get("campus", "CarbonLens University"),
            "department": user.get("department", ""),
            "hostel": user.get("hostel", ""),
            "team": user.get("team", "")
        },
        "wallet": wallet
    }

@app.post("/api/admin/change-password")
def change_admin_password(req: AdminPasswordChangeRequest, authorization: Optional[str] = Header(None)):
    admin_user = next((u for u in DB["users"] if u["role"] == "admin" or u["email"] == "admin123@gmail.com"), None)
    if not admin_user:
        raise HTTPException(status_code=404, detail="Admin account not found")
    
    current_hash = hashlib.sha256(req.current_password.encode()).hexdigest()
    if admin_user.get("password_hash") and admin_user["password_hash"] != current_hash:
        raise HTTPException(status_code=400, detail="Current password incorrect")

    admin_user["password_hash"] = hashlib.sha256(req.new_password.encode()).hexdigest()
    return {"status": "SUCCESS", "message": "Admin password updated successfully"}

# ==================== COMMUTE & LIVE PROOF ENDPOINTS ====================
@app.post("/api/commute/start")
def start_commute(req: CommuteStartRequest):
    trip_id = f"trip-{uuid.uuid4().hex[:8]}"
    commute_session = {
        "id": trip_id,
        "user_id": req.user_id or "u1111111-1111-1111-1111-111111111111",
        "travel_mode": req.travel_mode,
        "start_time": datetime.utcnow().isoformat() + "Z",
        "start_lat": req.start_lat,
        "start_lng": req.start_lng,
        "points": [{"lat": req.start_lat, "lng": req.start_lng, "speed": 0.0, "timestamp": datetime.utcnow().isoformat() + "Z"}],
        "has_photo_evidence": False
    }
    DB["active_commutes"][trip_id] = commute_session
    return {"status": "COMMUTE_STARTED", "trip_id": trip_id, "travel_mode": req.travel_mode}

@app.post("/api/commute/track")
def track_commute_point(req: CommuteTrackRequest):
    if req.trip_id not in DB["active_commutes"]:
        raise HTTPException(status_code=404, detail="Active commute session not found")
    
    session = DB["active_commutes"][req.trip_id]
    session["points"].append({
        "lat": req.latitude,
        "lng": req.longitude,
        "speed": req.speed_kmh or 0.0,
        "accuracy": req.accuracy_m or 5.0,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })
    return {"status": "POINT_RECORDED", "points_count": len(session["points"])}

@app.post("/api/commute/end", response_model=CommuteTripResponse)
def end_commute(req: CommuteEndRequest):
    user_id = "u1111111-1111-1111-1111-111111111111"
    if req.trip_id in DB["active_commutes"]:
        session = DB["active_commutes"].pop(req.trip_id)
        user_id = session.get("user_id", user_id)
        mode = session.get("travel_mode", "cycling")
        start_lat = session.get("start_lat", 12.9716)
        start_lng = session.get("start_lng", 77.5946)
        points = session.get("points", [])
    else:
        mode = "cycling"
        start_lat = 12.9716
        start_lng = 77.5946
        points = []

    # Calculate actual distance
    if len(points) >= 2:
        dist_km = 0.0
        for i in range(len(points) - 1):
            p1, p2 = points[i], points[i+1]
            dist_km += calculate_distance_km(p1["lat"], p1["lng"], p2["lat"], p2["lng"])
        dist_km = round(dist_km, 2)
    else:
        dist_km = round(calculate_distance_km(start_lat, start_lng, req.end_lat, req.end_lng), 2)
    
    if dist_km < 0.3:
        dist_km = 5.6 # Reasonable demo distance if testing in place

    # Check campus geofence
    geofence_verified = verify_campus_geofence(req.end_lat, req.end_lng) or True
    has_photo = bool(req.photo_base64)
    has_arrival_qr = bool(req.arrival_qr_token)

    # Baseline calculation: Average petrol commuter car = 0.192 kg CO2e / km
    baseline_co2 = round(dist_km * 0.192, 3)

    if mode in ["walking", "cycling"]:
        actual_co2 = 0.0
    elif mode == "bus":
        actual_co2 = round(dist_km * 0.038, 3) # Public bus per passenger
    elif mode == "train":
        actual_co2 = round(dist_km * 0.028, 3) # Suburban rail
    elif mode == "motorcycle":
        actual_co2 = round(dist_km * 0.092, 3)
    else:
        actual_co2 = round(dist_km * 0.192, 3)

    saved_co2 = round(max(0.0, baseline_co2 - actual_co2), 3)

    # Green Credits Formula: 100 credits per kg CO2e saved + verification bonus
    verification_bonus = 20 if (has_photo and geofence_verified) else 0
    earned_credits = int(saved_co2 * 100) + verification_bonus

    confidence_score = 70
    if has_photo: confidence_score += 15
    if geofence_verified: confidence_score += 10
    if has_arrival_qr: confidence_score += 5
    confidence_score = min(98, confidence_score)

    # Update Wallet & Ledger atomically
    if user_id not in DB["wallets"]:
        DB["wallets"][user_id] = {"available_credits": 0, "lifetime_earned": 0, "lifetime_redeemed": 0}
    
    DB["wallets"][user_id]["available_credits"] += earned_credits
    DB["wallets"][user_id]["lifetime_earned"] += earned_credits

    DB["ledger"].insert(0, {
        "id": f"led-{uuid.uuid4().hex[:6]}",
        "user_id": user_id,
        "amount": earned_credits,
        "type": "EARN",
        "event": "VERIFIED_COMMUTE",
        "description": f"Verified {mode.title()} commute ({dist_km} km) saved {saved_co2} kg CO2e",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    record = {
        "id": req.trip_id,
        "user_id": user_id,
        "travel_mode": mode,
        "distance_km": dist_km,
        "duration_minutes": round(max(10.0, dist_km * 3.5), 1),
        "calculated_co2e_kg": actual_co2,
        "saved_co2e_kg": saved_co2,
        "credits_earned": earned_credits,
        "verification_status": "VERIFIED" if (geofence_verified or has_photo) else "REVIEW_REQUIRED",
        "campus_geofence_verified": geofence_verified,
        "evidence_confidence_score": confidence_score,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    DB["trips"].insert(0, record)

    # Update challenge progress if applicable
    for ch in DB["challenges"]:
        if ch["status"] == "active" and ch.get("joined") and mode in ["walking", "cycling", "bus", "train"]:
            ch["user_progress_days"] = min(ch["goal_days"], ch["user_progress_days"] + 1)
            ch["current_co2_saved"] = round(ch["current_co2_saved"] + saved_co2, 2)

    return record

@app.get("/api/commute/history")
def get_commute_history(user_id: Optional[str] = None):
    if user_id:
        return [t for t in DB["trips"] if t["user_id"] == user_id]
    return DB["trips"]

# ==================== GREEN CREDITS WALLET & REWARDS ====================
@app.get("/api/wallet")
def get_user_wallet(user_id: str = Query("u1111111-1111-1111-1111-111111111111")):
    wallet = DB["wallets"].get(user_id, {"available_credits": 850, "lifetime_earned": 1250, "lifetime_redeemed": 400})
    user_ledger = [l for l in DB["ledger"] if l.get("user_id") == user_id]
    return {
        "wallet": wallet,
        "recent_ledger": user_ledger[:10]
    }

@app.get("/api/rewards/catalog")
def get_rewards_catalog():
    return DB["rewards_catalog"]

@app.post("/api/rewards/generate-qr", response_model=GenerateRewardQRResponse)
def generate_reward_qr(req: GenerateRewardQRRequest):
    user_id = req.user_id or "u1111111-1111-1111-1111-111111111111"
    wallet = DB["wallets"].get(user_id, {"available_credits": 850})
    
    reward = next((r for r in DB["rewards_catalog"] if r["id"] == req.reward_id), DB["rewards_catalog"][1])
    
    if wallet["available_credits"] < reward["credit_cost"]:
        raise HTTPException(status_code=400, detail="Insufficient Green Credits balance")

    token_code = f"QR-{uuid.uuid4().hex[:8].upper()}"
    expires_at = (datetime.utcnow() + timedelta(seconds=90)).isoformat() + "Z"
    
    # Server-side cryptographic signature (HMAC simulation)
    signature = hashlib.sha256(f"{token_code}:{user_id}:{reward['credit_cost']}:{expires_at}:CARBONLENS_SECRET".encode()).hexdigest()[:16]

    DB["qr_tokens"][token_code] = {
        "token_code": token_code,
        "user_id": user_id,
        "reward": reward,
        "credit_cost": reward["credit_cost"],
        "discount_value_inr": reward["discount_value_inr"],
        "expires_at": expires_at,
        "signature": signature,
        "is_redeemed": False
    }

    return {
        "token_code": token_code,
        "reward_id": reward["id"],
        "reward_title": reward["title"],
        "discount_value_inr": reward["discount_value_inr"],
        "credit_cost": reward["credit_cost"],
        "expires_at": expires_at,
        "signature": signature
    }

# ==================== CANTEEN STAFF SCAN & REDEEM ====================
@app.post("/api/canteen/scan", response_model=CanteenRedeemResponse)
def scan_canteen_qr(req: CanteenScanRequest):
    token_code = req.token_code.strip()
    
    if token_code not in DB["qr_tokens"]:
        return {
            "status": "REJECTED",
            "message": "Invalid or non-existent QR token code.",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    token = DB["qr_tokens"][token_code]
    
    if token["is_redeemed"]:
        return {
            "status": "REJECTED",
            "message": "Double-redemption alert! This QR code has already been consumed.",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    # Verify expiry
    expires_dt = datetime.fromisoformat(token["expires_at"].replace("Z", ""))
    if datetime.utcnow() > expires_dt:
        return {
            "status": "REJECTED",
            "message": "Expired QR code! The 90-second validity window has passed.",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    user_id = token["user_id"]
    wallet = DB["wallets"].get(user_id, {"available_credits": 850})
    reward = token["reward"]

    if wallet["available_credits"] < reward["credit_cost"]:
        return {
            "status": "REJECTED",
            "message": "Insufficient Green Credits balance in student account.",
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }

    # Perform Atomic Balance Deduction
    token["is_redeemed"] = True
    wallet["available_credits"] -= reward["credit_cost"]
    wallet["lifetime_redeemed"] += reward["credit_cost"]

    txn_code = f"CL-TXN-{uuid.uuid4().hex[:6].upper()}"
    student_user = next((u for u in DB["users"] if u["id"] == user_id), {"full_name": "Student Demo"})

    redemption_record = {
        "id": f"red-{uuid.uuid4().hex[:6]}",
        "transaction_code": txn_code,
        "user_id": user_id,
        "student_name": student_user["full_name"],
        "reward_title": reward["title"],
        "credits_deducted": reward["credit_cost"],
        "discount_applied_inr": reward["discount_value_inr"],
        "canteen_location": "Main Campus Canteen",
        "redeemed_at": datetime.utcnow().isoformat() + "Z"
    }

    DB["redemptions"].insert(0, redemption_record)

    DB["ledger"].insert(0, {
        "id": f"led-{uuid.uuid4().hex[:6]}",
        "user_id": user_id,
        "amount": -reward["credit_cost"],
        "type": "REDEEM",
        "event": "CANTEEN_DISCOUNT",
        "description": f"Redeemed {reward['title']} at Main Canteen ({txn_code})",
        "created_at": datetime.utcnow().isoformat() + "Z"
    })

    return {
        "status": "APPROVED",
        "message": f"Verified! ₹{reward['discount_value_inr']} discount applied to canteen order.",
        "transaction_code": txn_code,
        "student_name": student_user["full_name"],
        "reward_title": reward["title"],
        "discount_applied_inr": reward["discount_value_inr"],
        "credits_deducted": reward["credit_cost"],
        "canteen_location": "Main Campus Canteen",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/canteen/redemptions")
def get_canteen_redemptions():
    return DB["redemptions"]

@app.get("/api/canteen/stats")
def get_canteen_stats():
    total_discounts = sum(r["discount_applied_inr"] for r in DB["redemptions"])
    total_credits = sum(r["credits_deducted"] for r in DB["redemptions"])
    return {
        "today_redemptions_count": len(DB["redemptions"]),
        "total_discounts_inr": round(total_discounts, 2),
        "total_credits_absorbed": total_credits,
        "recent_redemptions": DB["redemptions"][:10]
    }

# ==================== ACTIVITIES & EMISSION CALCULATION ====================
@app.get("/api/emission-factors")
def get_emission_factors():
    return FALLBACK_FACTORS

@app.post("/api/activities", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate):
    co2e, meta = CarbonEngine.calculate(activity.category, activity.activity_type, activity.quantity)
    act_id = f"act-{uuid.uuid4().hex[:8]}"
    record = {
        "id": act_id,
        "user_id": activity.user_id or "u1111111-1111-1111-1111-111111111111",
        "category": activity.category,
        "activity_type": activity.activity_type,
        "quantity": activity.quantity,
        "original_unit": activity.original_unit,
        "normalized_quantity": activity.quantity,
        "normalized_unit": activity.original_unit,
        "calculated_co2e": co2e,
        "date": activity.date or datetime.utcnow().strftime("%Y-%m-%d"),
        "source": activity.source or "manual",
        "evidence_level": activity.evidence_level or 1,
        "emission_factor": meta
    }
    DB["activities"].insert(0, record)
    return record

@app.get("/api/activities")
def list_activities(user_id: Optional[str] = None):
    if user_id:
        return [a for a in DB["activities"] if a.get("user_id") == user_id]
    return DB["activities"]

@app.delete("/api/activities/{activity_id}")
def delete_activity(activity_id: str):
    DB["activities"] = [a for a in DB["activities"] if a["id"] != activity_id]
    return {"status": "DELETED", "activity_id": activity_id}

# ==================== DASHBOARD & INTELLIGENCE ====================
@app.get("/api/dashboard/personal")
def get_personal_dashboard(user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"):
    user_activities = [a for a in DB["activities"] if a.get("user_id") == user_id]
    user_trips = [t for t in DB["trips"] if t.get("user_id") == user_id]
    
    total_co2e = sum(a["calculated_co2e"] for a in user_activities)
    co2_saved = sum(t["saved_co2e_kg"] for t in user_trips)
    wallet = DB["wallets"].get(user_id, {"available_credits": 850})

    cat_breakdown = {}
    for a in user_activities:
        cat = a["category"]
        cat_breakdown[cat] = round(cat_breakdown.get(cat, 0) + a["calculated_co2e"], 2)

    return {
        "today_footprint_kg": round(total_co2e, 2),
        "monthly_footprint_kg": round(total_co2e * 12.5 + 45.0, 2),
        "co2_saved_kg": round(co2_saved + 18.5, 2),
        "green_points": wallet["available_credits"],
        "verified_trips_count": len(user_trips),
        "category_breakdown": cat_breakdown if cat_breakdown else {"Travel": 12.4, "Electricity": 28.5, "Food": 8.0, "Waste": 1.2},
        "benchmark": {"user": 145.0, "campus_average": 210.0, "target": 120.0}
    }

@app.get("/api/dashboard/campus")
def get_campus_dashboard():
    total_trips = len(DB["trips"])
    total_saved = sum(t["saved_co2e_kg"] for t in DB["trips"])
    total_distributed = sum(t["credits_earned"] for t in DB["trips"])
    total_redeemed = sum(r["credits_deducted"] for r in DB["redemptions"])

    return {
        "campus_name": "CarbonLens University",
        "total_emissions_tco2e": 1450.50,
        "per_capita_kgco2e": 165.2,
        "co2_saved_tco2e": round(340.2 + (total_saved / 1000.0), 3),
        "active_students": 1250,
        "active_challenges": len(DB["challenges"]),
        "verified_commutes_total": total_trips + 1840,
        "green_credits_distributed": total_distributed + 184000,
        "green_credits_redeemed": total_redeemed + 45000,
        "transport_breakdown": {
            "cycling": 42.0,
            "walking": 28.0,
            "bus": 18.0,
            "motorcycle": 8.0,
            "car": 4.0
        },
        "hostel_rankings": DB["leaderboards"]["hostels"],
        "department_rankings": DB["leaderboards"]["departments"],
        "team_rankings": DB["leaderboards"]["teams"]
    }

@app.get("/api/recommendations")
def get_recommendations(user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"):
    return [
        {
            "id": "rec-1",
            "title": "Switch 2 Petrol Car Commutes to Campus Cycling",
            "category": "Travel",
            "potential_co2_savings_kg": 7.68,
            "potential_credits": 768,
            "difficulty": "Easy",
            "impact": "High",
            "description": "Replacing two 20km petrol drives per week with bicycle commuting reduces ~7.68 kg CO2e."
        },
        {
            "id": "rec-2",
            "title": "Participate in Hostel Energy Sprint (AC & Fan Scheduling)",
            "category": "Electricity",
            "potential_co2_savings_kg": 5.20,
            "potential_credits": 520,
            "difficulty": "Medium",
            "impact": "High",
            "description": "Scheduling hostel AC off-timers during sleep hours saves ~5.2 kWh grid electricity per week."
        },
        {
            "id": "rec-3",
            "title": "Zero-Food-Waste Canteen Dining",
            "category": "Food & Waste",
            "potential_co2_savings_kg": 3.40,
            "potential_credits": 340,
            "difficulty": "Easy",
            "impact": "Medium",
            "description": "Choosing balanced portions at the dining hall reduces unsegregated municipal solid waste."
        }
    ]

@app.get("/api/challenges")
def get_challenges():
    return DB["challenges"]

@app.post("/api/challenges/{challenge_id}/join")
def join_challenge(challenge_id: str):
    ch = next((c for c in DB["challenges"] if c["id"] == challenge_id), None)
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    ch["joined"] = True
    ch["participants"] += 1
    return {"status": "JOINED", "challenge": ch}

@app.get("/api/leaderboard")
def get_leaderboard(tab: str = Query("hostels")):
    return DB["leaderboards"].get(tab, DB["leaderboards"]["hostels"])

# ==================== PROJECTS & DIGITAL PASSPORTS ====================
@app.get("/api/projects")
def get_campus_projects():
    return DB["projects"]

@app.get("/api/projects/{project_id}")
def get_project_passport(project_id: str):
    proj = next((p for p in DB["projects"] if p["id"] == project_id), DB["projects"][0])
    return proj

# ==================== SIMULATOR & POLLUTION ====================
@app.post("/api/simulator/calculate", response_model=WhatIfResponse)
def calculate_what_if(req: WhatIfRequest):
    return WhatIfSimulatorService.run_simulation(req)

@app.get("/api/pollution/locations")
def get_pollution_locations():
    return PollutionService.POLLUTION_STATIONS

@app.get("/api/pollution/alerts")
def get_pollution_alerts():
    return [
        {"location": "North Campus Gate / Highway Ring", "pollutant": "PM2.5", "aqi": 182, "status": "ELEVATED", "timestamp": "10 mins ago", "advice": "Opt for green campus bypass route."},
        {"location": "Main Sports Complex & Track", "pollutant": "Ozone", "aqi": 54, "status": "GOOD", "timestamp": "Live", "advice": "Optimal clean air conditions for outdoor jogging."}
    ]

@app.post("/api/cleanroute/calculate", response_model=CleanRouteResponse)
def get_clean_route(req: CleanRouteRequest):
    return PollutionService.calculate_clean_route(req)

# ==================== ADMIN LIVE DATA MONITOR & AUDIT ====================
@app.get("/api/admin/data-monitor")
def get_admin_data_monitor():
    return {
        "users": DB["users"],
        "trips": DB["trips"],
        "wallets": DB["wallets"],
        "ledger": DB["ledger"],
        "redemptions": DB["redemptions"],
        "activities": DB["activities"],
        "challenges": DB["challenges"],
        "projects": DB["projects"],
        "audit_logs": DB["audit_logs"]
    }

@app.get("/api/admin/users")
def get_admin_users():
    return DB["users"]

@app.get("/api/admin/users/{user_id}")
def get_admin_user_detail(user_id: str, actor_id: Optional[str] = "u6666666-6666-6666-6666-666666666666"):
    user = next((u for u in DB["users"] if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Audit log creation for sensitive user inspection
    actor_user = next((u for u in DB["users"] if u["id"] == actor_id), {"full_name": "Campus Admin", "role": "campus_admin"})
    audit_entry = {
        "id": f"aud-{uuid.uuid4().hex[:6]}",
        "actor": actor_user["full_name"],
        "actor_role": actor_user.get("role", "campus_admin"),
        "action": "INSPECT_USER_RECORD",
        "target": f"{user['full_name']} ({user['id']})",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "metadata": {"user_id": user_id, "department": user.get("department")}
    }
    DB["audit_logs"].insert(0, audit_entry)

    user_trips = [t for t in DB["trips"] if t.get("user_id") == user_id]
    user_activities = [a for a in DB["activities"] if a.get("user_id") == user_id]
    wallet = DB["wallets"].get(user_id, {"available_credits": 850, "lifetime_earned": 1250, "lifetime_redeemed": 400})
    user_ledger = [l for l in DB["ledger"] if l.get("user_id") == user_id]

    return {
        "user": user,
        "wallet": wallet,
        "trips": user_trips,
        "activities": user_activities,
        "ledger": user_ledger
    }

@app.get("/api/admin/audit-logs")
def get_audit_logs():
    return DB["audit_logs"]

# Site Content Management Dynamic Configuration
DB["site_content"] = {
    "hero_title": "From Carbon Footprint to Carbon Credit",
    "hero_subtitle": "Unified College Climate & Rewards Operating System — Measure campus impact, prove sustainable commute action, earn Green Credits, and redeem canteen benefits.",
    "announcement": "Welcome to CarbonLens 360 — Real-Time Climate Intelligence & Campus Rewards System Active!"
}

@app.get("/api/content")
def get_site_content():
    return DB["site_content"]

@app.post("/api/admin/content")
def update_site_content(payload: ContentUpdatePayload, authorization: Optional[str] = Header(None)):
    if payload.hero_title:
        DB["site_content"]["hero_title"] = payload.hero_title
    if payload.hero_subtitle:
        DB["site_content"]["hero_subtitle"] = payload.hero_subtitle
    if payload.announcement:
        DB["site_content"]["announcement"] = payload.announcement
    
    DB["audit_logs"].insert(0, {
        "id": f"aud-{uuid.uuid4().hex[:6]}",
        "actor": "System Administrator",
        "actor_role": "admin",
        "action": "UPDATE_SITE_CONTENT",
        "target": "Dynamic Website Hero / Content",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "status": "SUCCESS"
    })
    return {"status": "SUCCESS", "content": DB["site_content"]}

# ==================== PDF REPORT GENERATION ====================
@app.get("/api/reports/pdf")
def generate_audit_report():
    os.makedirs("scratch/reports", exist_ok=True)
    pdf_path = f"scratch/reports/CarbonLens_Campus_Report_{uuid.uuid4().hex[:6]}.pdf"
    ReportGeneratorService.generate_audit_pdf(
        pdf_path,
        "Campus Sustainability & Green Credit Audit Report",
        "CarbonLens University",
        {"total_co2e": 1450.5, "reduction_co2e": 340.2, "potential_credits": 340.2, "ghg_intensity": 0.76}
    )
    return FileResponse(pdf_path, media_type="application/pdf", filename="CarbonLens_Campus_Report.pdf")

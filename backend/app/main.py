import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Optional, List, Dict, Any

from app.core.config import settings
from app.models.schemas import (
    ActivityCreate, ActivityResponse, WhatIfRequest, WhatIfResponse,
    IndustrialTelemetryRequest, IndustrialTelemetryResponse, OCRProcessResponse,
    CleanRouteRequest, CleanRouteResponse, AuditReportResponse
)
from app.services.carbon_engine import CarbonEngine, FALLBACK_FACTORS
from app.services.ocr_service import OCRService
from app.services.industrial_node import IndustrialNodeService
from app.services.whatif_simulator import WhatIfSimulatorService
from app.services.optimizer_ai import AIOptimizerService
from app.services.pollution_service import PollutionService
from app.services.report_generator import ReportGeneratorService

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory realistic database for active session
DB = {
    "activities": [
        {
            "id": "act-1",
            "category": "Travel",
            "activity_type": "Car (Petrol)",
            "quantity": 25.0,
            "original_unit": "km",
            "normalized_quantity": 25.0,
            "normalized_unit": "km",
            "calculated_co2e": 4.80,
            "date": "2026-09-25",
            "source": "manual",
            "evidence_level": 1
        },
        {
            "id": "act-2",
            "category": "Electricity",
            "activity_type": "Grid Electricity (India Average)",
            "quantity": 12.5,
            "original_unit": "kWh",
            "normalized_quantity": 12.5,
            "normalized_unit": "kWh",
            "calculated_co2e": 8.95,
            "date": "2026-09-24",
            "source": "ocr",
            "evidence_level": 2
        },
        {
            "id": "act-3",
            "category": "Food",
            "activity_type": "Vegetarian Meal",
            "quantity": 3.0,
            "original_unit": "meal",
            "normalized_quantity": 3.0,
            "normalized_unit": "meal",
            "calculated_co2e": 3.45,
            "date": "2026-09-25",
            "source": "manual",
            "evidence_level": 1
        }
    ],
    "challenges": [
        {
            "id": "ch-1",
            "title": "No-Car Campus Week",
            "category": "Travel",
            "target_co2_saved": 18.5,
            "current_co2_saved": 6.8,
            "green_points": 250,
            "status": "active"
        },
        {
            "id": "ch-2",
            "title": "Zero Food Waste Challenge",
            "category": "Food & Waste",
            "target_co2_saved": 12.0,
            "current_co2_saved": 9.2,
            "green_points": 200,
            "status": "active"
        }
    ]
}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "timestamp": "2026-09-26T12:00:00Z"
    }

@app.get("/api/emission-factors")
def get_emission_factors():
    return FALLBACK_FACTORS

@app.post("/api/activities", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate):
    co2e, meta = CarbonEngine.calculate(activity.category, activity.activity_type, activity.quantity)
    act_id = f"act-{uuid.uuid4().hex[:8]}"
    
    record = {
        "id": act_id,
        "category": activity.category,
        "activity_type": activity.activity_type,
        "quantity": activity.quantity,
        "original_unit": activity.original_unit,
        "normalized_quantity": activity.quantity,
        "normalized_unit": activity.original_unit,
        "calculated_co2e": co2e,
        "date": activity.date or "2026-09-26",
        "source": activity.source or "manual",
        "evidence_level": activity.evidence_level or 1,
        "emission_factor": meta
    }
    DB["activities"].append(record)
    return record

@app.get("/api/activities")
def list_activities():
    return DB["activities"]

@app.get("/api/dashboard/personal")
def get_personal_dashboard():
    total_co2e = sum(a["calculated_co2e"] for a in DB["activities"])
    by_category = {}
    for a in DB["activities"]:
        cat = a["category"]
        by_category[cat] = round(by_category.get(cat, 0.0) + a["calculated_co2e"], 2)

    return {
        "today_footprint_kg": round(total_co2e, 2),
        "monthly_footprint_kg": round(total_co2e * 14.5, 2),
        "co2_saved_kg": 42.8,
        "green_points": 850,
        "category_breakdown": by_category,
        "monthly_trend": [
            {"month": "May", "co2e": 240.0},
            {"month": "Jun", "co2e": 210.5},
            {"month": "Jul", "co2e": 195.0},
            {"month": "Aug", "co2e": 180.2},
            {"month": "Sep", "co2e": round(total_co2e * 8.0, 1)}
        ],
        "benchmark": {
            "user": round(total_co2e * 8.0, 1),
            "campus_average": 210.0,
            "target": 140.0
        }
    }

@app.get("/api/dashboard/campus")
def get_campus_dashboard():
    return {
        "campus_name": "CarbonLens University — DEMO",
        "total_emissions_tco2e": 1450.50,
        "per_capita_kgco2e": 165.2,
        "co2_saved_tco2e": 340.2,
        "active_students": 1250,
        "active_challenges": 12,
        "hostel_rankings": [
            {"hostel": "Green Hostel", "co2_reduction": 42.5, "rank": 1},
            {"hostel": "River Hostel", "co2_reduction": 36.8, "rank": 2},
            {"hostel": "Eco Residency", "co2_reduction": 29.1, "rank": 3}
        ],
        "department_rankings": [
            {"dept": "CSE", "co2_reduction": 95.4, "rank": 1},
            {"dept": "AIML", "co2_reduction": 82.1, "rank": 2},
            {"dept": "ECE", "co2_reduction": 71.0, "rank": 3},
            {"dept": "MECH", "co2_reduction": 64.2, "rank": 4}
        ]
    }

@app.get("/api/recommendations")
def get_recommendations():
    return [
        {
            "id": "rec-1",
            "category": "Travel",
            "title": "Switch Petrol Car Commute to EV Campus Shuttle",
            "description": "Replacing 25 km car commute with campus electric shuttle 3 days/week.",
            "reasoning": "Your travel activity shows 25 km car usage, which generates 4.80 kgCO2e per trip.",
            "baseline_co2e": 57.6,
            "estimated_co2_saved": 43.2,
            "estimated_money_saved": 1450.0,
            "difficulty": "Easy",
            "frequency": "Weekly"
        },
        {
            "id": "rec-2",
            "category": "Electricity",
            "title": "Enable Laptop Power Saver & AC Setpoint at 24°C",
            "description": "Increasing hostel AC setpoint from 20°C to 24°C saves 24% electricity.",
            "reasoning": "High grid electricity baseline in hostel logs.",
            "baseline_co2e": 38.5,
            "estimated_co2_saved": 18.4,
            "estimated_money_saved": 650.0,
            "difficulty": "Easy",
            "frequency": "Daily"
        }
    ]

@app.get("/api/challenges")
def get_challenges():
    return DB["challenges"]

@app.get("/api/leaderboard")
def get_leaderboard(type: str = Query("hostels")):
    if type == "departments":
        return [
            {"rank": 1, "name": "Computer Science & Eng (CSE)", "co2_reduction_tco2e": 95.4, "participants": 420},
            {"rank": 2, "name": "Artificial Intelligence & ML", "co2_reduction_tco2e": 82.1, "participants": 310},
            {"rank": 3, "name": "Electronics & Comm (ECE)", "co2_reduction_tco2e": 71.0, "participants": 280}
        ]
    elif type == "teams":
        return [
            {"rank": 1, "name": "Team Terra", "co2_reduction_tco2e": 48.2, "participants": 45},
            {"rank": 2, "name": "Team Green", "co2_reduction_tco2e": 39.5, "participants": 38},
            {"rank": 3, "name": "Team EcoTech", "co2_reduction_tco2e": 31.8, "participants": 29}
        ]
    # Default hostels
    return [
        {"rank": 1, "name": "Green Hostel", "co2_reduction_tco2e": 42.5, "participants": 350},
        {"rank": 2, "name": "River Hostel", "co2_reduction_tco2e": 36.8, "participants": 400},
        {"rank": 3, "name": "Eco Residency", "co2_reduction_tco2e": 29.1, "participants": 250}
    ]

@app.post("/api/ocr/process", response_model=OCRProcessResponse)
async def process_ocr(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        text_content = contents.decode('utf-8', errors='ignore')
    except Exception:
        text_content = ""
    return OCRService.process_bill_document(file.filename, text_content)

@app.post("/api/simulator/calculate", response_model=WhatIfResponse)
def calculate_what_if(req: WhatIfRequest):
    return WhatIfSimulatorService.run_simulation(req)

@app.post("/api/industrial-node/telemetry", response_model=IndustrialTelemetryResponse)
def process_industrial_telemetry(data: IndustrialTelemetryRequest):
    return IndustrialNodeService.process_telemetry(data)

@app.get("/api/industrial-node/stream")
def get_industrial_stream():
    return IndustrialNodeService.generate_simulated_stream()

@app.post("/api/industry/optimize")
def optimize_industry_projects(goal: str = Query("max_co2")):
    return AIOptimizerService.rank_projects(goal)

@app.get("/api/pollution/locations")
def get_pollution_locations():
    return PollutionService.POLLUTION_STATIONS

@app.post("/api/cleanroute/calculate", response_model=CleanRouteResponse)
def get_clean_route(req: CleanRouteRequest):
    return PollutionService.calculate_clean_route(req)

@app.get("/api/reports/pdf")
def generate_audit_report():
    os.makedirs("scratch/reports", exist_ok=True)
    pdf_path = f"scratch/reports/CarbonLens_Audit_Report_{uuid.uuid4().hex[:6]}.pdf"
    ReportGeneratorService.generate_audit_pdf(
        pdf_path,
        "Audit-Ready Carbon & Compliance Report",
        "CarbonLens University & EcoTech Manufacturing — DEMO",
        {"total_co2e": 1450.5, "reduction_co2e": 340.2, "potential_credits": 340.2, "ghg_intensity": 0.76}
    )
    return FileResponse(pdf_path, media_type="application/pdf", filename="CarbonLens_Audit_Report.pdf")

@app.get("/api/carbon/traceability")
def get_traceability(activity_id: str = Query("act-1")):
    act = next((a for a in DB["activities"] if a["id"] == activity_id), DB["activities"][0])
    co2e, meta = CarbonEngine.calculate(act["category"], act["activity_type"], act["quantity"])
    conf = CarbonEngine.calculate_evidence_confidence(act["source"], act["evidence_level"])
    return {
        "activity_id": act["id"],
        "input_quantity": act["quantity"],
        "input_unit": act["original_unit"],
        "normalized_quantity": act["normalized_quantity"],
        "normalized_unit": act["normalized_unit"],
        "emission_factor_value": meta["factor_value"],
        "emission_factor_unit": f"kgCO2e/{meta['input_unit']}",
        "source_name": meta["source_name"],
        "source_url": meta["source_url"],
        "formula": meta["formula"],
        "calculated_co2e": co2e,
        "confidence_score": conf,
        "evidence_level": act["evidence_level"]
    }

@app.get("/api/industry/passport")
def get_carbon_passport():
    return {
        "passport_code": "PASSPORT-CL360-2026-SOLAR01",
        "project_name": "CSE Building 250kW Rooftop Solar Expansion",
        "organization": "CarbonLens University — DEMO",
        "baseline_period": "2025-Q1 to 2026-Q1",
        "baseline_emissions_tco2e": 280.0,
        "current_emissions_tco2e": 110.0,
        "measured_reduction_tco2e": 170.0,
        "potential_credit_equivalent_tco2e": 170.0,
        "credit_readiness_status": "Potentially Suitable",
        "evidence_confidence_score": 94,
        "disclaimer": "CarbonLens estimates potential. External verification by accredited carbon registry required.",
        "timeline": [
            {"date": "2025-01-15", "event": "Project Proposed & Baseline Established"},
            {"date": "2025-06-10", "event": "Rooftop Solar Installation Completed"},
            {"date": "2026-03-01", "event": "Evidence Submitted & Telemetry Logged"},
            {"date": "2026-09-26", "event": "Digital Passport Verified (Evidence Confidence: 94/100)"}
        ]
    }

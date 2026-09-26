from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class UserBase(BaseModel):
    email: str
    role: str = "student"

class UserCreate(UserBase):
    password: str
    full_name: str
    campus_id: Optional[str] = None
    hostel_id: Optional[str] = None
    department_id: Optional[str] = None
    team_id: Optional[str] = None

class ActivityCreate(BaseModel):
    user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"
    category: str # Travel, Electricity, Food, Waste, Fuel
    activity_type: str # e.g. Car (Petrol), Grid Electricity, Vegetarian Meal, MSW
    quantity: float
    original_unit: str
    date: Optional[str] = None
    source: Optional[str] = "manual" # manual, ocr, meter, api
    evidence_level: Optional[int] = 1

class ActivityResponse(BaseModel):
    id: str
    category: str
    activity_type: str
    quantity: float
    original_unit: str
    normalized_quantity: float
    normalized_unit: str
    calculated_co2e: float
    date: str
    source: str
    evidence_level: int
    emission_factor: Optional[Dict[str, Any]] = None

class TraceabilityInfo(BaseModel):
    input_quantity: float
    input_unit: str
    normalized_quantity: float
    normalized_unit: str
    emission_factor_value: float
    emission_factor_unit: str
    source_name: str
    source_url: Optional[str] = None
    source_date: Optional[str] = None
    formula: str
    calculated_co2e: float
    confidence_score: int
    evidence_level: int

class WhatIfRequest(BaseModel):
    scenario_type: str # Solar, EV, AC Efficiency, Waste, Efficient Motors, Waste Heat
    implementation_pct: float # 0 to 100
    current_co2e: float = 1200.0
    current_cost_inr: float = 450000.0

class WhatIfResponse(BaseModel):
    scenario_name: str
    baseline_co2e: float
    projected_co2e: float
    co2_saved_tco2e: float
    percentage_reduction: float
    estimated_investment_inr: float
    annual_savings_inr: float
    payback_years: float
    roi_percentage: float

class IndustrialTelemetryRequest(BaseModel):
    node_code: str = "IND-NODE-01"
    kwh_consumed: float
    fuel_liter_consumed: float
    production_units: float
    runtime_hours: float

class IndustrialTelemetryResponse(BaseModel):
    node_code: str
    calculated_co2e: float
    ghg_intensity: float # tCO2e / unit
    target_intensity: float
    gap_value: float
    compliance_status: str # On Target, Near Target, Exceeded
    timestamp: str

class OCRProcessResponse(BaseModel):
    file_name: str
    extracted_text: str
    extracted_kwh: Optional[float] = None
    extracted_fuel_liters: Optional[float] = None
    extracted_amount_inr: Optional[float] = None
    extracted_date: Optional[str] = None
    confidence: float
    suggested_activity: Dict[str, Any]

class CleanRouteRequest(BaseModel):
    origin: str
    destination: str

class CleanRouteResponse(BaseModel):
    origin: str
    destination: str
    fastest_time_mins: int
    fastest_distance_km: float
    fastest_exposure_index: float
    clean_time_mins: int
    clean_distance_km: float
    clean_exposure_index: float
    exposure_reduction_pct: float
    route_geometry: List[List[float]] # lat/lng points

class AuditReportResponse(BaseModel):
    report_id: str
    title: str
    generated_at: str
    scope: str
    download_url: str

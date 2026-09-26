from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class SignupRequest(BaseModel):
    full_name: str
    phone: str
    password: str
    confirm_password: str
    email: Optional[str] = None

class LoginRequest(BaseModel):
    username_or_phone: str # accepts email or phone
    password: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class AdminPasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class ContentUpdatePayload(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    announcement: Optional[str] = None

class UserBase(BaseModel):
    email: str
    role: str = "student" # student, teacher, staff, team_lead, campus_admin, sustainability_admin, canteen_staff

class UserResponse(UserBase):
    id: str
    full_name: str
    phone: Optional[str] = None
    campus: Optional[str] = "CarbonLens University"
    department: Optional[str] = "Computer Science & Engineering"
    hostel: Optional[str] = "Green Hostel"
    team: Optional[str] = "Team EcoTech"
    created_at: Optional[str] = None

class CommuteStartRequest(BaseModel):
    user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"
    travel_mode: str # walking, cycling, bus, train, motorcycle, car
    start_lat: float = 12.9716
    start_lng: float = 77.5946

class CommuteTrackRequest(BaseModel):
    trip_id: str
    latitude: float
    longitude: float
    speed_kmh: Optional[float] = 0.0
    accuracy_m: Optional[float] = 5.0

class CommuteEndRequest(BaseModel):
    trip_id: str
    end_lat: float = 12.9750
    end_lng: float = 77.6050
    photo_base64: Optional[str] = None # Live Camera proof
    arrival_qr_token: Optional[str] = None

class CommuteTripResponse(BaseModel):
    id: str
    user_id: str
    travel_mode: str
    distance_km: float
    duration_minutes: float
    calculated_co2e_kg: float
    saved_co2e_kg: float
    credits_earned: int
    verification_status: str # VERIFIED, REVIEW_REQUIRED, REJECTED, UNVERIFIED
    campus_geofence_verified: bool
    evidence_confidence_score: int
    created_at: str

class GenerateRewardQRRequest(BaseModel):
    user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"
    reward_id: str

class GenerateRewardQRResponse(BaseModel):
    token_code: str
    reward_id: str
    reward_title: str
    discount_value_inr: float
    credit_cost: int
    expires_at: str
    signature: str

class CanteenScanRequest(BaseModel):
    token_code: str
    canteen_staff_id: Optional[str] = "u5555555-5555-5555-5555-555555555555"

class CanteenRedeemResponse(BaseModel):
    status: str # APPROVED, REJECTED
    message: str
    transaction_code: Optional[str] = None
    student_name: Optional[str] = None
    reward_title: Optional[str] = None
    discount_applied_inr: Optional[float] = None
    credits_deducted: Optional[int] = None
    canteen_location: Optional[str] = "Main Campus Canteen"
    timestamp: str

class ActivityCreate(BaseModel):
    user_id: Optional[str] = "u1111111-1111-1111-1111-111111111111"
    category: str # Travel, Electricity, Food, Waste, Fuel
    activity_type: str # e.g. Car (Petrol), Grid Electricity, Vegetarian Meal
    quantity: float
    original_unit: str
    date: Optional[str] = None
    source: Optional[str] = "manual"
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

class WhatIfRequest(BaseModel):
    scenario_type: str # Solar, EV, AC Efficiency, Waste, LED Lighting
    implementation_pct: float
    current_co2e: float = 1450.0
    current_cost_inr: float = 450000.0
    investment_inr: Optional[float] = 1200000.0

class WhatIfResponse(BaseModel):
    scenario_type: str
    implementation_pct: float
    baseline_co2e: float
    projected_co2e: float
    co2e_reduction: float
    annual_cost_savings_inr: float
    total_investment_inr: float
    payback_years: float
    roi_percentage: float

class OCRProcessResponse(BaseModel):
    file_name: str
    extracted_text: str
    predicted_category: str
    predicted_quantity: float
    predicted_unit: str
    confidence: float

class CleanRouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float

class CleanRouteResponse(BaseModel):
    standard_duration_min: float
    standard_distance_km: float
    standard_exposure_index: float
    clean_duration_min: float
    clean_distance_km: float
    clean_exposure_index: float
    exposure_reduction_pct: float
    recommendation: str

class CampusProject(BaseModel):
    id: str
    name: str
    category: str
    owner: str
    baseline_emissions_tco2e: float
    current_emissions_tco2e: float
    target_reduction_tco2e: float
    measured_reduction_tco2e: float
    potential_credits_tco2e: float
    evidence_confidence_score: int
    readiness_status: str # Potentially Suitable, Needs More Evidence, Under Review
    timeline: List[Dict[str, str]]
    disclaimer: str

class AuditLogItem(BaseModel):
    id: str
    actor: str
    actor_role: str
    action: str
    target: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

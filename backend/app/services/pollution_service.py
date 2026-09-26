import math
from typing import Dict, Any, List
from app.models.schemas import CleanRouteRequest, CleanRouteResponse

class PollutionService:
    POLLUTION_STATIONS = [
        {
            "id": "pl-1",
            "name": "Academic Block A Gate",
            "lat": 12.9716,
            "lng": 77.5946,
            "aqi": 82,
            "pm25": 28.5,
            "pm10": 55.0,
            "no2": 22.1,
            "so2": 8.4,
            "co": 0.6,
            "ozone": 18.2,
            "status": "Moderate",
            "is_hotspot": False
        },
        {
            "id": "pl-2",
            "name": "Hostel Zone Quad",
            "lat": 12.9735,
            "lng": 77.5960,
            "aqi": 45,
            "pm25": 12.0,
            "pm10": 26.5,
            "no2": 14.2,
            "so2": 4.1,
            "co": 0.3,
            "ozone": 12.0,
            "status": "Good",
            "is_hotspot": False
        },
        {
            "id": "pl-3",
            "name": "Industrial Node Perimeter",
            "lat": 12.9780,
            "lng": 77.5900,
            "aqi": 148,
            "pm25": 62.4,
            "pm10": 112.0,
            "no2": 48.5,
            "so2": 19.8,
            "co": 1.4,
            "ozone": 32.5,
            "status": "Unhealthy for Sensitive Groups",
            "is_hotspot": True
        }
    ]

    @staticmethod
    def calculate_clean_route(req: CleanRouteRequest) -> CleanRouteResponse:
        # Simulated route geometry points (lat, lng)
        fastest_geometry = [
            [12.9716, 77.5946],
            [12.9745, 77.5930],
            [12.9780, 77.5900]
        ]
        clean_geometry = [
            [12.9716, 77.5946],
            [12.9735, 77.5960],
            [12.9760, 77.5950],
            [12.9780, 77.5900]
        ]

        return CleanRouteResponse(
            origin=req.origin,
            destination=req.destination,
            fastest_time_mins=18,
            fastest_distance_km=6.2,
            fastest_exposure_index=138.5, # Passes through industrial high AQI corridor
            clean_time_mins=22,
            clean_distance_km=7.1,
            clean_exposure_index=54.2, # Bypasses industrial zone through green campus perimeter
            exposure_reduction_pct=60.9,
            route_geometry=clean_geometry
        )

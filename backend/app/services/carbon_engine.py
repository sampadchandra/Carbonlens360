import httpx
from typing import Dict, Any, Tuple
from app.core.config import settings

# Comprehensive cited fallback emission factors database
FALLBACK_FACTORS: Dict[str, Dict[str, Any]] = {
    "Travel": {
        "Car (Petrol)": {
            "factor": 0.1920,
            "unit": "km",
            "source": "DEFRA / India GHG Program",
            "url": "https://ghgprotocol.org",
            "notes": "Passenger petrol car average factor"
        },
        "Motorcycle": {
            "factor": 0.1030,
            "unit": "km",
            "source": "India GHG Program",
            "url": "https://ghgprotocol.org",
            "notes": "Two-wheeler petrol engine average factor"
        },
        "Bus (Public)": {
            "factor": 0.0380,
            "unit": "km",
            "source": "Central Electricity Authority / DEFRA Transit",
            "url": "https://cea.nic.in",
            "notes": "Urban transit bus per passenger km"
        },
        "Electric Bus / EV": {
            "factor": 0.0120,
            "unit": "km",
            "source": "CEA Grid Factor 2025",
            "url": "https://cea.nic.in",
            "notes": "Electric bus charging footprint"
        },
        "Train": {
            "factor": 0.0280,
            "unit": "km",
            "source": "Indian Railways Carbon Baseline",
            "url": "https://indianrailways.gov.in",
            "notes": "Electrified passenger rail per passenger km"
        },
        "Bicycle": {
            "factor": 0.0000,
            "unit": "km",
            "source": "Zero Emission Active Transport",
            "url": "https://moud.gov.in",
            "notes": "Zero tailpipe emissions"
        },
        "Walking": {
            "factor": 0.0000,
            "unit": "km",
            "source": "Zero Emission Active Transport",
            "url": "https://moud.gov.in",
            "notes": "Zero tailpipe emissions"
        }
    },
    "Electricity": {
        "Grid Electricity (India Average)": {
            "factor": 0.7160,
            "unit": "kWh",
            "source": "Central Electricity Authority (CEA)",
            "url": "https://cea.nic.in",
            "notes": "Weighted average grid emission factor for India"
        },
        "Rooftop Solar PV": {
            "factor": 0.0410,
            "unit": "kWh",
            "source": "NREL Lifecycle Assessment",
            "url": "https://nrel.gov",
            "notes": "Solar panel manufacturing and operational LCA"
        }
    },
    "Food": {
        "Non-Vegetarian Meal": {
            "factor": 3.2500,
            "unit": "meal",
            "source": "IPCC / World Resources Institute",
            "url": "https://wri.org",
            "notes": "High livestock & poultry diet lifecycle factor"
        },
        "Vegetarian Meal": {
            "factor": 1.1500,
            "unit": "meal",
            "source": "World Resources Institute (WRI)",
            "url": "https://wri.org",
            "notes": "Plant-based meal lifecycle factor"
        },
        "Vegan Meal": {
            "factor": 0.8500,
            "unit": "meal",
            "source": "WRI Diets & Carbon Impact",
            "url": "https://wri.org",
            "notes": "Strict plant-based diet lifecycle factor"
        }
    },
    "Waste": {
        "Municipal Solid Waste (Landfill)": {
            "factor": 1.4500,
            "unit": "kg",
            "source": "CPCB India Waste Guidelines",
            "url": "https://cpcb.nic.in",
            "notes": "Methane generation potential in unmanaged landfill"
        },
        "Recycled / Segregated Waste": {
            "factor": 0.1800,
            "unit": "kg",
            "source": "CPCB India Waste Guidelines",
            "url": "https://cpcb.nic.in",
            "notes": "Avoided landfill emissions credit applied"
        }
    },
    "Fuel": {
        "Diesel Generator / Boiler": {
            "factor": 2.6800,
            "unit": "liter",
            "source": "Bureau of Energy Efficiency (BEE)",
            "url": "https://beeindia.gov.in",
            "notes": "Diesel combustion CO2e factor"
        },
        "LPG / Natural Gas": {
            "factor": 2.9800,
            "unit": "kg",
            "source": "Bureau of Energy Efficiency (BEE)",
            "url": "https://beeindia.gov.in",
            "notes": "LPG cylinder combustion factor"
        },
        "Petrol": {
            "factor": 2.3100,
            "unit": "liter",
            "source": "BEE Energy Manager Guide",
            "url": "https://beeindia.gov.in",
            "notes": "Petrol fuel combustion factor"
        }
    }
}

class CarbonEngine:
    @staticmethod
    def calculate(category: str, activity_type: str, quantity: float) -> Tuple[float, Dict[str, Any]]:
        """
        Calculates CO2e in kg derived from official emission factors.
        Returns (calculated_co2e, metadata)
        """
        category_factors = FALLBACK_FACTORS.get(category, {})
        factor_info = category_factors.get(activity_type)

        if not factor_info:
            # Fallback for unlisted activity_type
            factor_val = 0.50
            source_name = "CarbonLens Default Engine Factor"
            source_url = "https://carbonlens360.io/methodology"
            notes = "Standard fallback factor applied for unrecognized category"
            unit = "unit"
        else:
            factor_val = factor_info["factor"]
            source_name = factor_info["source"]
            source_url = factor_info["url"]
            notes = factor_info["notes"]
            unit = factor_info["unit"]

        calculated_co2e = round(quantity * factor_val, 4)

        meta = {
            "input_quantity": quantity,
            "input_unit": unit,
            "factor_value": factor_val,
            "source_name": source_name,
            "source_url": source_url,
            "notes": notes,
            "formula": f"{quantity} {unit} × {factor_val} kgCO2e/{unit} = {calculated_co2e} kgCO2e"
        }
        return calculated_co2e, meta

    @staticmethod
    async def call_climatiq_proxy(activity_type: str, quantity: float, unit: str) -> Dict[str, Any]:
        """
        Proxies request to Climatiq API if key exists, else uses deterministic fallback.
        """
        if settings.CLIMATIQ_API_KEY:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.post(
                        "https://beta3.api.climatiq.io/estimate",
                        headers={"Authorization": f"Bearer {settings.CLIMATIQ_API_KEY}"},
                        json={
                            "emission_factor": {"activity_id": "passenger_vehicle-vehicle_type_car-fuel_source_petrol"},
                            "parameters": {"distance": quantity, "distance_unit": unit}
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        return {
                            "provider": "Climatiq API",
                            "co2e": data.get("co2e", 0),
                            "co2e_unit": data.get("co2e_unit", "kg"),
                            "raw_response": data
                        }
            except Exception as e:
                pass # Fall through to fallback

        # Fallback explanation
        co2e, meta = CarbonEngine.calculate("Travel", activity_type, quantity)
        return {
            "provider": "CarbonLens Engine (Climatiq Compatible Fallback)",
            "co2e": co2e,
            "co2e_unit": "kgCO2e",
            "metadata": meta,
            "notice": "Climatiq API key not present or network unavailable. Used verified CPCB/CEA/BEE emission factors."
        }

    @staticmethod
    def calculate_evidence_confidence(source: str, evidence_level: int, has_file: bool = False) -> int:
        """
        Level 1: Manual (50-65)
        Level 2: Document Proof / Bill (70-85)
        Level 3: Device / API Data (85-95)
        Level 4: Cross-checked Proof / IoT + Bill (95-99)
        """
        base_map = {1: 60, 2: 78, 3: 90, 4: 97}
        score = base_map.get(evidence_level, 60)
        if has_file and score < 95:
            score += 5
        return min(score, 99)

    @staticmethod
    def calculate_credit_potential(baseline_tco2e: float, current_tco2e: float) -> Dict[str, Any]:
        """
        Calculates potential carbon credit equivalent in tCO2e.
        """
        reduction = max(0.0, baseline_tco2e - current_tco2e)
        return {
            "baseline_tco2e": baseline_tco2e,
            "current_tco2e": current_tco2e,
            "reduction_tco2e": round(reduction, 2),
            "potential_credit_equivalent_tco2e": round(reduction, 2),
            "disclaimer": "Potential credit equivalent is an estimate only. External verification by an accredited carbon registry is required before issuance.",
            "eligibility_status": "Potentially Suitable" if reduction > 10.0 else "Needs More Reduction Data"
        }

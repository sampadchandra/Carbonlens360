import random
from datetime import datetime
from typing import Dict, Any
from app.models.schemas import IndustrialTelemetryRequest, IndustrialTelemetryResponse

class IndustrialNodeService:
    @staticmethod
    def process_telemetry(data: IndustrialTelemetryRequest) -> IndustrialTelemetryResponse:
        # Emission calculations:
        # Electricity: kwh * 0.716 kgCO2e / 1000 = tCO2e
        # Fuel: liters * 2.68 kgCO2e / 1000 = tCO2e
        elec_co2e_t = (data.kwh_consumed * 0.716) / 1000.0
        fuel_co2e_t = (data.fuel_liter_consumed * 2.68) / 1000.0
        total_co2e_t = round(elec_co2e_t + fuel_co2e_t, 4)

        production = max(data.production_units, 1.0)
        ghg_intensity = round(total_co2e_t / production, 4) # tCO2e per production unit
        target_intensity = 0.7800
        gap_value = round(ghg_intensity - target_intensity, 4)

        if gap_value <= 0:
            status = "On Target"
        elif gap_value <= 0.15:
            status = "Near Target"
        else:
            status = "Exceeded"

        return IndustrialTelemetryResponse(
            node_code=data.node_code,
            calculated_co2e=total_co2e_t,
            ghg_intensity=ghg_intensity,
            target_intensity=target_intensity,
            gap_value=gap_value,
            compliance_status=status,
            timestamp=datetime.now().isoformat()
        )

    @staticmethod
    def generate_simulated_stream() -> Dict[str, Any]:
        """Generates realistic live industrial sensor telemetry."""
        kwh = round(random.uniform(420.0, 580.0), 2)
        fuel = round(random.uniform(35.0, 85.0), 2)
        production = round(random.uniform(450.0, 600.0), 1)
        runtime = round(random.uniform(7.5, 8.0), 2)
        
        telemetry = IndustrialTelemetryRequest(
            node_code="IND-NODE-PROTOTYPE-01",
            kwh_consumed=kwh,
            fuel_liter_consumed=fuel,
            production_units=production,
            runtime_hours=runtime
        )
        resp = IndustrialNodeService.process_telemetry(telemetry)
        return {
            "telemetry": telemetry.dict(),
            "result": resp.dict()
        }

from app.models.schemas import WhatIfRequest, WhatIfResponse

class WhatIfSimulatorService:
    SCENARIO_CONFIGS = {
        "Solar": {
            "name": "Rooftop Solar PV Expansion",
            "co2_reduction_factor": 0.65, # 65% grid replacement
            "cost_per_pct_inr": 85000.0,
            "savings_per_pct_inr": 22000.0
        },
        "EV": {
            "name": "Campus Fleet EV Conversion",
            "co2_reduction_factor": 0.45,
            "cost_per_pct_inr": 65000.0,
            "savings_per_pct_inr": 18000.0
        },
        "AC Efficiency": {
            "name": "HVAC Smart Thermal Optimization",
            "co2_reduction_factor": 0.30,
            "cost_per_pct_inr": 35000.0,
            "savings_per_pct_inr": 12000.0
        },
        "Waste Reduction": {
            "name": "Zero-Landfill Composting & Recycling",
            "co2_reduction_factor": 0.25,
            "cost_per_pct_inr": 20000.0,
            "savings_per_pct_inr": 7500.0
        },
        "Efficient Motors": {
            "name": "IE4 High-Efficiency Motor Retrofit",
            "co2_reduction_factor": 0.40,
            "cost_per_pct_inr": 55000.0,
            "savings_per_pct_inr": 16000.0
        },
        "Waste Heat": {
            "name": "Industrial Waste-Heat Recovery System",
            "co2_reduction_factor": 0.55,
            "cost_per_pct_inr": 95000.0,
            "savings_per_pct_inr": 28000.0
        }
    }

    @staticmethod
    def run_simulation(req: WhatIfRequest) -> WhatIfResponse:
        cfg = WhatIfSimulatorService.SCENARIO_CONFIGS.get(
            req.scenario_type,
            WhatIfSimulatorService.SCENARIO_CONFIGS["Solar"]
        )

        pct = max(0.0, min(100.0, req.implementation_pct))
        max_co2_saved = req.current_co2e * cfg["co2_reduction_factor"]
        co2_saved = round((pct / 100.0) * max_co2_saved, 2)
        projected_co2e = round(req.current_co2e - co2_saved, 2)
        pct_reduction = round((co2_saved / req.current_co2e) * 100.0, 1) if req.current_co2e > 0 else 0.0

        investment = round(pct * cfg["cost_per_pct_inr"], 2)
        annual_savings = round(pct * cfg["savings_per_pct_inr"], 2)
        
        payback = round(investment / annual_savings, 2) if annual_savings > 0 else 0.0
        roi_pct = round((annual_savings / investment) * 100.0, 1) if investment > 0 else 0.0

        return WhatIfResponse(
            scenario_name=cfg["name"],
            baseline_co2e=req.current_co2e,
            projected_co2e=projected_co2e,
            co2_saved_tco2e=co2_saved,
            percentage_reduction=pct_reduction,
            estimated_investment_inr=investment,
            annual_savings_inr=annual_savings,
            payback_years=payback,
            roi_percentage=roi_pct
        )

from typing import List, Dict, Any

class AIOptimizerService:
    PROPOSED_PROJECTS = [
        {
            "id": "opt-1",
            "title": "Industrial Waste-Heat Boiler Recovery",
            "category": "Energy Recovery",
            "co2_reduction_tco2e": 280.0,
            "cost_inr": 4500000.0,
            "annual_savings_inr": 1450000.0,
            "payback_years": 3.1,
            "roi_pct": 32.2,
            "feasibility": "High"
        },
        {
            "id": "opt-2",
            "title": "500kW Rooftop Solar Expansion",
            "category": "Renewable",
            "co2_reduction_tco2e": 420.0,
            "cost_inr": 16000000.0,
            "annual_savings_inr": 3800000.0,
            "payback_years": 4.2,
            "roi_pct": 23.8,
            "feasibility": "High"
        },
        {
            "id": "opt-3",
            "title": "IE4 Premium Efficiency Motors Retrofit",
            "category": "Equipment Upgrade",
            "co2_reduction_tco2e": 140.0,
            "cost_inr": 2200000.0,
            "annual_savings_inr": 850000.0,
            "payback_years": 2.6,
            "roi_pct": 38.6,
            "feasibility": "Very High"
        },
        {
            "id": "opt-4",
            "title": "Variable Frequency Drive (VFD) Pumps",
            "category": "Process Optimization",
            "co2_reduction_tco2e": 95.0,
            "cost_inr": 1200000.0,
            "annual_savings_inr": 580000.0,
            "payback_years": 2.1,
            "roi_pct": 48.3,
            "feasibility": "High"
        }
    ]

    @staticmethod
    def rank_projects(optimization_goal: str = "max_co2") -> List[Dict[str, Any]]:
        """
        Ranks project options based on user priority:
        - max_co2: highest CO2 reduction
        - lowest_cost: lowest capital investment
        - fastest_payback: shortest payback years
        """
        projects = list(AIOptimizerService.PROPOSED_PROJECTS)
        if optimization_goal == "lowest_cost":
            projects.sort(key=lambda x: x["cost_inr"])
        elif optimization_goal == "fastest_payback":
            projects.sort(key=lambda x: x["payback_years"])
        else: # max_co2
            projects.sort(key=lambda x: x["co2_reduction_tco2e"], reverse=True)
            
        return projects

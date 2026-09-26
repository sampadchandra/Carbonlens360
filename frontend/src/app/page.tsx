"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  TrendingDown, 
  ShieldCheck, 
  Award, 
  Building2, 
  Factory, 
  Leaf, 
  Zap, 
  Car, 
  Utensils, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  BarChart3,
  Globe
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"individual" | "campus" | "industrial" | "credit">("individual");
  const [travelKm, setTravelKm] = useState(15);
  const [travelMode, setTravelMode] = useState("car");
  const [electricityKwh, setElectricityKwh] = useState(120);
  const [dietType, setDietType] = useState("medium_meat");
  
  // Real-time API simulation stats
  const [aqi, setAqi] = useState(112);
  const [totalEmissions, setTotalEmissions] = useState(482.4);
  const [creditReadiness, setCreditReadiness] = useState(84);

  // Recalculate dynamic emissions demo
  useEffect(() => {
    let modeFactor = 0.17; // car
    if (travelMode === "bus") modeFactor = 0.089;
    if (travelMode === "ev") modeFactor = 0.045;
    if (travelMode === "train") modeFactor = 0.035;

    let dietFactor = 2.5;
    if (dietType === "high_meat") dietFactor = 3.3;
    if (dietType === "vegetarian") dietFactor = 1.7;
    if (dietType === "vegan") dietFactor = 1.4;

    const calculated = (travelKm * 30 * modeFactor) + (electricityKwh * 0.716) + (dietFactor * 30);
    setTotalEmissions(Math.round(calculated * 10) / 10);
  }, [travelKm, travelMode, electricityKwh, dietType]);

  return (
    <div className="space-y-12 pb-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 border-b border-slate-800/60 bg-gradient-to-b from-emerald-950/30 via-slate-950 to-slate-950">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Leaf className="w-4 h-4" />
            <span>CodeVoyage Hackathon • Problem SU-02</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
            From <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Carbon Footprint</span> to <span className="bg-gradient-to-r from-teal-300 to-emerald-500 bg-clip-text text-transparent">Carbon Credit</span>.
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed">
            A unified platform that turns carbon and pollution data into safer choices, measurable savings, verified action, and carbon-credit readiness for individuals and campuses.
          </p>

          {/* QUICK METRICS HIGHLIGHT */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Monthly Footprint</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">{totalEmissions} <span className="text-sm font-normal text-slate-400">kg CO₂e</span></div>
              <div className="text-[10px] text-emerald-400/80 mt-1">↓ 14% vs National Avg</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Live AQI (Bengaluru)</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">{aqi} <span className="text-sm font-normal text-slate-400">Moderate</span></div>
              <div className="text-[10px] text-slate-400 mt-1">PM2.5: 41 µg/m³ • PM10: 89</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Evidence Level</div>
              <div className="text-2xl font-bold text-teal-300 mt-1">Level 3 <span className="text-xs text-emerald-400 font-semibold">92% Conf.</span></div>
              <div className="text-[10px] text-slate-400 mt-1">Meter OCR + Sensor Verified</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-xs text-slate-400 font-medium">Credit Readiness</div>
              <div className="text-2xl font-bold text-cyan-400 mt-1">{creditReadiness}% <span className="text-sm font-normal text-slate-400">Ready</span></div>
              <div className="text-[10px] text-cyan-400/80 mt-1">0.48 Verra-Est. Credits</div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD TABS NAVIGATION */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="flex space-x-2 border-b border-slate-800 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab("individual")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "individual" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Activity className="w-4 h-4" />
            <span>Individual Tracker</span>
          </button>

          <button 
            onClick={() => setActiveTab("campus")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "campus" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </button>

          <button 
            onClick={() => setActiveTab("industrial")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "industrial" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Factory className="w-4 h-4" />
            <span>Industrial Sensor Node</span>
          </button>

          <button 
            onClick={() => setActiveTab("credit")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "credit" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Award className="w-4 h-4" />
            <span>Credit Readiness & Audit</span>
          </button>
        </div>

        {/* TAB 1: INDIVIDUAL TRACKER */}
        {activeTab === "individual" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CALCULATOR / LOGGING PANEL */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>Log Footprint Data</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live Sync</span>
              </div>

              {/* Travel */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium flex justify-between">
                  <span>Daily Commute (km)</span>
                  <span className="text-emerald-400 font-bold">{travelKm} km</span>
                </label>
                <input 
                  type="range" min="1" max="100" value={travelKm} 
                  onChange={(e) => setTravelKm(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <select 
                  value={travelMode} onChange={(e) => setTravelMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="car">Car (Petrol/Diesel - 0.170 kg/km)</option>
                  <option value="bus">Public Bus (0.089 kg/km)</option>
                  <option value="ev">Electric Vehicle (0.045 kg/km)</option>
                  <option value="train">Metro / Train (0.035 kg/km)</option>
                </select>
              </div>

              {/* Electricity */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium flex justify-between">
                  <span>Monthly Electricity (kWh)</span>
                  <span className="text-emerald-400 font-bold">{electricityKwh} kWh</span>
                </label>
                <input 
                  type="range" min="10" max="500" value={electricityKwh} 
                  onChange={(e) => setElectricityKwh(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Diet */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Diet Type</label>
                <select 
                  value={dietType} onChange={(e) => setDietType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="high_meat">High Meat Heavy (3.3 kg/day)</option>
                  <option value="medium_meat">Average Balanced (2.5 kg/day)</option>
                  <option value="vegetarian">Vegetarian (1.7 kg/day)</option>
                  <option value="vegan">Vegan / Plant-Based (1.4 kg/day)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Emission Factors Source:</span>
                <span className="text-xs font-semibold text-teal-300">CEA India 2025 / Climatiq Proxy</span>
              </div>
            </div>

            {/* BREAKDOWN & AI RECOMMENDATIONS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>Emissions Breakdown & Benchmark</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Travel Emissions</span>
                      <span>{Math.round(travelKm * 30 * (travelMode === "car" ? 0.17 : travelMode === "bus" ? 0.089 : 0.045))} kg CO₂e</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Electricity Emissions</span>
                      <span>{Math.round(electricityKwh * 0.716)} kg CO₂e</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Diet & Waste</span>
                      <span>{Math.round((dietType === "high_meat" ? 3.3 : dietType === "vegetarian" ? 1.7 : 2.5) * 30)} kg CO₂e</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONABLE RECOMMENDATIONS */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <span>Ranked Savings Recommendations</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Switch 3 Commute Days to Metro</div>
                        <div className="text-[11px] text-slate-400">Save up to 48 kg CO₂e / month</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
                      Save ₹1,200
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Install Smart Plug for AC / Geyser</div>
                        <div className="text-[11px] text-slate-400">Save up to 25 kWh (18 kg CO₂e)</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-teal-500/20 text-teal-300">
                      Save ₹450
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPUS LEADERBOARD */}
        {activeTab === "campus" && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">CarbonLens Campus Dashboard</h3>
                  <p className="text-xs text-slate-400">Aggregate emissions, hostel rankings, and sustainability challenges for CarbonLens University</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Campus Goal: -20% Target
                </span>
              </div>

              {/* LEADERBOARD TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Hostel / Dept</th>
                      <th className="p-3">Monthly Footprint</th>
                      <th className="p-3">Reduction vs Baseline</th>
                      <th className="p-3">Green Points</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-amber-400">#1 🏆</td>
                      <td className="p-3 font-semibold text-slate-100">Green Hostel</td>
                      <td className="p-3">34.2 tCO₂e</td>
                      <td className="p-3 text-emerald-400 font-bold">↓ 18.5%</td>
                      <td className="p-3 text-teal-300 font-semibold">1,450 pts</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">Leader</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-300">#2 🥈</td>
                      <td className="p-3 font-semibold text-slate-100">Dept of CSE</td>
                      <td className="p-3">41.8 tCO₂e</td>
                      <td className="p-3 text-emerald-400 font-bold">↓ 14.2%</td>
                      <td className="p-3 text-teal-300 font-semibold">1,210 pts</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">Active</span></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-amber-600">#3 🥉</td>
                      <td className="p-3 font-semibold text-slate-100">Eco Residency</td>
                      <td className="p-3">48.5 tCO₂e</td>
                      <td className="p-3 text-emerald-400 font-bold">↓ 9.8%</td>
                      <td className="p-3 text-teal-300 font-semibold">980 pts</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INDUSTRIAL SENSOR NODE */}
        {activeTab === "industrial" && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <Factory className="w-5 h-5 text-emerald-400" />
                    <span>Industrial Telemetry Simulator (Node #IND-409)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Chimney sensors monitoring continuous CO₂ ppm, SO2, NOx, and particulate matter</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Sensor Health: 99.8% Normal
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">Stack CO₂ Concentration</div>
                  <div className="text-3xl font-bold text-emerald-400 mt-2">412.8 <span className="text-sm font-normal text-slate-400">ppm</span></div>
                  <div className="text-[10px] text-emerald-400/80 mt-1">Within baseline limits</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">Exhaust Temperature</div>
                  <div className="text-3xl font-bold text-amber-400 mt-2">148.5 <span className="text-sm font-normal text-slate-400">°C</span></div>
                  <div className="text-[10px] text-amber-400/80 mt-1">Heat recovery active</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">AQI Chimney Ambient</div>
                  <div className="text-3xl font-bold text-teal-300 mt-2">88 <span className="text-sm font-normal text-slate-400">Satisfactory</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">Scrubber efficiency: 94%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CREDIT READINESS & AUDIT */}
        {activeTab === "credit" && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>Evidence Confidence & Carbon Credit Readiness</span>
                  </h3>
                  <p className="text-xs text-slate-400">Verification trail establishing baseline compliance for carbon registry submission</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Verra / Gold Standard Ready
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>"Why Should I Trust This?" Verification Trail</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-400">
                    <li className="flex justify-between">
                      <span>Utility Bill Meter OCR:</span>
                      <span className="text-emerald-400 font-semibold">Verified (Level 3)</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Climatiq Factor Traceability:</span>
                      <span className="text-emerald-400 font-semibold">CEA Grid 2025</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Tamper-proof Log Hash:</span>
                      <span className="text-teal-300 font-mono text-[10px]">0x9f8b...41a2</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>Credit Yield Estimation</span>
                  </div>
                  <div className="text-2xl font-bold text-cyan-300">
                    0.48 <span className="text-xs text-slate-400 font-normal">Est. Carbon Credits / Year</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Based on verified reduction of 480 kg CO₂e from individual/campus baseline using ISO 14064 guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

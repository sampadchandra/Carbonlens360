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
  Globe,
  Sliders,
  FileText,
  MapPin,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"individual" | "campus" | "industrial" | "credit" | "simulator" | "pollution">("individual");
  
  // Interactive Activity Form State
  const [travelKm, setTravelKm] = useState(18);
  const [travelMode, setTravelMode] = useState("car");
  const [electricityKwh, setElectricityKwh] = useState(140);
  const [dietType, setDietType] = useState("medium_meat");

  // Dynamic API calculation state
  const [calculatedCO2, setCalculatedCO2] = useState(0);
  const [activities, setActivities] = useState([
    { id: 1, category: "Travel", detail: "18 km via Car (Petrol)", co2: 3.06, date: "Today", level: 1 },
    { id: 2, category: "Electricity", detail: "140 kWh Utility Meter", co2: 100.24, date: "Yesterday", level: 3 },
    { id: 3, category: "Food", detail: "Balanced Diet", co2: 2.50, date: "2 days ago", level: 1 }
  ]);

  // Modal State for "Why Should I Trust This?"
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  // What-If Simulator State
  const [solarKw, setSolarKw] = useState(50);
  const [evBuses, setEvBuses] = useState(2);
  const [simCO2Saved, setSimCO2Saved] = useState(0);
  const [simMoneySaved, setSimMoneySaved] = useState(0);

  // Recalculate Live Emissions
  useEffect(() => {
    let modeFactor = 0.17; // car
    if (travelMode === "bus") modeFactor = 0.089;
    if (travelMode === "ev") modeFactor = 0.045;
    if (travelMode === "train") modeFactor = 0.035;

    let dietFactor = 2.5;
    if (dietType === "high_meat") dietFactor = 3.3;
    if (dietType === "vegetarian") dietFactor = 1.7;
    if (dietType === "vegan") dietFactor = 1.4;

    const travelEmissions = travelKm * 30 * modeFactor;
    const electricityEmissions = electricityKwh * 0.716;
    const dietEmissions = dietFactor * 30;

    const total = travelEmissions + electricityEmissions + dietEmissions;
    setCalculatedCO2(Math.round(total * 10) / 10);
  }, [travelKm, travelMode, electricityKwh, dietType]);

  // Recalculate Simulator ROI
  useEffect(() => {
    const solarCO2 = solarKw * 1.2 * 30; // ~1.2 kg CO2 per kW per day
    const evCO2 = evBuses * 45 * 30 * (0.17 - 0.045);
    const totalCO2 = Math.round(solarCO2 + evCO2);
    const money = Math.round((solarKw * 450) + (evBuses * 12000));
    setSimCO2Saved(totalCO2);
    setSimMoneySaved(money);
  }, [solarKw, evBuses]);

  const handleAddActivity = () => {
    let modeFactor = 0.17;
    if (travelMode === "bus") modeFactor = 0.089;
    if (travelMode === "ev") modeFactor = 0.045;

    const co2 = Math.round(travelKm * modeFactor * 100) / 100;
    const newAct = {
      id: Date.now(),
      category: "Travel",
      detail: `${travelKm} km via ${travelMode.toUpperCase()}`,
      co2: co2,
      date: "Just now",
      level: 2
    };

    setActivities([newAct, ...activities]);
  };

  return (
    <div className="space-y-12 pb-24">
      {/* 2050 HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Leaf className="w-4 h-4" />
            <span>Operational Sustainability & Climate Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100">
            From <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Carbon Footprint</span> to <span className="bg-gradient-to-r from-teal-300 to-emerald-500 bg-clip-text text-transparent">Carbon Credit</span>.
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed">
            Measure emissions. Understand impact. Reduce what matters. Prove the change. Turn sustainability data into measurable action.
          </p>

          <div className="flex justify-center space-x-4 pt-4">
            <button 
              onClick={() => setActiveTab("individual")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <span>Start Measuring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab("simulator")}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:border-slate-700 transition-all"
            >
              Explore What-If Simulator
            </button>
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
            <span>Personal Tracker</span>
          </button>

          <button 
            onClick={() => setActiveTab("campus")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "campus" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Building2 className="w-4 h-4" />
            <span>Campus Analytics</span>
          </button>

          <button 
            onClick={() => setActiveTab("industrial")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "industrial" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Factory className="w-4 h-4" />
            <span>Industrial Node</span>
          </button>

          <button 
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "simulator" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Sliders className="w-4 h-4" />
            <span>What-If Simulator</span>
          </button>

          <button 
            onClick={() => setActiveTab("credit")}
            className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === "credit" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400 hover:text-slate-200"}`}
          >
            <Award className="w-4 h-4" />
            <span>Credit Readiness</span>
          </button>
        </div>

        {/* TAB 1: INDIVIDUAL TRACKER */}
        {activeTab === "individual" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span>Log Footprint Data</span>
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live Sync</span>
              </div>

              {/* Travel input */}
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

              <button 
                onClick={handleAddActivity}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                + Log & Save Activity
              </button>
            </div>

            {/* DYNAMIC RESULTS & RECENT ACTIVITIES */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-100">Calculated Footprint</h3>
                  <div className="text-2xl font-extrabold text-emerald-400">
                    {calculatedCO2} <span className="text-xs font-normal text-slate-400">kg CO₂e / mo</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {activities.map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-200">{act.category} — {act.detail}</div>
                        <div className="text-[10px] text-slate-400">{act.date} • Evidence Level {act.level}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-bold text-emerald-400">{act.co2} kg CO₂e</span>
                        <button 
                          onClick={() => { setSelectedActivity(act); setShowTrustModal(true); }}
                          className="px-2 py-1 rounded bg-teal-500/10 text-teal-300 text-[10px] font-semibold border border-teal-500/30 hover:bg-teal-500/20"
                        >
                          Why Trust This?
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPUS ANALYTICS */}
        {activeTab === "campus" && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Campus Analytics & Hostel Leaderboard</h3>
                  <p className="text-xs text-slate-400">Aggregate emissions, hostel rankings, and baseline progress</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Rank</th>
                      <th className="p-3">Hostel / Department</th>
                      <th className="p-3">Monthly Footprint</th>
                      <th className="p-3">Reduction vs Baseline</th>
                      <th className="p-3">Green Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-amber-400">#1 🏆</td>
                      <td className="p-3 font-semibold text-slate-100">Green Hostel</td>
                      <td className="p-3">34.2 tCO₂e</td>
                      <td className="p-3 text-emerald-400 font-bold">↓ 18.5%</td>
                      <td className="p-3 text-teal-300 font-semibold">1,450 pts</td>
                    </tr>
                    <tr className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-300">#2 🥈</td>
                      <td className="p-3 font-semibold text-slate-100">Dept of CSE</td>
                      <td className="p-3">41.8 tCO₂e</td>
                      <td className="p-3 text-emerald-400 font-bold">↓ 14.2%</td>
                      <td className="p-3 text-teal-300 font-semibold">1,210 pts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INDUSTRIAL NODE */}
        {activeTab === "industrial" && (
          <div className="mt-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-100">Industrial Sensor Telemetry</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">Stack CO₂ Concentration</div>
                  <div className="text-3xl font-bold text-emerald-400 mt-2">412.8 ppm</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">Exhaust Temperature</div>
                  <div className="text-3xl font-bold text-amber-400 mt-2">148.5 °C</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-400">Scrubber Efficiency</div>
                  <div className="text-3xl font-bold text-teal-300 mt-2">94%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WHAT-IF SIMULATOR */}
        {activeTab === "simulator" && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>What-If Sustainability Simulator</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium flex justify-between">
                    <span>Rooftop Solar Installed (kW)</span>
                    <span className="text-emerald-400 font-bold">{solarKw} kW</span>
                  </label>
                  <input 
                    type="range" min="0" max="200" value={solarKw} 
                    onChange={(e) => setSolarKw(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer mt-2"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium flex justify-between">
                    <span>Electric Shuttle Buses</span>
                    <span className="text-emerald-400 font-bold">{evBuses} Buses</span>
                  </label>
                  <input 
                    type="range" min="0" max="10" value={evBuses} 
                    onChange={(e) => setEvBuses(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer mt-2"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400">Simulated Annual Savings</div>
                  <div className="text-3xl font-bold text-emerald-400 mt-2">{simCO2Saved} <span className="text-sm font-normal text-slate-400">kg CO₂e</span></div>
                  <div className="text-2xl font-bold text-teal-300 mt-2">₹{simMoneySaved.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ year saved</span></div>
                </div>
                <div className="text-[10px] text-slate-500 mt-4">
                  Calculated using CEA 2025 emission factors and grid tariff parameters.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CREDIT READINESS */}
        {activeTab === "credit" && (
          <div className="mt-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Carbon Credit Readiness Passport</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Projected Credit Potential</div>
                <div className="text-3xl font-bold text-cyan-300">0.48 <span className="text-xs text-slate-400">tCO₂e / yr</span></div>
                <p className="text-[11px] text-slate-400">Estimate only — external verification required.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400">Evidence Confidence Score</div>
                <div className="text-3xl font-bold text-emerald-400">92 / 100</div>
                <p className="text-[11px] text-slate-400">Internal CarbonLens indicator based on OCR and meter proof.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* WHY SHOULD I TRUST THIS MODAL */}
      {showTrustModal && selectedActivity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>"Why Should I Trust This?"</span>
              </h3>
              <button 
                onClick={() => setShowTrustModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div><span className="text-slate-500">Activity:</span> {selectedActivity.detail}</div>
                <div><span className="text-slate-500">Calculated CO₂:</span> {selectedActivity.co2} kg CO₂e</div>
                <div><span className="text-slate-500">Factor Source:</span> CEA India Grid 2025 / Climatiq</div>
                <div><span className="text-slate-500">Evidence Level:</span> Level {selectedActivity.level} (Meter / Digital Proof)</div>
              </div>
            </div>

            <button 
              onClick={() => setShowTrustModal(false)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
            >
              Close Explanation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

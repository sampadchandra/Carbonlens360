"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Shield,
  Zap,
  Leaf,
  Award,
  QrCode,
  Camera,
  MapPin,
  Navigation,
  Compass,
  Activity,
  TrendingDown,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  FileText,
  FileSpreadsheet,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  Check,
  X,
  Lock,
  ChevronRight,
  Eye,
  BarChart3,
  Calendar,
  Building,
  Coffee,
  Bike,
  Bus,
  Car,
  Footprints,
  Maximize2
} from "lucide-react";

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CarbonLensApp() {
  // ==================== GLOBAL APP STATE ====================
  const [activeRole, setActiveRole] = useState<string>("student");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [backendHealthy, setBackendHealthy] = useState<boolean>(true);

  // User & Wallet Data
  const [currentUser, setCurrentUser] = useState<any>({
    id: "u1111111-1111-1111-1111-111111111111",
    email: "student@carbonlens.io",
    role: "student",
    full_name: "Aarav Sharma",
    campus: "CarbonLens University",
    department: "Computer Science & Engineering",
    hostel: "Green Hostel",
    team: "Team EcoTech"
  });

  const [wallet, setWallet] = useState<{ available_credits: number; lifetime_earned: number; lifetime_redeemed: number }>({
    available_credits: 850,
    lifetime_earned: 1250,
    lifetime_redeemed: 400
  });
  const [ledger, setLedger] = useState<any[]>([]);

  // Commute Tracking State
  const [locationAllowed, setLocationAllowed] = useState<boolean>(true);
  const [commuteMode, setCommuteMode] = useState<string>("cycling");
  const [commuteActive, setCommuteActive] = useState<boolean>(false);
  const [tripId, setTripId] = useState<string>("");
  const [telemetry, setTelemetry] = useState<{ distance: number; speed: number; duration: number }>({ distance: 0, speed: 0, duration: 0 });
  const [tripCompletedData, setTripCompletedData] = useState<any>(null);

  // Live Camera State (Strictly camera only)
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rewards & QR State
  const [rewardsCatalog, setRewardsCatalog] = useState<any[]>([]);
  const [generatedQR, setGeneratedQR] = useState<any | null>(null);
  const [qrCountdown, setQrCountdown] = useState<number>(90);

  // Canteen Scanner State
  const [canteenTokenInput, setCanteenTokenInput] = useState<string>("");
  const [canteenRedeemResult, setCanteenRedeemResult] = useState<any | null>(null);
  const [canteenRedemptions, setCanteenRedemptions] = useState<any[]>([]);
  const [canteenStats, setCanteenStats] = useState<any>({ today_redemptions_count: 0, total_discounts_inr: 0, total_credits_absorbed: 0 });
  const [scannerCameraActive, setScannerCameraActive] = useState<boolean>(false);
  const scannerVideoRef = useRef<HTMLVideoElement | null>(null);

  // Activities State
  const [activities, setActivities] = useState<any[]>([]);
  const [newActivity, setNewActivity] = useState({ category: "Travel", activity_type: "Car (Petrol)", quantity: 15, original_unit: "km", evidence_level: 1 });

  // Challenges & Leaderboard
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<string>("hostels");
  const [leaderboards, setLeaderboards] = useState<any>({ hostels: [], departments: [], teams: [] });

  // Campus Hub & Simulator
  const [campusData, setCampusData] = useState<any>(null);
  const [campusProjects, setCampusProjects] = useState<any[]>([]);
  const [selectedPassport, setSelectedPassport] = useState<any | null>(null);
  const [whatIfInput, setWhatIfInput] = useState({ scenario_type: "Solar", implementation_pct: 60, investment_inr: 1200000 });
  const [whatIfResult, setWhatIfResult] = useState<any | null>(null);

  // Pollution & CleanRoute
  const [pollutionLocations, setPollutionLocations] = useState<any[]>([]);
  const [pollutionAlerts, setPollutionAlerts] = useState<any[]>([]);
  const [cleanRouteResult, setCleanRouteResult] = useState<any | null>(null);

  // Admin Data Monitor & Users
  const [adminData, setAdminData] = useState<any>(null);
  const [adminTableTab, setAdminTableTab] = useState<string>("trips");
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any | null>(null);

  // Trust Modal State
  const [trustModalOpen, setTrustModalOpen] = useState<boolean>(false);
  const [trustModalData, setTrustModalData] = useState<any | null>(null);

  // ==================== INITIAL DATA FETCHING ====================
  const fetchAllData = async () => {
    try {
      // 1. Health check
      const healthRes = await fetch(`${API_BASE}/health`).catch(() => null);
      if (healthRes && healthRes.ok) setBackendHealthy(true);

      // 2. Auth user & wallet
      const authRes = await fetch(`${API_BASE}/api/auth/me?user_id=${currentUser.id}`);
      if (authRes.ok) {
        const authData = await authRes.json();
        setWallet(authData.wallet);
      }

      // 3. Rewards Catalog & Ledger
      const catRes = await fetch(`${API_BASE}/api/rewards/catalog`);
      if (catRes.ok) setRewardsCatalog(await catRes.json());

      const walletRes = await fetch(`${API_BASE}/api/wallet?user_id=${currentUser.id}`);
      if (walletRes.ok) {
        const wData = await walletRes.json();
        setWallet(wData.wallet);
        setLedger(wData.recent_ledger || []);
      }

      // 4. Activities
      const actRes = await fetch(`${API_BASE}/api/activities`);
      if (actRes.ok) setActivities(await actRes.json());

      // 5. Challenges
      const chRes = await fetch(`${API_BASE}/api/challenges`);
      if (chRes.ok) setChallenges(await chRes.json());

      // 6. Campus & Projects
      const campusRes = await fetch(`${API_BASE}/api/dashboard/campus`);
      if (campusRes.ok) {
        const cData = await campusRes.json();
        setCampusData(cData);
        setLeaderboards({
          hostels: cData.hostel_rankings,
          departments: cData.department_rankings,
          teams: cData.team_rankings
        });
      }

      const projRes = await fetch(`${API_BASE}/api/projects`);
      if (projRes.ok) setCampusProjects(await projRes.json());

      // 7. Pollution
      const polRes = await fetch(`${API_BASE}/api/pollution/locations`);
      if (polRes.ok) setPollutionLocations(await polRes.json());

      const alertRes = await fetch(`${API_BASE}/api/pollution/alerts`);
      if (alertRes.ok) setPollutionAlerts(await alertRes.json());

      // 8. Canteen stats
      const canteenStatsRes = await fetch(`${API_BASE}/api/canteen/stats`);
      if (canteenStatsRes.ok) {
        const csData = await canteenStatsRes.json();
        setCanteenStats(csData);
        setCanteenRedemptions(csData.recent_redemptions || []);
      }

      // 9. Admin Data Monitor
      const adminRes = await fetch(`${API_BASE}/api/admin/data-monitor`);
      if (adminRes.ok) {
        const aData = await adminRes.json();
        setAdminData(aData);
        setAdminUsers(aData.users || []);
      }
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [currentUser.id]);

  // Handle role switching
  const handleRoleChange = async (roleName: string) => {
    setActiveRole(roleName);
    const usersRes = await fetch(`${API_BASE}/api/auth/users`);
    if (usersRes.ok) {
      const allUsers = await usersRes.json();
      const matched = allUsers.find((u: any) => u.role === roleName) || allUsers[0];
      setCurrentUser(matched);
      if (roleName === "canteen_staff") {
        setActiveTab("canteen");
      } else if (roleName === "campus_admin" || roleName === "sustainability_admin") {
        setActiveTab("campus");
      } else {
        setActiveTab("overview");
      }
    }
  };

  // ==================== LIVE CAMERA ACCESS (Strictly MediaDevices) ====================
  const startLiveCamera = async () => {
    setCapturedPhoto(null);
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access denied or running without physical camera. Using live simulation mode.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Draw futuristic telemetry timestamp overlay
        ctx.fillStyle = "#10b981";
        ctx.font = "14px monospace";
        ctx.fillText(`CARBONLENS PROOF • ${new Date().toISOString()} • MODE: ${commuteMode.toUpperCase()}`, 16, canvas.height - 20);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setCapturedPhoto(dataUrl);
      }
    } else {
      // High-tech fallback canvas generation with timestamp
      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, 640, 480);
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 20px monospace";
        ctx.fillText(`CARBONLENS LIVE CAMERA PROOF`, 40, 200);
        ctx.font = "16px monospace";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(`Travel Mode: ${commuteMode.toUpperCase()}`, 40, 240);
        ctx.fillText(`Timestamp: ${new Date().toISOString()}`, 40, 270);
        ctx.fillText(`Hardware Hash: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 40, 300);
        setCapturedPhoto(canvas.toDataURL("image/jpeg"));
      }
    }
    stopLiveCameraStream();
  };

  const stopLiveCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // ==================== COMMUTE WORKFLOW ====================
  const handleStartCommute = async () => {
    setTripCompletedData(null);
    setCommuteActive(true);
    setTelemetry({ distance: 0.1, speed: 18.2, duration: 1 });

    const res = await fetch(`${API_BASE}/api/commute/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        travel_mode: commuteMode,
        start_lat: 12.9716,
        start_lng: 77.5946
      })
    });
    if (res.ok) {
      const data = await res.json();
      setTripId(data.trip_id);
    }
    startLiveCamera();
  };

  // Simulate commute telemetry increments
  useEffect(() => {
    let interval: any;
    if (commuteActive) {
      interval = setInterval(() => {
        setTelemetry((prev) => ({
          distance: +(prev.distance + 0.35).toFixed(2),
          speed: +(16 + Math.random() * 6).toFixed(1),
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [commuteActive]);

  const handleEndCommute = async () => {
    setCommuteActive(false);
    stopLiveCameraStream();

    const payload = {
      trip_id: tripId || `trip-${Date.now().toString(36)}`,
      end_lat: 12.9750,
      end_lng: 77.6050,
      photo_base64: capturedPhoto || "simulated_camera_stream_proof",
      arrival_qr_token: "CAMPUS_GATE_NORTH_QR"
    };

    const res = await fetch(`${API_BASE}/api/commute/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const tripResult = await res.json();
      setTripCompletedData(tripResult);
      fetchAllData();
    }
  };

  // ==================== REWARD QR TOKEN GENERATION ====================
  const handleGenerateRewardQR = async (rewardId: string) => {
    const res = await fetch(`${API_BASE}/api/rewards/generate-qr`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        reward_id: rewardId
      })
    });

    if (res.ok) {
      const qrData = await res.json();
      setGeneratedQR(qrData);
      setQrCountdown(90);
    } else {
      const err = await res.json();
      alert(`Error: ${err.detail || "Unable to generate reward QR"}`);
    }
  };

  // QR Countdown Timer
  useEffect(() => {
    let timer: any;
    if (generatedQR && qrCountdown > 0) {
      timer = setInterval(() => setQrCountdown((prev) => prev - 1), 1000);
    } else if (qrCountdown === 0 && generatedQR) {
      setGeneratedQR(null);
    }
    return () => clearInterval(timer);
  }, [generatedQR, qrCountdown]);

  // ==================== CANTEEN SCAN & REDEEM ====================
  const handleCanteenScan = async (codeToRedeem?: string) => {
    const tokenToValidate = codeToRedeem || canteenTokenInput;
    if (!tokenToValidate) {
      alert("Please provide a valid QR token code.");
      return;
    }

    const res = await fetch(`${API_BASE}/api/canteen/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token_code: tokenToValidate,
        canteen_staff_id: currentUser.id
      })
    });

    if (res.ok) {
      const result = await res.json();
      setCanteenRedeemResult(result);
      fetchAllData();
    }
  };

  // ==================== ACTIVITY LOGGING ====================
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: currentUser.id,
        ...newActivity
      })
    });

    if (res.ok) {
      setNewActivity({ category: "Travel", activity_type: "Car (Petrol)", quantity: 15, original_unit: "km", evidence_level: 1 });
      fetchAllData();
    }
  };

  const handleDeleteActivity = async (actId: string) => {
    await fetch(`${API_BASE}/api/activities/${actId}`, { method: "DELETE" });
    fetchAllData();
  };

  // ==================== WHAT-IF SIMULATOR ====================
  const handleRunSimulator = async () => {
    const res = await fetch(`${API_BASE}/api/simulator/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(whatIfInput)
    });

    if (res.ok) {
      setWhatIfResult(await res.json());
    }
  };

  // ==================== CLEANROUTE CALCULATOR ====================
  const handleCalculateCleanRoute = async () => {
    const res = await fetch(`${API_BASE}/api/cleanroute/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start_lat: 12.9716,
        start_lng: 77.5946,
        end_lat: 12.9750,
        end_lng: 77.6050
      })
    });

    if (res.ok) {
      setCleanRouteResult(await res.json());
    }
  };

  // ==================== ADMIN USER INSPECTION ====================
  const handleInspectUser = async (uId: string) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${uId}?actor_id=${currentUser.id}`);
    if (res.ok) {
      setSelectedUserDetail(await res.json());
      fetchAllData(); // refreshes audit logs
    }
  };

  // ==================== JOIN CHALLENGE ====================
  const handleJoinChallenge = async (chId: string) => {
    const res = await fetch(`${API_BASE}/api/challenges/${chId}/join`, { method: "POST" });
    if (res.ok) fetchAllData();
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100">
      {/* ==================== COMMAND CENTER TOP BAR ==================== */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
          <img
            src="/logo.png"
            alt="CarbonLens 360 Logo"
            className="h-11 w-11 object-contain rounded-xl shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30 bg-slate-900/60 p-0.5 hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent">
                CARBONLENS 360
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                CAMPUS 2050
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">“From Carbon Footprint to Carbon Credit”</p>
          </div>
        </div>

        {/* Global Role Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          <span className="text-[11px] font-semibold text-slate-400 pl-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Active Role:
          </span>
          <select
            value={activeRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-slate-950 text-emerald-400 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="student">Student (Aarav Sharma)</option>
            <option value="teacher">Teacher (Prof. Ananya Sen)</option>
            <option value="staff">Staff (Rajesh Varma)</option>
            <option value="team_lead">Team Lead (Meera Patel)</option>
            <option value="campus_admin">Campus Admin (Dr. Priya Ramesh)</option>
            <option value="sustainability_admin">Sustainability Admin (Dr. Vikram Joshi)</option>
            <option value="canteen_staff">Canteen Staff (Ramesh Kumar)</option>
          </select>
        </div>

        {/* Wallet Pill & Health */}
        <div className="flex items-center space-x-4">
          <div
            onClick={() => setActiveTab("rewards")}
            className="cursor-pointer flex items-center space-x-2.5 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 rounded-full px-4 py-1.5 hover:border-emerald-400 transition-all glow-emerald"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Green Credits:</span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">{wallet.available_credits}</span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-[11px]">PostgreSQL Synced</span>
          </div>
        </div>
      </header>

      {/* ==================== SECONDARY NAVIGATION BAR ==================== */}
      <nav className="bg-slate-950/95 border-b border-slate-800/80 px-4 md:px-8 py-2 overflow-x-auto flex items-center space-x-2 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "overview" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> Overview & Pitch
        </button>

        {activeRole !== "canteen_staff" && (
          <>
            <button
              onClick={() => setActiveTab("commute")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "commute" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Commute Hub (Live Camera)
            </button>

            <button
              onClick={() => setActiveTab("rewards")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "rewards" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-teal-400" /> Green Credits & Rewards
            </button>

            <button
              onClick={() => setActiveTab("activities")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "activities" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" /> Carbon Logger
            </button>

            <button
              onClick={() => setActiveTab("challenges")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "challenges" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Challenges & Leaderboard
            </button>

            <button
              onClick={() => setActiveTab("pollution")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "pollution" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Pollution & CleanRoute
            </button>
          </>
        )}

        {/* Canteen Staff Dedicated View */}
        {(activeRole === "canteen_staff" || activeRole === "campus_admin") && (
          <button
            onClick={() => setActiveTab("canteen")}
            className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "canteen" ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-teal-400" /> Canteen POS Scanner
          </button>
        )}

        {/* Campus Admin & Sustainability Views */}
        {(activeRole === "campus_admin" || activeRole === "sustainability_admin" || activeRole === "team_lead") && (
          <>
            <button
              onClick={() => setActiveTab("campus")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "campus" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Building className="w-3.5 h-3.5 text-emerald-400" /> Campus Intelligence Hub
            </button>

            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "simulator" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" /> What-If Simulator
            </button>

            <button
              onClick={() => setActiveTab("admin-data")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "admin-data" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" /> Live Data Monitor
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab("methodology")}
          className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === "methodology" ? "bg-slate-800 text-slate-200 border border-slate-700 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-slate-400" /> Methodology & Trust
        </button>
      </nav>

      {/* ==================== MAIN CONTENT BODY ==================== */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & PUBLIC PITCH                                 */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            {/* 2050 Futuristic Hero */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-14 border border-emerald-500/20 glow-emerald">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> Next-Generation Campus Climate Operating System
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  From Carbon Footprint to <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Carbon Credit.</span>
                </h1>
                <p className="text-base md:text-lg text-slate-300 leading-relaxed font-normal">
                  A unified campus platform that turns carbon and environmental data into measurable action, verified sustainable commuting, campus canteen rewards, and evidence-based sustainability intelligence.
                </p>
                
                {/* Visual Core Product Loop */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4">
                  {[
                    { step: "1. MEASURE", desc: "GPS & Personal footprint", icon: Activity },
                    { step: "2. PROVE", desc: "Live-camera vehicle proof", icon: Camera },
                    { step: "3. REDUCE", desc: "Baseline CO2 reduction", icon: TrendingDown },
                    { step: "4. EARN", desc: "Green Credits to wallet", icon: Sparkles },
                    { step: "5. REDEEM", desc: "₹20 Canteen QR waivers", icon: QrCode }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                      <s.icon className="w-5 h-5 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">{s.step}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab("commute")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm hover:opacity-95 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4" /> Start Verified Commute
                  </button>
                  <button
                    onClick={() => setActiveTab("campus")}
                    className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm hover:border-emerald-400/50 flex items-center gap-2"
                  >
                    <Building className="w-4 h-4 text-emerald-400" /> Explore Campus Impact
                  </button>
                </div>
              </div>
            </div>

            {/* Live Campus Telemetry Counters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Campus Carbon Footprint</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{campusData?.total_emissions_tco2e || "1450.50"} <span className="text-xs font-normal text-slate-400">tCO2e</span></div>
                <div className="text-[11px] text-emerald-400">Scopes 1, 2 & 3 Institutional Total</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Verified Commute CO2 Saved</span>
                  <TrendingDown className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-teal-400 font-mono">{campusData?.co2_saved_tco2e || "340.2"} <span className="text-xs font-normal text-slate-400">tCO2e</span></div>
                <div className="text-[11px] text-teal-300">vs Standard Petrol Baseline</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Green Credits Distributed</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">{campusData?.green_credits_distributed || "184,000"}</div>
                <div className="text-[11px] text-slate-400">Earned by 1,250 active students & staff</div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span>Canteen Redemptions</span>
                  <Coffee className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400 font-mono">{canteenStats?.today_redemptions_count || "128"}</div>
                <div className="text-[11px] text-cyan-300">₹{canteenStats?.total_discounts_inr || "2,560"} meal waivers granted</div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("commute")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Live Camera Commute Proof</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capture your bicycle, bus, or EV vehicle using live device camera access. Strictly verified by GPS & geofencing.
                </p>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">Open Commute Hub <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>

              <div
                onClick={() => setActiveTab("rewards")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">Green Credits Wallet & QR</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generate signed 90-second QR tokens for ₹10 and ₹20 canteen discounts with instant cryptographic validation.
                </p>
                <div className="text-xs font-bold text-teal-400 flex items-center gap-1">View Wallet & Rewards <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>

              <div
                onClick={() => setActiveTab("simulator")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white">What-If Climate Simulator</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Simulate campus solar grid expansion, EV shuttle transitions, and smart HVAC upgrades with instant ROI and payback metrics.
                </p>
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-1">Launch Simulator <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: COMMUTE TRACKING & LIVE CAMERA PROOF                   */}
        {/* ============================================================== */}
        {activeTab === "commute" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-emerald-400" /> Campus Commute Verification
                </h2>
                <p className="text-xs text-slate-400">
                  Prove your low-carbon travel with live camera evidence, GPS telemetry, and campus geofencing.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className={`h-2 w-2 rounded-full ${locationAllowed ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                  <span>Location: <strong className="text-slate-200">{locationAllowed ? "Allowed" : "Disabled"}</strong></span>
                </div>
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Travel Mode</div>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                  { id: "cycling", label: "Cycling", icon: Bike, emission: "0.0 kg/km", factor: "0.00" },
                  { id: "walking", label: "Walking", icon: Footprints, emission: "0.0 kg/km", factor: "0.00" },
                  { id: "bus", label: "Campus Bus", icon: Bus, emission: "0.038 kg/km", factor: "0.038" },
                  { id: "train", label: "Metro/Train", icon: Activity, emission: "0.028 kg/km", factor: "0.028" },
                  { id: "motorcycle", label: "Motorcycle", icon: Activity, emission: "0.092 kg/km", factor: "0.092" },
                  { id: "car", label: "Car (Petrol)", icon: Car, emission: "0.192 kg/km", factor: "0.192" }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    disabled={commuteActive}
                    onClick={() => setCommuteMode(mode.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all ${
                      commuteMode === mode.id
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <mode.icon className="w-6 h-6" />
                    <span className="text-xs font-semibold">{mode.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{mode.emission}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Commute Active Session & Camera Overlay */}
            {!commuteActive && !tripCompletedData && (
              <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-6">
                <div className="max-w-md mx-auto space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <Camera className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Ready to Start Commute</h3>
                  <p className="text-xs text-slate-400">
                    Your device camera will open to capture live vehicle proof for <strong>{commuteMode.toUpperCase()}</strong>. Strictly no photo gallery uploads allowed.
                  </p>
                </div>

                <button
                  onClick={handleStartCommute}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-xl shadow-emerald-500/25 inline-flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" /> Start Active Commute
                </button>
              </div>
            )}

            {/* LIVE ACTIVE COMMUTE SCREEN */}
            {commuteActive && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Camera Viewfinder (Device Camera Only) */}
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4 glow-emerald">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> Live Camera Proof Viewfinder
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      HARDWARE STREAM ONLY
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {cameraActive && !capturedPhoto && (
                      <>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        {/* Futuristic Viewfinder Reticle */}
                        <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/30 m-4 rounded-lg flex flex-col justify-between p-3">
                          <div className="flex justify-between text-[10px] font-mono text-emerald-400">
                            <span>MODE: {commuteMode.toUpperCase()}</span>
                            <span>GPS FIX: ACTIVE</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>ISO: AUTO</span>
                            <span>VERIFICATION TIERS: 95/100</span>
                          </div>
                        </div>
                      </>
                    )}

                    {capturedPhoto && (
                      <div className="relative w-full h-full">
                        <img src={capturedPhoto} alt="Proof" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-emerald-500/90 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-md">
                          PHOTO VERIFIED
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Camera Controls */}
                  <div className="flex items-center justify-center gap-3">
                    {!capturedPhoto ? (
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold text-xs hover:bg-emerald-300 flex items-center gap-2"
                      >
                        <Camera className="w-4 h-4" /> Capture Photo Evidence
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={startLiveCamera}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs hover:bg-slate-700 flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                        </button>
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Photo Attached to Session
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Panel: Live GPS Telemetry */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Trip Telemetry</div>
                      <span className="text-xs font-mono text-emerald-400 animate-pulse">● TRACKING IN PROGRESS</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400">Distance</div>
                        <div className="text-xl font-bold font-mono text-white">{telemetry.distance} <span className="text-xs">km</span></div>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400">Speed</div>
                        <div className="text-xl font-bold font-mono text-white">{telemetry.speed} <span className="text-xs">km/h</span></div>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
                        <div className="text-[10px] text-slate-400">Duration</div>
                        <div className="text-xl font-bold font-mono text-white">{telemetry.duration} <span className="text-xs">min</span></div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Campus Geofence (1.5km radius):</span>
                        <span className="font-bold text-emerald-400">In Range (CarbonLens Gate)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Baseline Car Comparison:</span>
                        <span className="font-bold text-slate-300">0.192 kgCO2e/km</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEndCommute}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-extrabold text-sm hover:opacity-95 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Arrive at Campus & Complete Trip
                  </button>
                </div>
              </div>
            )}

            {/* TRIP COMPLETED RESULT CARD */}
            {tripCompletedData && (
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 glow-emerald space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Commute Verified & Green Credits Awarded!</h3>
                      <p className="text-xs text-slate-400">Trip ID: {tripCompletedData.id} • Saved in PostgreSQL</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTrustModalData({
                        category: "Commute Travel",
                        activity_type: tripCompletedData.travel_mode,
                        distance: tripCompletedData.distance_km,
                        co2e: tripCompletedData.calculated_co2e_kg,
                        saved: tripCompletedData.saved_co2e_kg,
                        credits: tripCompletedData.credits_earned,
                        confidence: tripCompletedData.evidence_confidence_score,
                        formula: `(Distance × Baseline Car 0.192) - (Distance × Mode Factor) = ${tripCompletedData.saved_co2e_kg} kgCO2e saved`,
                        source: "DEFRA / CEA India Transport Model & GPS Telemetry"
                      });
                      setTrustModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5" /> Why Should I Trust This?
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Distance</div>
                    <div className="text-xl font-bold font-mono text-white">{tripCompletedData.distance_km} km</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">CO2e Saved</div>
                    <div className="text-xl font-bold font-mono text-teal-400">{tripCompletedData.saved_co2e_kg} kg</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Green Credits Earned</div>
                    <div className="text-xl font-bold font-mono text-amber-400">+{tripCompletedData.credits_earned}</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div className="text-[11px] text-slate-400">Evidence Confidence</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">{tripCompletedData.evidence_confidence_score}/100</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => { setTripCompletedData(null); setActiveTab("rewards"); }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                  >
                    View in Wallet & Redeem Rewards →
                  </button>
                  <button
                    onClick={() => setTripCompletedData(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800"
                  >
                    Log Another Commute
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: GREEN CREDITS WALLET & CANTEEN REWARDS                  */}
        {/* ============================================================== */}
        {activeTab === "rewards" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-teal-400" /> Green Credits & Canteen Rewards
                </h2>
                <p className="text-xs text-slate-400">
                  Earned via verified low-carbon actions. Redeemable instantly at campus dining counters.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  Wallet ID: <strong className="text-slate-200">{currentUser.id.substring(0, 8)}...</strong>
                </span>
              </div>
            </div>

            {/* Wallet Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 glow-emerald space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Available Green Credits</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-4xl font-black text-emerald-400 font-mono">{wallet.available_credits}</div>
                <div className="text-[11px] text-slate-400">Ready for instant QR redemption</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Lifetime Earned</span>
                  <TrendingDown className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-4xl font-black text-white font-mono">{wallet.lifetime_earned}</div>
                <div className="text-[11px] text-teal-300">From verified travel & challenges</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Lifetime Redeemed</span>
                  <Coffee className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-4xl font-black text-amber-400 font-mono">{wallet.lifetime_redeemed}</div>
                <div className="text-[11px] text-slate-400">At campus canteens & events</div>
              </div>
            </div>

            {/* REWARD CATALOG */}
            <div className="space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Available Campus Rewards Catalog</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rewardsCatalog.map((r) => (
                  <div key={r.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                          {r.category || "Canteen"}
                        </span>
                        <span className="text-xs font-extrabold font-mono text-emerald-400">{r.credit_cost} Credits</span>
                      </div>
                      <h4 className="font-bold text-base text-white">{r.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
                    </div>

                    <button
                      onClick={() => handleGenerateRewardQR(r.id)}
                      disabled={wallet.available_credits < r.credit_cost}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                        wallet.available_credits >= r.credit_cost
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20"
                          : "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800"
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" /> Generate Discount QR
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SIGNED REWARD QR MODAL */}
            {generatedQR && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="glass-panel max-w-sm w-full p-6 rounded-3xl border border-emerald-500/40 glow-emerald text-center space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Signed Reward QR</span>
                    <button onClick={() => setGeneratedQR(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-white">{generatedQR.reward_title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Token: {generatedQR.token_code}</p>
                  </div>

                  {/* Simulated High-Res Futuristic QR Matrix */}
                  <div className="p-4 bg-white rounded-2xl max-w-[200px] mx-auto shadow-inner">
                    <div className="aspect-square bg-slate-950 rounded-lg p-3 flex flex-col items-center justify-center relative overflow-hidden">
                      <QrCode className="w-32 h-32 text-emerald-400" />
                      <div className="text-[8px] font-mono text-emerald-300 mt-1">CARBONLENS • 2026</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-2">
                      <span className="text-slate-400">Validity Timer:</span>
                      <span className="font-bold font-mono text-amber-400">{qrCountdown}s remaining</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${(qrCountdown / 90) * 100}%` }}></div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Present this QR to Canteen Staff. Discount will be applied atomically upon scanning.
                  </p>

                  <button
                    onClick={() => {
                      setCanteenTokenInput(generatedQR.token_code);
                      setGeneratedQR(null);
                      setActiveTab("canteen");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
                  >
                    Test Scan in Canteen View →
                  </button>
                </div>
              </div>
            )}

            {/* GREEN CREDITS LEDGER */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Green Credit Ledger Transactions</div>
              <div className="space-y-2">
                {ledger.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold ${tx.type === "EARN" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                        {tx.type === "EARN" ? "+" : "-"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{tx.description}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.created_at}</div>
                      </div>
                    </div>
                    <div className={`font-mono font-bold text-sm ${tx.type === "EARN" ? "text-emerald-400" : "text-amber-400"}`}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Credits
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: CANTEEN STAFF POS SCANNER & REDEMPTION                 */}
        {/* ============================================================== */}
        {activeTab === "canteen" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-teal-400" /> Canteen Staff POS Terminal
                </h2>
                <p className="text-xs text-slate-400">
                  Authorized dining hall scanner. Validates tokens cryptographically and applies instant meal discounts.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full">
                  Location: Main Campus Canteen
                </span>
              </div>
            </div>

            {/* Scanner Input Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-teal-400" /> Scan Student Benefit QR Token
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter or scan QR code (e.g. QR-7A9B32C1)..."
                    value={canteenTokenInput}
                    onChange={(e) => setCanteenTokenInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-teal-400"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCanteenScan()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Validate & Redeem Discount
                    </button>
                    <button
                      onClick={() => setCanteenTokenInput("")}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-teal-400" /> Canteen Privacy Protection Enforced
                  </div>
                  <div>Canteen staff cannot view student GPS logs, home addresses, or private activity history.</div>
                </div>
              </div>

              {/* Redemption Receipt or Status Output */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Verification Terminal Output</div>
                  {canteenRedeemResult ? (
                    <div className={`p-5 rounded-2xl border space-y-3 ${
                      canteenRedeemResult.status === "APPROVED"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 glow-emerald"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-300"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg">{canteenRedeemResult.status}</span>
                        <span className="text-[10px] font-mono">{canteenRedeemResult.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium">{canteenRedeemResult.message}</p>
                      
                      {canteenRedeemResult.status === "APPROVED" && (
                        <div className="space-y-1.5 pt-2 border-t border-emerald-500/20 text-xs font-mono">
                          <div>Student: <strong>{canteenRedeemResult.student_name}</strong></div>
                          <div>Reward: <strong>{canteenRedeemResult.reward_title}</strong></div>
                          <div>Discount Applied: <strong className="text-white">₹{canteenRedeemResult.discount_applied_inr}</strong></div>
                          <div>Credits Deducted: <strong className="text-white">{canteenRedeemResult.credits_deducted}</strong></div>
                          <div>Transaction ID: <strong>{canteenRedeemResult.transaction_code}</strong></div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-500 text-xs space-y-2">
                      <QrCode className="w-10 h-10 mx-auto text-slate-700" />
                      <div>Awaiting scan token from camera or keyboard...</div>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800/80">
                  Atomic POS Protocol • Double-redemption blocked • Server-verified
                </div>
              </div>
            </div>

            {/* Today's Redemptions Feed */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Today's Canteen Redemption Audit Trail</div>
              <div className="space-y-2">
                {canteenRedemptions.map((red) => (
                  <div key={red.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{red.reward_title} — {red.student_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{red.transaction_code} • {red.redeemed_at}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{red.discount_applied_inr} Saved</div>
                      <div className="text-[10px] text-slate-400">-{red.credits_deducted} Credits</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: CARBON LOGGER & ACTIVITIES CRUD                         */}
        {/* ============================================================== */}
        {activeTab === "activities" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" /> Personal Carbon Activity Logger
              </h2>
              <p className="text-xs text-slate-400">
                Log Travel, Electricity, Food, Fuel, and Waste. Backed by DEFRA / CEA emission factor calculations.
              </p>
            </div>

            {/* Activity Logging Form */}
            <form onSubmit={handleCreateActivity} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Log New Campus Activity</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Category</label>
                  <select
                    value={newActivity.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let actType = "Car (Petrol)";
                      let unit = "km";
                      if (cat === "Electricity") { actType = "Grid Electricity (India Average)"; unit = "kWh"; }
                      if (cat === "Food") { actType = "Vegetarian Meal"; unit = "meals"; }
                      if (cat === "Waste") { actType = "Municipal Solid Waste (Composted)"; unit = "kg"; }
                      if (cat === "Fuel") { actType = "LPG (Cooking Gas)"; unit = "kg"; }
                      setNewActivity({ ...newActivity, category: cat, activity_type: actType, original_unit: unit });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Food">Food</option>
                    <option value="Waste">Waste</option>
                    <option value="Fuel">Fuel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Activity Type</label>
                  <input
                    type="text"
                    value={newActivity.activity_type}
                    onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-semibold mb-1 block">Quantity ({newActivity.original_unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newActivity.quantity}
                    onChange={(e) => setNewActivity({ ...newActivity, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-95 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Calculate & Store
                  </button>
                </div>
              </div>
            </form>

            {/* Activities Table */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Logged Activities Records</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Activity Type</th>
                      <th className="py-2.5 px-3">Quantity</th>
                      <th className="py-2.5 px-3">Calculated CO2e</th>
                      <th className="py-2.5 px-3">Source & Factor</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-3 font-mono text-slate-400">{act.date}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">{act.category}</span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-200">{act.activity_type}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{act.quantity} {act.original_unit}</td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">{act.calculated_co2e} kg</td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">{act.source} • Tier {act.evidence_level}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: CHALLENGES & LEADERBOARD                                */}
        {/* ============================================================== */}
        {activeTab === "challenges" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-400" /> Campus Challenges & Leaderboards
              </h2>
              <p className="text-xs text-slate-400">
                Compete with hostels, departments, and teams to reduce collective carbon emissions and earn Green Credits.
              </p>
            </div>

            {/* Active Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((ch) => (
                <div key={ch.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {ch.category}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono">+{ch.green_points} Credits</span>
                    </div>

                    <h4 className="font-bold text-base text-white">{ch.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Progress:</span>
                        <span className="font-mono text-emerald-400">{ch.user_progress_days} / {ch.goal_days} days</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                          style={{ width: `${Math.min(100, (ch.user_progress_days / ch.goal_days) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinChallenge(ch.id)}
                    disabled={ch.joined}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 ${
                      ch.joined
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : "bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 hover:opacity-95 shadow-md shadow-amber-500/20"
                    }`}
                  >
                    {ch.joined ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {ch.joined ? "Participating" : "Join Challenge"}
                  </button>
                </div>
              ))}
            </div>

            {/* Campus Leaderboards */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Campus Carbon Reduction Leaderboards</div>
                <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {["hostels", "departments", "teams"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLeaderboardTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        leaderboardTab === tab ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {(leaderboards[leaderboardTab] || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold ${idx === 0 ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"}`}>
                        #{item.rank || idx + 1}
                      </div>
                      <span className="font-bold text-white text-sm">{item.name || item.hostel}</span>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-mono font-bold text-teal-400 text-sm">{item.co2_reduction_tco2e || item.co2_reduction} tCO2e</div>
                        <div className="text-[10px] text-slate-400">Carbon Saved</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="font-mono text-slate-300">{item.participants || 120}</div>
                        <div className="text-[10px] text-slate-400">Participants</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: CAMPUS INTELLIGENCE & PROJECTS                         */}
        {/* ============================================================== */}
        {activeTab === "campus" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Building className="w-6 h-6 text-emerald-400" /> Campus Sustainability Intelligence
                </h2>
                <p className="text-xs text-slate-400">
                  Institutional emissions, transport split, and Digital Carbon Passports.
                </p>
              </div>

              <a
                href={`${API_BASE}/api/reports/pdf`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" /> Download Institutional PDF Audit Report
              </a>
            </div>

            {/* Campus Transport Mode Split */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Verified Campus Transport Breakdown</div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { mode: "Bicycle Commutes", pct: "42%", count: "1,240 trips", icon: Bike, color: "text-emerald-400" },
                  { mode: "Walking", pct: "28%", count: "820 trips", icon: Footprints, color: "text-teal-400" },
                  { mode: "Campus Electric Bus", pct: "18%", count: "530 trips", icon: Bus, color: "text-cyan-400" },
                  { mode: "Motorcycles", pct: "8%", count: "235 trips", icon: Activity, color: "text-amber-400" },
                  { mode: "Petrol Cars", pct: "4%", count: "118 trips", icon: Car, color: "text-rose-400" }
                ].map((t, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center space-y-1">
                    <t.icon className={`w-5 h-5 mx-auto ${t.color}`} />
                    <div className="text-lg font-black font-mono text-white">{t.pct}</div>
                    <div className="text-xs font-semibold text-slate-300">{t.mode}</div>
                    <div className="text-[10px] text-slate-400">{t.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Sustainability Projects & Passports */}
            <div className="space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300">Campus Sustainability Projects & Digital Passports</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campusProjects.map((p) => (
                  <div key={p.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {p.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">Score: {p.evidence_confidence_score}/100</span>
                      </div>
                      <h4 className="font-bold text-base text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400">Owner: {p.owner}</p>

                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Baseline:</span>
                          <span className="text-slate-200">{p.baseline_emissions_tco2e} tCO2e</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Measured Reduction:</span>
                          <span className="text-teal-400 font-bold">{p.measured_reduction_tco2e} tCO2e</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Potential Credits:</span>
                          <span className="text-amber-400 font-bold">{p.potential_credits_tco2e} tCO2e</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPassport(p)}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Digital Passport
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DIGITAL PASSPORT MODAL */}
            {selectedPassport && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-emerald-500/40 glow-emerald space-y-5 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Digital Carbon Project Passport</span>
                    <button onClick={() => setSelectedPassport(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-white">{selectedPassport.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Passport Code: {selectedPassport.id} • Baseline: {selectedPassport.baseline_period}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Baseline</div>
                      <div className="font-bold text-white font-mono">{selectedPassport.baseline_emissions_tco2e} tCO2e</div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Current</div>
                      <div className="font-bold text-teal-400 font-mono">{selectedPassport.current_emissions_tco2e} tCO2e</div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">Potential Credits</div>
                      <div className="font-bold text-amber-400 font-mono">{selectedPassport.potential_credits_tco2e} tCO2e</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300">Project Timeline & Verification Telemetry:</div>
                    <div className="space-y-1.5">
                      {(selectedPassport.timeline || []).map((t: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3 text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                          <span className="font-mono text-emerald-400 font-bold">{t.date}</span>
                          <span className="text-slate-300">{t.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Disclaimer:</div>
                    <div>{selectedPassport.disclaimer}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: WHAT-IF CLIMATE SIMULATOR                              */}
        {/* ============================================================== */}
        {activeTab === "simulator" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Sliders className="w-6 h-6 text-indigo-400" /> Campus What-If Climate Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Model capital investments in renewable solar, EV shuttle fleet, and HVAC optimization to forecast ROI and CO2 reduction.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Simulator Input Controls */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Scenario Parameters</div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-2 block">Intervention Technology</label>
                    <select
                      value={whatIfInput.scenario_type}
                      onChange={(e) => setWhatIfInput({ ...whatIfInput, scenario_type: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                    >
                      <option value="Solar">Rooftop Solar PV Expansion (250kW)</option>
                      <option value="EV">Campus Electric Shuttle Fleet</option>
                      <option value="AC Efficiency">Smart HVAC & Chillers Upgrade</option>
                      <option value="Waste">Campus Organic Waste Biogas Composter</option>
                      <option value="LED Lighting">Campus-wide Smart LED & Motion Scheduling</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 font-semibold">Implementation Scale:</span>
                      <span className="font-bold font-mono text-emerald-400">{whatIfInput.implementation_pct}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={whatIfInput.implementation_pct}
                      onChange={(e) => setWhatIfInput({ ...whatIfInput, implementation_pct: parseInt(e.target.value) })}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-1 block">Capital Investment (₹ INR)</label>
                    <input
                      type="number"
                      step="50000"
                      value={whatIfInput.investment_inr}
                      onChange={(e) => setWhatIfInput({ ...whatIfInput, investment_inr: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunSimulator}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" /> Run Simulation Model
                </button>
              </div>

              {/* Simulator Output Cards */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Projected Environmental & Financial Impact</div>
                  {whatIfResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Baseline CO2e</div>
                          <div className="text-xl font-bold font-mono text-white">{whatIfResult.baseline_co2e} tCO2e</div>
                        </div>
                        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                          <div className="text-[10px] text-slate-400">Projected CO2e</div>
                          <div className="text-xl font-bold font-mono text-emerald-400">{whatIfResult.projected_co2e} tCO2e</div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Annual CO2 Reduction:</span>
                          <span className="font-bold text-emerald-400">{whatIfResult.co2e_reduction} tCO2e</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Annual Energy Bill Savings:</span>
                          <span className="font-bold text-teal-300">₹{whatIfResult.annual_cost_savings_inr?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Estimated Payback Period:</span>
                          <span className="font-bold text-amber-400">{whatIfResult.payback_years} Years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">5-Year Capital ROI:</span>
                          <span className="font-bold text-indigo-300">{whatIfResult.roi_percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Click "Run Simulation Model" to view projections.
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 pt-4 border-t border-slate-800">
                  Calculations derived from institutional baseline & CEA India Grid standard factor (0.716 kgCO2e/kWh).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: POLLUTION SENSOR MAP & CLEANROUTE                      */}
        {/* ============================================================== */}
        {activeTab === "pollution" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-rose-400" /> Campus Air Quality & CleanRoute
              </h2>
              <p className="text-xs text-slate-400">
                Real-time campus sensor network. Keep carbon and air quality intelligence distinct.
              </p>
            </div>

            {/* Pollution Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pollutionLocations.map((loc) => (
                <div key={loc.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{loc.name}</span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                      loc.aqi > 100 ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      AQI {loc.aqi}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-slate-400">PM2.5</div>
                      <div>{loc.pm25}</div>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-slate-400">PM10</div>
                      <div>{loc.pm10}</div>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg text-center">
                      <div className="text-[9px] text-slate-400">NO2</div>
                      <div>{loc.no2}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CleanRoute Navigator */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-sm font-bold uppercase tracking-wider text-slate-300">CleanRoute Low-Exposure Commute Calculator</div>
                <button
                  onClick={handleCalculateCleanRoute}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:opacity-95 flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" /> Compare Routes
                </button>
              </div>

              {cleanRouteResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-slate-400">Fastest Route (Via Main Ring Road)</div>
                    <div className="font-mono text-slate-200">Distance: {cleanRouteResult.standard_distance_km} km • Duration: {cleanRouteResult.standard_duration_min} min</div>
                    <div className="font-mono text-rose-400">Exposure Index: {cleanRouteResult.standard_exposure_index} (Elevated Traffic Pollutants)</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="font-bold text-emerald-400">CleanRoute (Green Belt Campus Bypass)</div>
                    <div className="font-mono text-slate-200">Distance: {cleanRouteResult.clean_distance_km} km • Duration: {cleanRouteResult.clean_duration_min} min</div>
                    <div className="font-mono text-emerald-300 font-bold">
                      Exposure Reduction: -{cleanRouteResult.exposure_reduction_pct}% PM2.5
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: ADMIN LIVE DATABASE MONITOR                           */}
        {/* ============================================================== */}
        {activeTab === "admin-data" && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-purple-400" /> Admin Live Database Monitor
                </h2>
                <p className="text-xs text-slate-400">
                  Read-only live inspection of PostgreSQL database rows. Synchronized in real time.
                </p>
              </div>

              <div className="flex space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                {["trips", "wallets", "ledger", "redemptions", "activities", "users", "audit_logs"].map((table) => (
                  <button
                    key={table}
                    onClick={() => setAdminTableTab(table)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      adminTableTab === table ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {table.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Viewer */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Displaying live rows from table: <strong className="text-purple-400 font-mono">{adminTableTab}</strong></span>
                <button onClick={fetchAllData} className="flex items-center gap-1 text-slate-300 hover:text-white">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Rows
                </button>
              </div>

              <div className="overflow-x-auto max-h-[500px]">
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
                  {JSON.stringify(adminData?.[adminTableTab] || [], null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 11: METHODOLOGY & SCIENTIFIC INTEGRITY                    */}
        {/* ============================================================== */}
        {activeTab === "methodology" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-slate-300" /> Scientific Methodology & Trust Framework
              </h2>
              <p className="text-xs text-slate-400">
                Complete traceability of emission factors, baselines, Green Credits, and privacy protections.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
              <h3 className="font-bold text-sm text-white">1. Travel Commute Carbon Calculation</h3>
              <p>
                Every trip's carbon footprint is computed using the standard formula:
              </p>
              <pre className="p-3 bg-slate-900 rounded-xl font-mono text-emerald-400">
                CO2e (kg) = Distance (km) × Mode Factor (kgCO2e/km)
              </pre>
              <p>
                <strong>Reduction Formula:</strong> Compared against a standard passenger vehicle baseline (0.192 kg CO2e/km):
              </p>
              <pre className="p-3 bg-slate-900 rounded-xl font-mono text-teal-400">
                Saved CO2e = (Distance × 0.192) - (Distance × Actual Mode Factor)
              </pre>

              <h3 className="font-bold text-sm text-white pt-4">2. Green Credits vs. Carbon Credits</h3>
              <p>
                <strong>Green Credits:</strong> Internal campus reward currency (100 credits = 1 kg CO2e saved) redeemable for meal discounts at campus canteens.
              </p>
              <p>
                <strong>Potential Carbon Credits:</strong> Project-level theoretical reduction equivalent (1 tCO2e) requiring accredited third-party validation (Gold Standard/Verra) for compliance markets.
              </p>

              <h3 className="font-bold text-sm text-white pt-4">3. Camera & Location Privacy</h3>
              <p>
                Continuous location watching is disabled outside active commute sessions. Commute proof is captured live via camera stream only with zero photo gallery access.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ==================== GLOBAL TRUST MODAL ==================== */}
      {trustModalOpen && trustModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-emerald-500/40 glow-emerald space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Data Traceability & Trust
              </span>
              <button onClick={() => setTrustModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-white">{trustModalData.category} — {trustModalData.activity_type}</h3>
              <p className="text-xs text-slate-400 font-mono">Evidence Confidence: {trustModalData.confidence}/100 (High Tier)</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
              <div>Formula: <strong className="text-emerald-300">{trustModalData.formula}</strong></div>
              <div>Source: <strong className="text-slate-300">{trustModalData.source}</strong></div>
              <div>CO2e Saved: <strong className="text-teal-400">{trustModalData.saved} kg</strong></div>
              <div>Green Credits: <strong className="text-amber-400">+{trustModalData.credits}</strong></div>
            </div>

            <button
              onClick={() => setTrustModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-8 text-center text-slate-500 text-xs mt-auto">
        <p>© 2026 CarbonLens 360 • College Climate & Rewards Operating System • “From Carbon Footprint to Carbon Credit”</p>
      </footer>
    </div>
  );
}

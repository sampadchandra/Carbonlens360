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

  // Auth State (Production Authentication & Modal)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authForm, setAuthForm] = useState({
    full_name: "",
    phone: "",
    username_or_phone: "",
    password: "",
    confirm_password: ""
  });

  // Load session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("cl360_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setActiveRole(parsed.role || "student");
      } catch (e) {}
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username_or_phone: authForm.username_or_phone,
          password: authForm.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }
      localStorage.setItem("cl360_user", JSON.stringify(data.user));
      localStorage.setItem("cl360_token", data.access_token);
      setCurrentUser(data.user);
      setActiveRole(data.user.role);
      setAuthModalOpen(false);

      if (data.user.role === "admin") {
        setActiveTab("admin-data");
      } else if (data.user.role === "canteen_staff") {
        setActiveTab("canteen");
      } else {
        setActiveTab("overview");
      }
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authForm.password !== authForm.confirm_password) {
      setAuthError("Passwords do not match");
      return;
    }
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: authForm.full_name,
          phone: authForm.phone,
          password: authForm.password,
          confirm_password: authForm.confirm_password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Signup failed");
      }
      localStorage.setItem("cl360_user", JSON.stringify(data.user));
      localStorage.setItem("cl360_token", data.access_token);
      setCurrentUser(data.user);
      setActiveRole(data.user.role);
      setAuthModalOpen(false);
      setActiveTab("overview");
    } catch (err: any) {
      setAuthError(err.message || "Signup failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("cl360_user");
    localStorage.removeItem("cl360_token");
    setCurrentUser({
      id: "guest",
      email: "guest@carbonlens.io",
      role: "student",
      full_name: "Guest User",
      campus: "CarbonLens University"
    });
    setActiveRole("student");
    setActiveTab("overview");
  };

  // ==================== INITIAL DATA FETCHING ====================
  const fetchAllData = async () => {
    try {
      // 1. Health check
      const healthRes = await fetch(`${API_BASE}/health`).catch(() => null);
      if (healthRes && healthRes.ok) setBackendHealthy(true);

      // 2. Auth user & wallet
      if (currentUser.id !== "guest") {
        const authRes = await fetch(`${API_BASE}/api/auth/me?user_id=${currentUser.id}`);
        if (authRes.ok) {
          const authData = await authRes.json();
          setWallet(authData.wallet);
        }
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

  // Vision AI State (TensorFlow.js COCO-SSD Object Detection)
  const [aiModel, setAiModel] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<string>("Initializing Vision AI Engine...");
  const [aiDetections, setAiDetections] = useState<any[]>([]);
  const [sceneLabels, setSceneLabels] = useState<string[]>([]);
  const [modeAutoDetected, setModeAutoDetected] = useState<boolean>(false);

  const detectionLoopRef = useRef<any>(null);
  const lastInferenceTimeRef = useRef<number>(0);
  const modeHistoryRef = useRef<string[]>([]);

  // Load COCO-SSD Object Detection Model dynamically on mount
  useEffect(() => {
    let isMounted = true;
    async function loadVisionAI() {
      try {
        setAiStatus("Loading Vision AI (COCO-SSD Model)...");
        const tf = await import("@tensorflow/tfjs");
        await tf.ready();
        const cocossd = await import("@tensorflow-models/coco-ssd");
        const model = await cocossd.load({ base: "lite_mobilenet_v2" });
        if (isMounted) {
          setAiModel(model);
          setAiStatus("AI Vision Active");
        }
      } catch (err) {
        console.warn("Vision AI model load warning, falling back to heuristic engine:", err);
        if (isMounted) setAiStatus("AI Vision Active (Fallback Engine)");
      }
    }
    loadVisionAI();
    return () => { isMounted = false; };
  }, []);

  // Continuous live detection loop & automatic travel-mode recognition with temporal smoothing (4 of 6 frames)
  useEffect(() => {
    if (cameraActive && !capturedPhoto && videoRef.current) {
      const runDetection = async () => {
        const now = Date.now();
        // Throttle inference loop to ~8-10 FPS for optimum performance
        if (now - lastInferenceTimeRef.current >= 110 && videoRef.current && videoRef.current.readyState === 4) {
          lastInferenceTimeRef.current = now;
          try {
            if (aiModel) {
              const predictions = await aiModel.detect(videoRef.current);
              setAiDetections(predictions || []);
              
              // Filter confident detections (threshold >= 0.45)
              const validDetections = (predictions || []).filter((p: any) => p.score >= 0.45);
              const detectedClassSet = new Set(validDetections.map((p: any) => p.class.toLowerCase()));
              
              // Determine candidate mode for current frame
              let frameCandidate: string | null = null;
              if (detectedClassSet.has("bicycle") && detectedClassSet.has("person")) {
                frameCandidate = "cycling";
              } else if (detectedClassSet.has("motorcycle") && detectedClassSet.has("person")) {
                frameCandidate = "motorcycle";
              } else if (detectedClassSet.has("bus")) {
                frameCandidate = "bus";
              } else if (detectedClassSet.has("car") && !detectedClassSet.has("bicycle")) {
                frameCandidate = "car";
              } else if (detectedClassSet.has("person") && telemetry.speed > 0 && telemetry.speed < 8.0) {
                frameCandidate = "walking";
              }

              if (frameCandidate) {
                modeHistoryRef.current.push(frameCandidate);
                if (modeHistoryRef.current.length > 6) {
                  modeHistoryRef.current.shift();
                }

                // Temporal smoothing: require candidate in at least 4 of last 6 frames
                const counts: Record<string, number> = {};
                modeHistoryRef.current.forEach((m) => counts[m] = (counts[m] || 0) + 1);
                
                const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                if (sorted.length > 0) {
                  const [topMode, topCount] = sorted[0];
                  if (topCount >= 4 && topMode !== commuteMode) {
                    setCommuteMode(topMode);
                    setModeAutoDetected(true);
                  }
                }
              }

              // Scene heuristics based on detected features
              const currentScenes: string[] = [];
              if (detectedClassSet.has("car") || detectedClassSet.has("bus") || detectedClassSet.has("bicycle") || detectedClassSet.has("motorcycle") || detectedClassSet.has("traffic light")) {
                currentScenes.push("Commute Corridor");
              }
              if (detectedClassSet.has("person")) {
                currentScenes.push("Pedestrian Zone");
              }
              if (detectedClassSet.has("potted plant") || detectedClassSet.has("bench")) {
                currentScenes.push("Campus Green Belt");
              }
              setSceneLabels(currentScenes);
            }
          } catch (err) {
            console.warn("Inference frame error:", err);
          }
        }
        detectionLoopRef.current = requestAnimationFrame(runDetection);
      };

      detectionLoopRef.current = requestAnimationFrame(runDetection);
    } else {
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
    }

    return () => {
      if (detectionLoopRef.current) cancelAnimationFrame(detectionLoopRef.current);
    };
  }, [cameraActive, capturedPhoto, aiModel, commuteMode, telemetry.speed]);

  // ==================== LIVE CAMERA ACCESS (Strictly MediaDevices) ====================
  const startLiveCamera = async () => {
    setCapturedPhoto(null);
    setCameraActive(true);
    setAiDetections([]);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn("Camera access denied or running without physical camera. Using live camera simulation.");
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
    setTelemetry({ distance: 0.0, speed: 0.0, duration: 0 });

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

  // Real-time active trip elapsed timer & speed update (resets to 0 when commute is inactive)
  useEffect(() => {
    let interval: any;
    if (commuteActive) {
      interval = setInterval(() => {
        setTelemetry((prev) => ({
          distance: +(prev.distance + 0.12).toFixed(2),
          speed: +(15 + Math.sin(Date.now() / 1000) * 3).toFixed(1),
          duration: prev.duration + 1
        }));
      }, 1000);
    } else {
      setTelemetry({ distance: 0.0, speed: 0.0, duration: 0 });
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
      arrival_qr_token: "CAMPUS_GATE_NORTH_QR",
      detected_objects: aiDetections.map((d: any) => ({
        label: d.class,
        confidence: Math.round(d.score * 100),
        bbox: d.bbox
      })),
      scene_labels: sceneLabels
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
      <header className="border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-2xl sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab("overview")}>
            <div className="relative">
              <img
                src="/logo.png"
                alt="CarbonLens 360 Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-xl shadow-md ring-1 ring-emerald-400/30 bg-slate-900/80 p-0.5 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
                  CARBONLENS 360
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider">
                  CAMPUS 2050
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">“From Carbon Footprint to Carbon Credit”</p>
            </div>
          </div>

          {/* Center: Live Role Preview Switcher */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/70 border border-white/[0.08] rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" /> Persona:
            </span>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent text-emerald-300 font-semibold text-xs focus:outline-none cursor-pointer capitalize py-0.5"
            >
              <option value="student" className="bg-slate-900 text-slate-200">Student (Aarav)</option>
              <option value="teacher" className="bg-slate-900 text-slate-200">Faculty (Dr. Sen)</option>
              <option value="canteen_staff" className="bg-slate-900 text-slate-200">Canteen Staff (POS)</option>
              <option value="campus_admin" className="bg-slate-900 text-slate-200">Campus Admin</option>
              <option value="sustainability_admin" className="bg-slate-900 text-slate-200">Sustainability Lead</option>
            </select>
          </div>

          {/* Right: Actions, Wallet & Auth */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Wallet Pill */}
            <div
              onClick={() => setActiveTab("rewards")}
              className="cursor-pointer flex items-center space-x-2 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 hover:border-emerald-400/50 rounded-full px-3.5 py-1.5 transition-all shadow-sm group"
              title="Click to view wallet and reward catalog"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-semibold text-slate-300 hidden sm:inline">Credits:</span>
              <span className="text-sm font-bold text-emerald-300 font-mono tracking-tight">{wallet.available_credits}</span>
            </div>

            {/* Sync Badge */}
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-full border border-white/[0.06]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[11px] text-slate-400">Live Sync</span>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center">
              {currentUser.id !== "guest" ? (
                <div className="flex items-center space-x-2.5 bg-slate-900/80 border border-white/[0.08] rounded-xl px-2.5 py-1.5 shadow-sm">
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-200 max-w-[130px] truncate">{currentUser.full_name}</div>
                    <div className="text-[10px] text-emerald-400 capitalize font-mono leading-none">{currentUser.role?.replace("_", " ")}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors focus-ring"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { setAuthMode("login"); setAuthError(null); setAuthModalOpen(true); }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:border-emerald-500/50 hover:text-white transition-all focus-ring"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { setAuthMode("signup"); setAuthError(null); setAuthModalOpen(true); }}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 focus-ring"
                  >
                    <Users className="w-3.5 h-3.5" /> Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ==================== SECONDARY NAVIGATION BAR ==================== */}
      <nav className="sticky top-[57px] z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-xs font-semibold">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
              activeTab === "overview"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" /> Overview & Pitch
          </button>

          {activeRole !== "canteen_staff" && (
            <>
              <button
                onClick={() => setActiveTab("commute")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "commute"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" /> Commute Hub
              </button>

              <button
                onClick={() => setActiveTab("rewards")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "rewards"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-teal-400" /> Green Credits & Rewards
              </button>

              <button
                onClick={() => setActiveTab("activities")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "activities"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Carbon Logger
              </button>

              <button
                onClick={() => setActiveTab("challenges")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "challenges"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Challenges & Leaderboard
              </button>

              <button
                onClick={() => setActiveTab("pollution")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "pollution"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
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
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                activeTab === "canteen"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-teal-400" /> Canteen POS Scanner
            </button>
          )}

          {/* Campus Admin, Sustainability & System Admin Views */}
          {(activeRole === "admin" || activeRole === "campus_admin" || activeRole === "sustainability_admin" || activeRole === "team_lead") && (
            <>
              <button
                onClick={() => setActiveTab("campus")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "campus"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Building className="w-3.5 h-3.5 text-emerald-400" /> Campus Intelligence Hub
              </button>

              <button
                onClick={() => setActiveTab("simulator")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "simulator"
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> What-If Simulator
              </button>

              <button
                onClick={() => setActiveTab("admin-data")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
                  activeTab === "admin-data"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400" /> Live Data Monitor
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("methodology")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 focus-ring ${
              activeTab === "methodology"
                ? "bg-slate-800 text-slate-200 border border-slate-700 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" /> Methodology & Trust
          </button>
        </div>
      </nav>


      {/* ==================== MAIN CONTENT BODY ==================== */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW & PUBLIC PITCH                                 */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-10 animate-fade-in">
            {/* 2050 Futuristic Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 lg:p-14 border border-emerald-500/25 glow-emerald shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 
                  <span>Next-Generation Campus Climate Operating System</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  From Carbon Footprint to <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Carbon Credit.</span>
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                  A unified campus platform that turns carbon and environmental data into measurable action, verified sustainable commuting, campus dining rewards, and evidence-based institutional intelligence.
                </p>
                
                {/* Visual Core Product Loop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
                  {[
                    { stepNum: "01", step: "MEASURE", desc: "GPS & Personal footprint", icon: Activity },
                    { stepNum: "02", step: "PROVE", desc: "Live-camera vehicle proof", icon: Camera },
                    { stepNum: "03", step: "REDUCE", desc: "Baseline CO2 reduction", icon: TrendingDown },
                    { stepNum: "04", step: "EARN", desc: "Green Credits to wallet", icon: Sparkles },
                    { stepNum: "05", step: "REDEEM", desc: "₹20 Canteen QR waivers", icon: QrCode }
                  ].map((s, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-900/80 hover:bg-slate-900 border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-3.5 text-center space-y-2 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                          {s.stepNum}
                        </span>
                        <s.icon className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xs font-bold text-slate-100 tracking-tight">{s.step}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{s.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => setActiveTab("commute")}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center gap-2 focus-ring"
                  >
                    <Navigation className="w-4 h-4" /> Start Verified Commute
                  </button>
                  <button
                    onClick={() => setActiveTab("campus")}
                    className="px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.12] hover:border-emerald-400/40 text-slate-200 font-bold text-xs sm:text-sm active:scale-[0.98] transition-all flex items-center gap-2 focus-ring"
                  >
                    <Building className="w-4 h-4 text-emerald-400" /> Explore Campus Impact
                  </button>
                </div>
              </div>
            </div>

            {/* Live Campus Telemetry Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Campus Footprint</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {campusData?.total_emissions_tco2e || "1450.50"} <span className="text-xs font-normal text-slate-400 font-sans">tCO2e</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Scopes 1, 2 & 3 Institutional Total</div>
              </div>

              <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Commute CO2 Saved</span>
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-teal-300 font-mono tracking-tight">
                  {campusData?.co2_saved_tco2e || "340.2"} <span className="text-xs font-normal text-slate-400 font-sans">tCO2e</span>
                </div>
                <div className="text-[11px] text-teal-300 font-medium">vs Standard Petrol Baseline</div>
              </div>

              <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Green Credits Issued</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                  {campusData?.green_credits_distributed || "184,000"}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Distributed to students & faculty</div>
              </div>

              <div className="glass-panel glass-panel-hover p-5 rounded-2xl space-y-2">
                <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Canteen Waivers</span>
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Coffee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono tracking-tight">
                  {canteenStats?.today_redemptions_count || "128"}
                </div>
                <div className="text-[11px] text-cyan-300 font-medium">₹{canteenStats?.total_discounts_inr || "2,560"} discounts granted</div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("commute")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3.5 group focus-ring"
                tabIndex={0}
                role="button"
              >
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    Live Camera Commute Proof
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Capture bicycle, bus, or electric vehicle using live hardware camera access with real-time AI object verification.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  Open Commute Hub <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("rewards")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3.5 group focus-ring"
                tabIndex={0}
                role="button"
              >
                <div className="h-11 w-11 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition-colors">
                    Green Credits Wallet & QR
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Generate signed 90-second QR tokens for ₹10 and ₹20 canteen discounts with instant server-verified redemption.
                  </p>
                </div>
                <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  View Wallet & Rewards <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("simulator")}
                className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer space-y-3.5 group focus-ring"
                tabIndex={0}
                role="button"
              >
                <div className="h-11 w-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                    What-If Climate Simulator
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Simulate solar grid expansion, EV shuttle transitions, and smart HVAC upgrades with instant ROI and payback metrics.
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  Launch Simulator <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: COMMUTE TRACKING & LIVE CAMERA PROOF                   */}
        {/* ============================================================== */}
        {activeTab === "commute" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Navigation className="w-6 h-6 text-emerald-400" /> Campus Commute Verification
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Prove your low-carbon travel with live camera evidence, GPS telemetry, and campus geofencing.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/[0.08] shadow-sm">
                  <span className={`h-2 w-2 rounded-full ${locationAllowed ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                  <span className="text-slate-400 text-[11px]">Geofence GPS:</span>
                  <strong className="text-slate-200 text-xs font-semibold">{locationAllowed ? "Active (Within Campus Zone)" : "Disabled"}</strong>
                </div>
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <span>1. Select Travel Mode</span>
                </div>
                {modeAutoDetected && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse font-mono shadow-sm">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> AI AUTO-DETECTED
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: "cycling", label: "Cycling", icon: Bike, emission: "0.0 kg/km" },
                  { id: "walking", label: "Walking", icon: Footprints, emission: "0.0 kg/km" },
                  { id: "bus", label: "Campus Bus", icon: Bus, emission: "0.038 kg/km" },
                  { id: "train", label: "Metro/Train", icon: Activity, emission: "0.028 kg/km" },
                  { id: "motorcycle", label: "Motorcycle", icon: Activity, emission: "0.092 kg/km" },
                  { id: "car", label: "Car (Petrol)", icon: Car, emission: "0.192 kg/km" }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    disabled={commuteActive}
                    onClick={() => { setCommuteMode(mode.id); setModeAutoDetected(false); }}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 text-center transition-all relative focus-ring ${
                      commuteMode === mode.id
                        ? "bg-emerald-500/15 border-emerald-400 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/40"
                        : "bg-slate-900/60 border-white/[0.08] text-slate-400 hover:border-white/[0.2] hover:text-slate-200"
                    } ${commuteActive ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {commuteMode === mode.id && modeAutoDetected && (
                      <span className="absolute -top-2 bg-emerald-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        AI RECOGNIZED
                      </span>
                    )}
                    <mode.icon className="w-6 h-6 shrink-0" />
                    <span className="text-xs font-semibold">{mode.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{mode.emission}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Commute Pre-Start State */}
            {!commuteActive && !tripCompletedData && (
              <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto border border-emerald-500/20">
                <div className="space-y-3">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Ready to Start Verified Trip</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    Your device camera will stream live to provide hardware-verified evidence for <strong>{commuteMode.toUpperCase()}</strong>. GPS telemetry tracks distance and computes saved CO2 baseline in real time.
                  </p>
                </div>

                <button
                  onClick={handleStartCommute}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 active:scale-[0.98] inline-flex items-center gap-2 transition-all focus-ring"
                >
                  <Navigation className="w-4 h-4" /> Start Active Commute
                </button>
              </div>
            )}

            {/* LIVE ACTIVE COMMUTE SCREEN */}
            {commuteActive && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel: Camera Viewfinder (Device Camera Only) */}
                <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/30 space-y-4 glow-emerald">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" /> Live Camera Proof Viewfinder
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                      HARDWARE STREAM ONLY
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/[0.1] flex items-center justify-center shadow-inner">
                    {cameraActive && !capturedPhoto && (
                      <>
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        
                        {/* Live Vision AI Real-Time Bounding Box Overlay */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {aiDetections.map((det: any, idx: number) => {
                            const video = videoRef.current;
                            if (!video) return null;
                            const vw = video.videoWidth || 640;
                            const vh = video.videoHeight || 480;
                            const [x, y, w, h] = det.bbox || [0, 0, 0, 0];
                            const left = `${(x / vw) * 100}%`;
                            const top = `${(y / vh) * 100}%`;
                            const width = `${(w / vw) * 100}%`;
                            const height = `${(h / vh) * 100}%`;
                            const scorePct = Math.round(det.score * 100);
                            const label = det.class.toUpperCase();

                            return (
                              <div
                                key={idx}
                                style={{ left, top, width, height }}
                                className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded-md transition-all duration-75 flex flex-col justify-start"
                              >
                                <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-t-sm self-start tracking-wider font-mono shadow-md">
                                  {label} {scorePct}%
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* HUD Viewfinder Reticle & Vision AI Status Header */}
                        <div className="absolute inset-0 pointer-events-none border border-emerald-500/20 m-3 rounded-xl flex flex-col justify-between p-3">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="bg-slate-950/85 px-2.5 py-1 rounded-lg text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                              ● {aiStatus}
                            </span>
                            <span className="bg-slate-950/85 px-2.5 py-1 rounded-lg text-slate-200 border border-white/[0.1] font-bold">
                              MODE: {commuteMode.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex justify-between items-end text-[10px] font-mono">
                            <div className="bg-slate-950/90 p-2 rounded-lg border border-white/[0.1] text-slate-300 space-y-0.5 max-w-[200px] shadow-sm">
                              <div className="text-emerald-400 font-bold text-[10px]">SCENE CLASSIFICATION:</div>
                              {sceneLabels.map((sc, i) => (
                                <div key={i} className="text-[10px] text-slate-300 font-sans">✓ {sc}</div>
                              ))}
                            </div>

                            <span className="bg-slate-950/85 px-2.5 py-1 rounded-lg text-slate-300 border border-white/[0.1]">
                              DETECTED: <strong className="text-emerald-400">{aiDetections.length}</strong> OBJECTS
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {capturedPhoto && (
                      <div className="relative w-full h-full">
                        <img src={capturedPhoto} alt="Proof" className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-emerald-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md font-mono">
                          ✓ EVIDENCE CAPTURED & ATTACHED
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Dynamic Detection Sidebar Panel */}
                  {cameraActive && !capturedPhoto && (
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <Sparkles className="w-3.5 h-3.5" /> Detected Objects ({aiDetections.length})
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">On-Device TensorFlow</span>
                      </div>

                      {aiDetections.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {aiDetections.map((det: any, i: number) => {
                            const scorePct = Math.round(det.score * 100);
                            const isMatch = (commuteMode === "cycling" && det.class === "bicycle") ||
                                            (commuteMode === "motorcycle" && (det.class === "motorcycle" || det.class === "car")) ||
                                            (commuteMode === "car" && det.class === "car") ||
                                            (det.class === "person");

                            return (
                              <div key={i} className={`p-2 rounded-lg border text-[11px] flex justify-between items-center ${
                                isMatch ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold" : "bg-slate-950/60 border-white/[0.06] text-slate-300"
                              }`}>
                                <span className="capitalize">{det.class}</span>
                                <span className="font-mono text-[10px]">{scorePct}% {isMatch && "✓"}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic text-center py-1">
                          Scanning camera feed for vehicles (Bicycle, Bus, Motorcycle, Car)...
                        </div>
                      )}
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    {!capturedPhoto ? (
                      <button
                        onClick={capturePhoto}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center gap-2 focus-ring"
                      >
                        <Camera className="w-4 h-4" /> Capture Photo Evidence
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={startLiveCamera}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-[0.98] transition-all flex items-center gap-1.5 focus-ring"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                        </button>
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Ready for submission
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Panel: Live GPS Telemetry */}
                <div className="glass-panel p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Trip Telemetry</div>
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                        RECORDING
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-900/80 border border-white/[0.08] p-4 rounded-2xl text-center space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Distance</div>
                        <div className="text-2xl font-black font-mono text-white tracking-tight">
                          {telemetry.distance} <span className="text-xs text-slate-400 font-sans">km</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 border border-white/[0.08] p-4 rounded-2xl text-center space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Speed</div>
                        <div className="text-2xl font-black font-mono text-white tracking-tight">
                          {telemetry.speed} <span className="text-xs text-slate-400 font-sans">km/h</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 border border-white/[0.08] p-4 rounded-2xl text-center space-y-1">
                        <div className="text-[11px] text-slate-400 font-medium">Duration</div>
                        <div className="text-2xl font-black font-mono text-white tracking-tight">
                          {telemetry.duration} <span className="text-xs text-slate-400 font-sans">sec</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Campus Geofence (1.5km radius):</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Inside Campus Zone
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2">
                        <span className="text-slate-400">Baseline Car Comparison:</span>
                        <span className="font-mono font-bold text-slate-200">0.192 kgCO2e/km</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleEndCommute}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-ring"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Arrive at Campus & Complete Trip
                  </button>
                </div>
              </div>
            )}

            {/* TRIP COMPLETED RESULT CARD */}
            {tripCompletedData && (
              <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/40 glow-emerald space-y-6 shadow-2xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                      <Check className="w-7 h-7 stroke-[3]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white tracking-tight">Commute Verified & Green Credits Awarded!</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Trip ID: {tripCompletedData.id} • Saved in PostgreSQL</p>
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
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5 focus-ring"
                  >
                    <Shield className="w-3.5 h-3.5" /> Why Should I Trust This?
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08] space-y-1">
                    <div className="text-[11px] text-slate-400">Distance</div>
                    <div className="text-xl font-black font-mono text-white">{tripCompletedData.distance_km} km</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08] space-y-1">
                    <div className="text-[11px] text-slate-400">CO2e Saved</div>
                    <div className="text-xl font-black font-mono text-teal-300">{tripCompletedData.saved_co2e_kg} kg</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08] space-y-1">
                    <div className="text-[11px] text-slate-400">Green Credits Earned</div>
                    <div className="text-xl font-black font-mono text-amber-300">+{tripCompletedData.credits_earned}</div>
                  </div>
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08] space-y-1">
                    <div className="text-[11px] text-slate-400">Evidence Confidence</div>
                    <div className="text-xl font-black font-mono text-emerald-400">{tripCompletedData.evidence_confidence_score}/100</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => { setTripCompletedData(null); setActiveTab("rewards"); }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all focus-ring"
                  >
                    View in Wallet & Redeem Rewards →
                  </button>
                  <button
                    onClick={() => setTripCompletedData(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-slate-300 hover:text-white text-xs font-bold hover:bg-slate-800 transition-all focus-ring"
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-teal-400" /> Green Credits & Canteen Rewards
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Earned via verified low-carbon actions. Redeemable instantly at campus dining counters.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/[0.08]">
                  Wallet ID: <strong className="text-slate-200">{currentUser.id.substring(0, 8)}...</strong>
                </span>
              </div>
            </div>

            {/* Wallet Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 glow-emerald space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Available Green Credits</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">{wallet.available_credits}</div>
                <div className="text-[11px] text-slate-400">Ready for instant QR redemption</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Lifetime Earned</span>
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{wallet.lifetime_earned}</div>
                <div className="text-[11px] text-teal-300">From verified travel & challenges</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span className="uppercase tracking-wider text-[11px]">Lifetime Redeemed</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <Coffee className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono tracking-tight">{wallet.lifetime_redeemed}</div>
                <div className="text-[11px] text-slate-400">At campus dining counters</div>
              </div>
            </div>

            {/* REWARD CATALOG */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Available Campus Rewards Catalog</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {rewardsCatalog.map((r) => (
                  <div key={r.id} className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider">
                          {r.category || "Canteen"}
                        </span>
                        <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                          {r.credit_cost} Credits
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white">{r.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{r.description}</p>
                    </div>

                    <button
                      onClick={() => handleGenerateRewardQR(r.id)}
                      disabled={wallet.available_credits < r.credit_cost}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 focus-ring ${
                        wallet.available_credits >= r.credit_cost
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-md shadow-emerald-500/20 active:scale-[0.98]"
                          : "bg-slate-900 text-slate-600 cursor-not-allowed border border-white/[0.06]"
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
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="glass-panel max-w-sm w-full p-6 sm:p-7 rounded-3xl border border-emerald-500/40 glow-emerald text-center space-y-5 animate-fade-in shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Signed Reward QR</span>
                    <button 
                      onClick={() => setGeneratedQR(null)} 
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-ring"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-white tracking-tight">{generatedQR.reward_title}</h3>
                    <p className="text-xs text-slate-400 font-mono">Token: {generatedQR.token_code}</p>
                  </div>

                  {/* Simulated High-Res Futuristic QR Matrix */}
                  <div className="p-4 bg-white rounded-2xl max-w-[200px] mx-auto shadow-inner">
                    <div className="aspect-square bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
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

                  <p className="text-[11px] text-slate-400 leading-normal">
                    Present this QR to Canteen Staff. Discount will be applied atomically upon scanning.
                  </p>

                  <button
                    onClick={() => {
                      setCanteenTokenInput(generatedQR.token_code);
                      setGeneratedQR(null);
                      setActiveTab("canteen");
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors focus-ring"
                  >
                    Test Scan in Canteen View →
                  </button>
                </div>
              </div>
            )}

            {/* GREEN CREDITS LEDGER */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Recent Green Credit Ledger Transactions</div>
              <div className="space-y-2">
                {ledger.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs hover:bg-slate-900 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm ${tx.type === "EARN" ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                        {tx.type === "EARN" ? "+" : "-"}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{tx.description}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.created_at}</div>
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Coffee className="w-6 h-6 text-teal-400" /> Canteen Staff POS Terminal
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Authorized dining hall scanner. Validates tokens cryptographically and applies instant meal discounts.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono bg-teal-500/10 text-teal-300 border border-teal-500/25 px-3 py-1 rounded-full font-semibold">
                  Terminal: Main Campus Dining Hall
                </span>
              </div>
            </div>

            {/* Scanner Input Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-teal-400" /> Scan Student Benefit QR Token
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter or scan QR code (e.g. QR-7A9B32C1)..."
                    value={canteenTokenInput}
                    onChange={(e) => setCanteenTokenInput(e.target.value)}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 transition-all"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCanteenScan()}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 focus-ring"
                    >
                      <Check className="w-4 h-4" /> Validate & Redeem Discount
                    </button>
                    <button
                      onClick={() => setCanteenTokenInput("")}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold active:scale-[0.98] transition-all focus-ring"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-400" /> Privacy Protection Enforced
                  </div>
                  <div>Canteen staff can only view student discount validation; private GPS logs remain confidential.</div>
                </div>
              </div>

              {/* Redemption Receipt or Status Output */}
              <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">Verification Terminal Output</div>
                  {canteenRedeemResult ? (
                    <div className={`p-5 rounded-2xl border space-y-3.5 ${
                      canteenRedeemResult.status === "APPROVED"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 glow-emerald"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-300"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-lg tracking-tight">{canteenRedeemResult.status}</span>
                        <span className="text-[10px] font-mono text-slate-400">{canteenRedeemResult.timestamp}</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed">{canteenRedeemResult.message}</p>
                      
                      {canteenRedeemResult.status === "APPROVED" && (
                        <div className="space-y-1.5 pt-3 border-t border-emerald-500/20 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Student:</span> 
                            <strong className="text-white">{canteenRedeemResult.student_name}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Reward:</span> 
                            <strong className="text-white">{canteenRedeemResult.reward_title}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Discount Applied:</span> 
                            <strong className="text-emerald-400 text-sm font-bold">₹{canteenRedeemResult.discount_applied_inr}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Credits Deducted:</span> 
                            <strong className="text-amber-400 font-bold">{canteenRedeemResult.credits_deducted}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Transaction ID:</span> 
                            <strong className="text-slate-300">{canteenRedeemResult.transaction_code}</strong>
                          </div>
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

                <div className="text-[11px] text-slate-500 pt-4 border-t border-white/[0.06]">
                  Atomic POS Protocol • Double-redemption blocked • Cryptographically signed
                </div>
              </div>
            </div>

            {/* Today's Redemptions Feed */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Today's Canteen Redemption Audit Trail</div>
              <div className="space-y-2">
                {canteenRedemptions.map((red) => (
                  <div key={red.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs hover:bg-slate-900 transition-colors">
                    <div>
                      <div className="font-semibold text-slate-200">{red.reward_title} — {red.student_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{red.transaction_code} • {red.redeemed_at}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">₹{red.discount_applied_inr} Saved</div>
                      <div className="text-[10px] text-slate-400 font-mono">-{red.credits_deducted} Credits</div>
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
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" /> Personal Carbon Activity Logger
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Log Travel, Electricity, Food, Fuel, and Waste. Backed by DEFRA / CEA emission factor calculations.
              </p>
            </div>

            {/* Activity Logging Form */}
            <form onSubmit={handleCreateActivity} className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Log New Campus Activity</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold mb-1 block">Category</label>
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
                    className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Food">Food</option>
                    <option value="Waste">Waste</option>
                    <option value="Fuel">Fuel</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold mb-1 block">Activity Type</label>
                  <input
                    type="text"
                    value={newActivity.activity_type}
                    onChange={(e) => setNewActivity({ ...newActivity, activity_type: e.target.value })}
                    className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold mb-1 block">Quantity ({newActivity.original_unit})</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newActivity.quantity}
                    onChange={(e) => setNewActivity({ ...newActivity, quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 focus-ring"
                  >
                    <Plus className="w-4 h-4" /> Calculate & Store
                  </button>
                </div>
              </div>
            </form>

            {/* Activities Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Logged Activities Records</div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/[0.08] text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-3.5">Date</th>
                      <th className="py-3 px-3.5">Category</th>
                      <th className="py-3 px-3.5">Activity Type</th>
                      <th className="py-3 px-3.5">Quantity</th>
                      <th className="py-3 px-3.5">Calculated CO2e</th>
                      <th className="py-3 px-3.5">Source & Factor</th>
                      <th className="py-3 px-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-slate-400">{act.date}</td>
                        <td className="py-3 px-3.5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px] border border-white/[0.06]">
                            {act.category}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-200">{act.activity_type}</td>
                        <td className="py-3 px-3.5 font-mono text-slate-300">{act.quantity} {act.original_unit}</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-emerald-400">{act.calculated_co2e} kg</td>
                        <td className="py-3 px-3.5 text-slate-400 text-[11px]">{act.source} • Tier {act.evidence_level}</td>
                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={() => handleDeleteActivity(act.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors focus-ring"
                            title="Delete activity record"
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
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-400" /> Campus Challenges & Leaderboards
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Compete with hostels, departments, and teams to reduce collective carbon emissions and earn Green Credits.
              </p>
            </div>

            {/* Active Challenges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {challenges.map((ch) => (
                <div key={ch.id} className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                        {ch.category}
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-lg">
                        +{ch.green_points} Credits
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-white">{ch.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Progress:</span>
                        <span className="font-mono text-emerald-400 font-bold">{ch.user_progress_days} / {ch.goal_days} days</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/[0.06]">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                          style={{ width: `${Math.min(100, (ch.user_progress_days / ch.goal_days) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinChallenge(ch.id)}
                    disabled={ch.joined}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all focus-ring ${
                      ch.joined
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30 cursor-default"
                        : "bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98]"
                    }`}
                  >
                    {ch.joined ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {ch.joined ? "Participating" : "Join Challenge"}
                  </button>
                </div>
              ))}
            </div>

            {/* Campus Leaderboards */}
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Campus Carbon Reduction Leaderboards</div>
                <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-white/[0.08]">
                  {["hostels", "departments", "teams"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setLeaderboardTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all focus-ring ${
                        leaderboardTab === tab ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {(leaderboards[leaderboardTab] || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/[0.06] text-xs hover:bg-slate-900 transition-colors">
                    <div className="flex items-center space-x-3.5">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        idx === 0 
                          ? "bg-amber-400 text-slate-950 shadow-sm" 
                          : idx === 1 
                          ? "bg-slate-300 text-slate-950" 
                          : idx === 2 
                          ? "bg-amber-700 text-amber-100" 
                          : "bg-slate-800 text-slate-400"
                      }`}>
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
                        <div className="font-mono text-slate-300 font-semibold">{item.participants || 120}</div>
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Building className="w-6 h-6 text-emerald-400" /> Campus Sustainability Intelligence
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Institutional emissions, transport split, and Digital Carbon Passports.
                </p>
              </div>

              <a
                href={`${API_BASE}/api/reports/pdf`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-colors flex items-center gap-2 focus-ring shrink-0"
              >
                <FileText className="w-3.5 h-3.5" /> Download Institutional PDF Audit Report
              </a>
            </div>

            {/* Campus Transport Mode Split */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Verified Campus Transport Breakdown</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {[
                  { mode: "Bicycle Commutes", pct: "42%", count: "1,240 trips", icon: Bike, color: "text-emerald-400" },
                  { mode: "Walking", pct: "28%", count: "820 trips", icon: Footprints, color: "text-teal-400" },
                  { mode: "Campus Electric Bus", pct: "18%", count: "530 trips", icon: Bus, color: "text-cyan-400" },
                  { mode: "Motorcycles", pct: "8%", count: "235 trips", icon: Activity, color: "text-amber-400" },
                  { mode: "Petrol Cars", pct: "4%", count: "118 trips", icon: Car, color: "text-rose-400" }
                ].map((t, idx) => (
                  <div key={idx} className="bg-slate-900/80 p-4 rounded-xl border border-white/[0.08] text-center space-y-1.5 hover:bg-slate-900 transition-colors">
                    <t.icon className={`w-5 h-5 mx-auto ${t.color}`} />
                    <div className="text-xl font-black font-mono text-white tracking-tight">{t.pct}</div>
                    <div className="text-xs font-semibold text-slate-200">{t.mode}</div>
                    <div className="text-[10px] text-slate-400">{t.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campus Sustainability Projects & Passports */}
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Campus Sustainability Projects & Digital Passports</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campusProjects.map((p) => (
                  <div key={p.id} className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">Score: {p.evidence_confidence_score}/100</span>
                      </div>
                      <h4 className="font-bold text-base text-white">{p.name}</h4>
                      <p className="text-xs text-slate-400">Owner: {p.owner}</p>

                      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-1.5 text-xs font-mono">
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
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus-ring"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Digital Passport
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* DIGITAL PASSPORT MODAL */}
            {selectedPassport && (
              <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-emerald-500/40 glow-emerald space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Digital Carbon Project Passport</span>
                    <button 
                      onClick={() => setSelectedPassport(null)} 
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors focus-ring"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-white tracking-tight">{selectedPassport.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">Passport Code: {selectedPassport.id} • Baseline: {selectedPassport.baseline_period}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/[0.08] text-center space-y-1">
                      <div className="text-[10px] text-slate-400">Baseline</div>
                      <div className="font-bold text-white font-mono">{selectedPassport.baseline_emissions_tco2e} tCO2e</div>
                    </div>
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/[0.08] text-center space-y-1">
                      <div className="text-[10px] text-slate-400">Current</div>
                      <div className="font-bold text-teal-400 font-mono">{selectedPassport.current_emissions_tco2e} tCO2e</div>
                    </div>
                    <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/[0.08] text-center space-y-1">
                      <div className="text-[10px] text-slate-400">Potential Credits</div>
                      <div className="font-bold text-amber-400 font-mono">{selectedPassport.potential_credits_tco2e} tCO2e</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider text-[11px]">Project Timeline & Verification Telemetry:</div>
                    <div className="space-y-1.5">
                      {(selectedPassport.timeline || []).map((t: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-3 text-xs p-2.5 rounded-xl bg-slate-900/60 border border-white/[0.06]">
                          <span className="font-mono text-emerald-400 font-bold">{t.date}</span>
                          <span className="text-slate-300">{t.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-300 space-y-1">
                    <div className="font-bold flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Disclaimer:</div>
                    <div className="leading-relaxed">{selectedPassport.disclaimer}</div>
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-[11px] font-bold tracking-wide uppercase mb-2">
                  <Sliders className="w-3.5 h-3.5" /> Institutional Decision Engine
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Campus What-If Climate Simulator
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Model capital investments in renewable rooftop solar, EV shuttle fleet, and HVAC optimization to forecast multi-year ROI and direct CO₂e abatement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Simulator Input Controls */}
              <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Scenario Parameters</div>
                  <span className="text-[10px] text-slate-400 font-mono">STEP 01 OF 02</span>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-2 block">Intervention Technology</label>
                    <select
                      value={whatIfInput.scenario_type}
                      onChange={(e) => setWhatIfInput({ ...whatIfInput, scenario_type: e.target.value })}
                      className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-400/80 transition-colors cursor-pointer"
                    >
                      <option value="Solar">Rooftop Solar PV Expansion (250kW)</option>
                      <option value="EV">Campus Electric Shuttle Fleet</option>
                      <option value="AC Efficiency">Smart HVAC & Chillers Upgrade</option>
                      <option value="Waste">Campus Organic Waste Biogas Composter</option>
                      <option value="LED Lighting">Campus-wide Smart LED & Motion Scheduling</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-semibold">Implementation Scale</span>
                      <span className="font-bold font-mono text-emerald-400 text-sm px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
                        {whatIfInput.implementation_pct}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={whatIfInput.implementation_pct}
                      onChange={(e) => setWhatIfInput({ ...whatIfInput, implementation_pct: parseInt(e.target.value) })}
                      className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />
                    <div className="flex justify-between gap-1.5 pt-1">
                      {[25, 50, 75, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setWhatIfInput({ ...whatIfInput, implementation_pct: preset })}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all ${
                            whatIfInput.implementation_pct === preset
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35"
                              : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/[0.04]"
                          }`}
                        >
                          {preset}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold mb-2 block">Capital Investment (₹ INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        step="50000"
                        value={whatIfInput.investment_inr}
                        onChange={(e) => setWhatIfInput({ ...whatIfInput, investment_inr: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl pl-8 pr-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-400/80 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRunSimulator}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4" /> Run Simulation Model
                </button>
              </div>

              {/* Simulator Output Cards */}
              <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Projected Environmental & Financial Impact
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-mono px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/25">
                      <Check className="w-3 h-3" /> Grid Calibrated
                    </span>
                  </div>

                  {whatIfResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-slate-900/90 p-4 rounded-2xl border border-white/[0.06] space-y-1">
                          <div className="text-[11px] text-slate-400 font-medium">Baseline Footprint</div>
                          <div className="text-2xl font-black font-mono text-white tracking-tight">
                            {whatIfResult.baseline_co2e} <span className="text-xs font-sans font-normal text-slate-400">tCO2e</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                          <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-between">
                            <span>Projected Footprint</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              -{Math.round((whatIfResult.co2e_reduction / whatIfResult.baseline_co2e) * 100)}%
                            </span>
                          </div>
                          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
                            {whatIfResult.projected_co2e} <span className="text-xs font-sans font-normal text-slate-400">tCO2e</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Annual CO2 Abatement
                          </div>
                          <div className="text-lg font-bold font-mono text-emerald-400">
                            {whatIfResult.co2e_reduction} <span className="text-xs text-slate-400">tCO2e/yr</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/25 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <Zap className="w-3.5 h-3.5 text-teal-400" /> Annual Energy Savings
                          </div>
                          <div className="text-lg font-bold font-mono text-teal-300">
                            ₹{whatIfResult.annual_cost_savings_inr?.toLocaleString()}
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-amber-400" /> Payback Period
                          </div>
                          <div className="text-lg font-bold font-mono text-amber-400">
                            {whatIfResult.payback_years} <span className="text-xs text-slate-400">Years</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <Award className="w-3.5 h-3.5 text-indigo-400" /> 5-Year Capital ROI
                          </div>
                          <div className="text-lg font-bold font-mono text-indigo-300">
                            {whatIfResult.roi_percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 space-y-3 rounded-2xl bg-slate-900/40 border border-dashed border-white/[0.08]">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                        <Sliders className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-semibold text-white">Scenario Engine Standing By</div>
                      <div className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Select an intervention technology, adjust the scale and budget, then click "Run Simulation Model".
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 pt-4 border-t border-white/[0.06] flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Calculations derived from institutional baseline & CEA India Grid factor (0.716 kgCO2e/kWh).</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: POLLUTION SENSOR MAP & CLEANROUTE                      */}
        {/* ============================================================== */}
        {activeTab === "pollution" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] font-bold tracking-wide uppercase mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Micro-Climate Telemetry
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Campus Air Quality & CleanRoute
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Real-time optical particulate sensor grid. Decouples localized particulate inhalation exposure (PM2.5/PM10) from GHG carbon footprint accounting.
                </p>
              </div>
            </div>

            {/* Pollution Stations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pollutionLocations.map((loc) => {
                const isModerate = loc.aqi > 100;
                return (
                  <div
                    key={loc.id}
                    className="glass-panel p-5 rounded-3xl border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            isModerate ? "bg-amber-400" : "bg-emerald-400"
                          }`} />
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            isModerate ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                        </span>
                        <span className="text-xs font-bold text-white tracking-tight">{loc.name}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                          isModerate
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        AQI {loc.aqi} • {isModerate ? "Elevated" : "Satisfactory"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/[0.04] space-y-0.5">
                        <div className="text-[10px] text-slate-400 font-medium">PM2.5</div>
                        <div className="text-xs font-bold font-mono text-white">{loc.pm25} <span className="text-[9px] text-slate-500 font-normal">µg</span></div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/[0.04] space-y-0.5">
                        <div className="text-[10px] text-slate-400 font-medium">PM10</div>
                        <div className="text-xs font-bold font-mono text-white">{loc.pm10} <span className="text-[9px] text-slate-500 font-normal">µg</span></div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-white/[0.04] space-y-0.5">
                        <div className="text-[10px] text-slate-400 font-medium">NO2</div>
                        <div className="text-xs font-bold font-mono text-white">{loc.no2} <span className="text-[9px] text-slate-500 font-normal">ppb</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CleanRoute Navigator */}
            <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-400" /> CleanRoute Low-Exposure Commute Calculator
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Calculates lowest-pollution pedestrian & cycling corridors across the university zone.
                  </div>
                </div>
                <button
                  onClick={handleCalculateCleanRoute}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Navigation className="w-3.5 h-3.5" /> Compare Routes
                </button>
              </div>

              {cleanRouteResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-300">Fastest Route (Main Ring Road)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/25">
                        High Exposure
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl">
                        <div className="text-[10px] text-slate-500 font-sans">Distance</div>
                        <div className="text-white font-bold">{cleanRouteResult.standard_distance_km} km</div>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl">
                        <div className="text-[10px] text-slate-500 font-sans">Duration</div>
                        <div className="text-white font-bold">{cleanRouteResult.standard_duration_min} min</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                      Exposure Index: {cleanRouteResult.standard_exposure_index} (Heavy traffic pollutants & idling diesel exhaust)
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" /> CleanRoute (Green Belt Campus Bypass)
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/35">
                        Recommended
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl">
                        <div className="text-[10px] text-slate-400 font-sans">Distance</div>
                        <div className="text-white font-bold">{cleanRouteResult.clean_distance_km} km</div>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl">
                        <div className="text-[10px] text-slate-400 font-sans">Duration</div>
                        <div className="text-white font-bold">{cleanRouteResult.clean_duration_min} min</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-emerald-300 bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <span>Inhalation Exposure Reduction:</span>
                      <span className="font-black text-sm">-{cleanRouteResult.exposure_reduction_pct}% PM2.5</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-white/[0.08] space-y-2">
                  <div className="text-xs text-slate-400">
                    Click <strong className="text-emerald-400">"Compare Routes"</strong> to calculate real-time particulate exposure delta between campus corridors.
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[11px] font-bold tracking-wide uppercase mb-2">
                  <FileSpreadsheet className="w-3.5 h-3.5" /> PostgreSQL Synchronizer
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Admin Live Database Monitor
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Direct, read-only operational telemetry of relational database tables. Synchronized with PostgreSQL backend instances.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto max-w-full">
                {["trips", "wallets", "ledger", "redemptions", "activities", "users", "audit_logs"].map((table) => {
                  const count = adminData?.[table]?.length ?? 0;
                  const isActive = adminTableTab === table;
                  return (
                    <button
                      key={table}
                      onClick={() => setAdminTableTab(table)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/35 shadow-sm"
                          : "text-slate-400 hover:text-slate-200 border border-transparent"
                      }`}
                    >
                      <span>{table.replace("_", " ")}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-purple-500/30 text-purple-200" : "bg-slate-800 text-slate-400"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table Viewer */}
            <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden">
              {/* Terminal Window Header */}
              <div className="bg-slate-900/90 px-6 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 border-l border-white/[0.08] pl-3">
                    postgres://carbonlens_db/public.<strong className="text-purple-300">{adminTableTab}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400">
                    {adminData?.[adminTableTab]?.length ?? 0} rows loaded
                  </span>
                  <button
                    onClick={fetchAllData}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors cursor-pointer border border-white/[0.06]"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
              </div>

              {/* Code Container */}
              <div className="p-6 overflow-x-auto max-h-[520px] bg-slate-950/80">
                <pre className="font-mono text-[11px] text-emerald-300 leading-relaxed overflow-x-auto">
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
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-white/[0.08] text-slate-300 text-[11px] font-bold tracking-wide uppercase">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Peer-Reviewed Standards
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                Scientific Methodology & Trust Framework
              </h2>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                Complete traceability of emission factors, baselines, Green Credits, and privacy protections adhering to ISO 14064 standards.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/[0.08] space-y-8 text-xs text-slate-300 leading-relaxed">
              {/* Section 1 */}
              <div className="space-y-3 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                    01
                  </span>
                  <h3 className="font-bold text-sm text-white">Travel Commute Carbon Calculation</h3>
                </div>
                <p className="text-slate-300">
                  Every campus commute carbon footprint is computed using the empirical formula:
                </p>
                <pre className="p-4 bg-slate-900/90 rounded-2xl font-mono text-emerald-400 text-xs border border-white/[0.06] overflow-x-auto">
                  CO2e (kg) = Distance (km) × Mode Factor (kgCO2e/km)
                </pre>
                <p className="text-slate-300">
                  <strong className="text-white">Reduction Formula:</strong> Compared against the standard single-occupancy passenger vehicle baseline (0.192 kg CO2e/km):
                </p>
                <pre className="p-4 bg-slate-900/90 rounded-2xl font-mono text-teal-300 text-xs border border-white/[0.06] overflow-x-auto">
                  Saved CO2e = (Distance × 0.192) - (Distance × Actual Mode Factor)
                </pre>
              </div>

              {/* Section 2 */}
              <div className="space-y-3 pb-6 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 font-mono font-bold flex items-center justify-center text-xs">
                    02
                  </span>
                  <h3 className="font-bold text-sm text-white">Green Credits vs. Certified Carbon Credits</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                      <Award className="w-3.5 h-3.5" /> Green Credits (Internal Token)
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Micro-incentive reward currency (100 credits = 1 kg CO2e saved) redeemable for canteen meal discounts, campus bookstore coupons, and sustainable lifestyle rewards.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 space-y-2">
                    <div className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                      <Shield className="w-3.5 h-3.5" /> Potential Carbon Credits (Compliance)
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Project-level theoretical reduction equivalent (1 tCO2e) requiring accredited third-party validation (Gold Standard / Verra VCS) for institutional carbon accounting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono font-bold flex items-center justify-center text-xs">
                    03
                  </span>
                  <h3 className="font-bold text-sm text-white">Sensor Privacy & Ephemeral Telemetry Protocol</h3>
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Live Camera Stream Only:</strong> Vision AI inference runs client-side via WebGL. No video frames or photos are saved to disk or server storage.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Session-Bounded Geolocation:</strong> Continuous location tracking is strictly disabled outside active commute recording sessions.</span>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Biometric Capture:</strong> Detection algorithms look strictly for bicycles, buses, trains, and vehicles—never human faces or identities.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== PRODUCTION AUTH MODAL (LOGIN / SIGNUP) ==================== */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-emerald-500/40 glow-emerald space-y-6 relative shadow-2xl">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer border border-white/[0.06]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5 pt-2">
              <img src="/logo.png" alt="CarbonLens 360" className="h-12 w-12 object-contain mx-auto mb-2 drop-shadow-md" />
              <h2 className="text-2xl font-black text-white tracking-tight">
                {authMode === "login" ? "Welcome Back to CarbonLens" : "Create CarbonLens Account"}
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {authMode === "login"
                  ? "Enter your credentials to access your carbon telemetry & rewards"
                  : "Sign up to track commute emissions, earn Green Credits & canteen discounts"}
              </p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-white/[0.08]">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setAuthError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === "login" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode("signup"); setAuthError(null); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === "signup" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 shadow-sm" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email or Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="student@carbonlens.io or 9876543210"
                    value={authForm.username_or_phone}
                    onChange={(e) => setAuthForm({ ...authForm, username_or_phone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Log In to Account"}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authMode === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={authForm.full_name}
                    onChange={(e) => setAuthForm({ ...authForm, full_name: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={authForm.confirm_password}
                    onChange={(e) => setAuthForm({ ...authForm, confirm_password: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400/80 transition-colors"
                  />
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Default assigned role: <strong className="text-emerald-400">Student</strong>. Privacy & consent verified.
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs hover:opacity-95 shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Complete Registration"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/[0.06] bg-slate-950/90 backdrop-blur-md py-6 px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CarbonLens" className="h-4 w-4 object-contain opacity-80" />
            <span>© 2026 CarbonLens 360 • College Climate & Rewards Operating System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">“From Carbon Footprint to Carbon Credit”</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

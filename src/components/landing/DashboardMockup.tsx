import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useInViewport from "@/hooks/useInViewport";
import { 
  LayoutDashboard, 
  Settings, 
  Map, 
  Truck, 
  Users, 
  DollarSign, 
  Calendar, 
  Search, 
  Bell, 
  CheckCircle2, 
  Compass, 
  Play, 
  FileText, 
  ChevronRight, 
  Pause, 
  ChevronLeft, 
  Building, 
  Plus 
} from "lucide-react";

// Mock data lists for dashboard sub-views mapping
const DASHBOARD_LIVE_TRACKS = [
  {
    route: "Delhi ➔ Greater Mumbai",
    status: "In Transit",
    progress: 52,
    origin: "DELHI",
    destination: "MUMBAI",
    truckNo: "MH-01-AB-1234",
    driver: "Rajesh Kumar",
    eta: "3.5h",
    statusType: "transit"
  },
  {
    route: "Ambala ➔ Cochin",
    status: "In Transit",
    progress: 84,
    origin: "AMBALA",
    destination: "COCHIN",
    truckNo: "HR-02-CD-5678",
    driver: "Suresh Singh",
    eta: "3.2h",
    statusType: "transit"
  }
] as const;

const VEHICLES_DUMMY_DATA = [
  { id: "MH-01-AB-1234", model: "Tata Signa 5530.S (Trailer)", status: "In Transit", statusColor: "emerald" },
  { id: "HR-02-CD-5678", model: "Ashok Leyland 4825 (Cargo)", status: "In Transit", statusColor: "emerald" },
  { id: "MH-05-IJ-7890", model: "BharatBenz 3523R (Tipper)", status: "Delayed", statusColor: "amber" },
  { id: "DL-01-EF-9012", model: "Eicher Pro 6028 (Container)", status: "Workshop", statusColor: "destructive" },
  { id: "KA-03-GH-3456", model: "Mahindra Blazo X 49 (Trailer)", status: "Standby", statusColor: "primary" }
] as const;

const DRIVERS_DUMMY_DATA = [
  { name: "Rajesh Kumar", exp: "8 Yrs", route: "Delhi ➔ Mumbai", status: "On Duty", statusColor: "emerald" },
  { name: "Suresh Singh", exp: "12 Yrs", route: "Ambala ➔ Cochin", status: "On Duty", statusColor: "emerald" },
  { name: "Rahul Sharma", exp: "6 Yrs", route: "Mumbai ➔ Pune", status: "On Duty", statusColor: "emerald" },
  { name: "Amit Verma", exp: "10 Yrs", route: "Delhi ➔ Jaipur", status: "Available", statusColor: "primary" },
  { name: "Vikram Rathore", exp: "15 Yrs", route: "Mumbai ➔ Bangalore", status: "On Leave", statusColor: "slate" }
] as const;

const EXPENSES_DUMMY_DATA = [
  { id: "EXP-8902", type: "Fuel Advance", entity: "MH-01-AB-1234", amount: 145000, date: "Jun 14, 2026", status: "Paid", statusColor: "emerald" },
  { id: "EXP-8903", type: "Toll Charges", entity: "Fastag Auto-debit", amount: 8500, date: "Jun 14, 2026", status: "Paid", statusColor: "emerald" },
  { id: "EXP-8904", type: "Driver Allowance", entity: "Rajesh Kumar", amount: 12000, date: "Jun 15, 2026", status: "Pending", statusColor: "amber" },
  { id: "EXP-8905", type: "Maintenance Repair", entity: "DL-01-EF-9012", amount: 38000, date: "Jun 16, 2026", status: "Paid", statusColor: "emerald" }
] as const;

const PLACES_CATEGORIES = [
  {
    id: "plants",
    label: "Plants",
    color: "slate",
    count: 40,
    items: [
      { id: "1", name: "DELHI PLANT", address: "Okhla Industrial Area Phase 3, New Delhi" },
      { id: "2", name: "MUMBAI WAREHOUSE", address: "Taloja MIDC, Navi Mumbai, Maharashtra" },
      { id: "3", name: "CHENNAI HUB", address: "Sriperumbudur Industrial Park, Chennai" }
    ]
  },
  {
    id: "offices",
    label: "Offices",
    color: "amber",
    count: 2,
    items: [
      { id: "1", name: "BINOLA", address: "BINOLA, HARYANA 122413" },
      { id: "2", name: "AML ABR", address: "Ambala, Haryana, India" }
    ]
  },
  { id: "consignees", label: "Consignees", color: "indigo", count: 0, items: [] },
  { id: "consignors", label: "Consignors", color: "emerald", count: 0, items: [] },
  { id: "otherPlaces", label: "Other places", color: "blue", count: 0, items: [] }
] as const;

type TabType = "dashboard" | "operations" | "trips" | "expenses" | "vehicles" | "drivers" | "master-data";

const TABS_ORDER: TabType[] = [
  "dashboard",
  "operations",
  "expenses",
  "trips",
  "vehicles",
  "drivers",
  "master-data"
];

const DashboardMockup: React.FC = () => {
  const { ref: dashboardRef, isInViewport } = useInViewport<HTMLDivElement>();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [placesViewMode, setPlacesViewMode] = useState<"Table" | "Map">("Map");
  const [expandedAccordions, setExpandedAccordions] = useState<Record<string, boolean>>({
    plants: false,
    offices: true,
    consignees: false,
    consignors: false,
    otherPlaces: false
  });

  const [tripsSubTab, setTripsSubTab] = useState<"tracking" | "itinerary" | "details">("itinerary");
  const [playbackPercent, setPlaybackPercent] = useState<number>(52);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Playback timer effect for live animated routing tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInViewport && isPlaying && activeTab === "trips") {
      interval = setInterval(() => {
        setPlaybackPercent(prev => (prev >= 100 ? 0 : prev + 1));
      }, 180);
    }
    return () => clearInterval(interval);
  }, [isInViewport, isPlaying, activeTab]);

  // Autoplay effect to cycle/switch tabs/modules every 6 seconds when not hovered
  useEffect(() => {
    if (!isInViewport || isHovered) return;

    const interval = setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = TABS_ORDER.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % TABS_ORDER.length;
        return TABS_ORDER[nextIndex];
      });
    }, 4000); // cycle every 4 seconds

    return () => clearInterval(interval);
  }, [isHovered, isInViewport]);

  // Route point coordinate percentages mapped onto the detailed India SVG container
  const routePoints = [
    { x: 160, y: 358 }, // Mumbai (Origin)
    { x: 165, y: 310 }, // Surat (Stop)
    { x: 180, y: 260 }, // Udaipur (Active Target)
    { x: 215, y: 230 }, // Jaipur (Next Target)
    { x: 248, y: 212 }  // New Delhi (Destination)
  ];

  const getPlaybackCoords = (percent: number) => {
    const totalPoints = routePoints.length;
    if (totalPoints === 0) return { x: 0, y: 0 };
    if (totalPoints === 1) return routePoints[0];
    
    const segmentLength = 100 / (totalPoints - 1);
    const segmentIndex = Math.min(
      Math.floor(percent / segmentLength),
      totalPoints - 2
    );
    
    const start = routePoints[segmentIndex];
    const end = routePoints[segmentIndex + 1];
    const segmentPercent = (percent % segmentLength) / segmentLength;
    
    return {
      x: start.x + (end.x - start.x) * segmentPercent,
      y: start.y + (end.y - start.y) * segmentPercent
    };
  };

  // Generate current week dates dynamically starting from Sunday
  const getWeekDays = () => {
    const current = new Date();
    const day = current.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const subs = [
      "40 pl / 17 ac",
      "40 pl / 10 ac",
      "41 pl / 21 ac",
      "40 pl / 19 ac",
      "40 pl / 0 ac",
      "40 pl / --",
      "40 pl / --"
    ];
    
    return Array.from({ length: 7 }).map((_, i) => {
      const diff = i - day;
      const date = new Date(current);
      date.setDate(current.getDate() + diff);
      return {
        day: `${dayNames[i]} ${date.getDate()}`,
        sub: subs[i]
      };
    });
  };

  const weekDays = getWeekDays();
  const currentDayIdx = new Date().getDay();

  const truckCoords = getPlaybackCoords(playbackPercent);

  const toggleAccordion = (category: string) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Dynamic sums for Expenses tab calculated from mapped dummy data
  const totalPlanned = EXPENSES_DUMMY_DATA.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = EXPENSES_DUMMY_DATA.filter(item => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const totalPending = EXPENSES_DUMMY_DATA.filter(item => item.status === "Pending").reduce((sum, item) => sum + item.amount, 0);

  // Dynamic metrics for Vehicles derived from VEHICLES_DUMMY_DATA
  const totalFleet = VEHICLES_DUMMY_DATA.length;
  const activeVehicles = VEHICLES_DUMMY_DATA.filter(v => v.status === "In Transit" || v.status === "Delayed").length;
  const workshopVehicles = VEHICLES_DUMMY_DATA.filter(v => v.status === "Workshop").length;
  const standbyVehicles = VEHICLES_DUMMY_DATA.filter(v => v.status === "Standby").length;

  // Dynamic metrics for Drivers derived from DRIVERS_DUMMY_DATA
  const totalDrivers = DRIVERS_DUMMY_DATA.length;
  const activeDrivers = DRIVERS_DUMMY_DATA.filter(d => d.status === "On Duty").length;
  const availableDrivers = DRIVERS_DUMMY_DATA.filter(d => d.status === "Available").length;
  const leaveDrivers = DRIVERS_DUMMY_DATA.filter(d => d.status === "On Leave").length;

  const currentIndex = TABS_ORDER.indexOf(activeTab);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveTab(TABS_ORDER[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < TABS_ORDER.length - 1) {
      setActiveTab(TABS_ORDER[currentIndex + 1]);
    }
  };

  return (
    <div
      ref={dashboardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full bg-[#f4f5f8] dark:bg-[#0e111a] text-slate-800 dark:text-slate-200 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 font-sans text-[11px] sm:text-xs select-none"
    >
      <div className="flex h-[460px] sm:h-[510px] md:h-[550px]">
        
        {/* Left Sidebar */}
        <div className="hidden md:flex flex-col w-44 bg-[#5b4dd3] dark:bg-[#151726] text-white p-3 shrink-0 justify-between border-r border-slate-200 dark:border-slate-800/50">
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-0.5 shadow-sm">
                <img src="/favicon.png" alt="logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold tracking-tight text-sm">Fleetcodes</span>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "dashboard" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("operations")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "operations" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Operations</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("expenses")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "expenses" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Expenses</span>
              </button>

              <button 
                onClick={() => setActiveTab("trips")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "trips" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Trips</span>
              </button>

              <button 
                onClick={() => setActiveTab("vehicles")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "vehicles" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Vehicles</span>
              </button>

              <button 
                onClick={() => setActiveTab("drivers")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "drivers" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Drivers</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("master-data")}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left font-medium transition-colors ${
                  activeTab === "master-data" 
                    ? "bg-white/15 dark:bg-primary/25 text-white" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Geo Zone</span>
              </button>
            </nav>
          </div>

          <div className="space-y-2 border-t border-white/10 dark:border-slate-800/80 pt-2">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </div>
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold">SM</div>
              <div className="truncate text-[10px] opacity-80">Siddharth M.</div>
            </div>
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          {/* Header */}
          <header className="h-11 sm:h-12 bg-white dark:bg-[#151726]/60 border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="font-semibold text-[11px] sm:text-xs md:text-sm text-slate-900 dark:text-white capitalize">
                {activeTab === "dashboard" && "Operations Dashboard"}
                {activeTab === "operations" && "Departure Management"}
                {activeTab === "expenses" && "Expense Management"}
                {activeTab === "trips" && "Trip Tracking — ABRTRIP002315"}
                {activeTab === "vehicles" && "Fleet Management — Vehicles"}
                {activeTab === "drivers" && "Personnel Directory — Drivers"}
                {activeTab === "master-data" && "Place"}
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-[#948cf4] text-[8px] font-semibold">
                Live
              </span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search trips, trucks..." 
                  className="w-36 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 rounded-lg pl-8 pr-3 py-1 text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none"
                  readOnly
                />
              </div>

              {/* Action Button */}
              {activeTab === "dashboard" && (
                <button className="bg-[#5b4dd3] dark:bg-primary text-white font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] flex items-center gap-1 hover:opacity-90 shadow-sm transition-opacity">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Generate Plan</span>
                </button>
              )}

              {/* Geo Zone specific button */}
              {activeTab === "master-data" && (
                <button className="bg-[#5b4dd3] dark:bg-primary text-white font-medium px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] flex items-center gap-1 hover:opacity-90 shadow-sm">
                  <Plus className="w-3 h-3" />
                  <span>New Place</span>
                </button>
              )}

              {/* Moon icon / theme toggle and notification */}
              <div className="flex items-center gap-1.5">
                <div className="relative p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-destructive rounded-full" />
                </div>
              </div>
            </div>
          </header>

          {/* Quick Mobile Navigation Bar (Scrollable on Mobile) */}
          <div className="md:hidden flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151726]/40 p-1 shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
            {TABS_ORDER.map(tabId => {
              const labelMap: Record<TabType, string> = {
                dashboard: "Dashboard",
                operations: "Operations",
                trips: "Trips",
                expenses: "Expenses",
                vehicles: "Vehicles",
                drivers: "Drivers",
                "master-data": "Geo Zone"
              };
              return (
                <button 
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-3 py-1 text-[10px] font-semibold rounded shrink-0 transition-colors ${activeTab === tabId ? "bg-[#5b4dd3]/10 text-[#5b4dd3] dark:text-[#948cf4]" : "text-slate-500"}`}
                >
                  {labelMap[tabId]}
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Area */}
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 overflow-y-auto flex flex-col justify-between">
            
            <div className="relative flex-grow min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="space-y-3 sm:space-y-4 w-full"
                >
              {/* VIEW 1: DASHBOARD */}
              {activeTab === "dashboard" && (
                <>
                  {/* KPI Cards Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    <div className="bg-white dark:bg-[#151726]/80 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm">
                      <div className="text-[9px] text-slate-400 font-medium">Planned Trips</div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">281</div>
                      <div className="text-[8px] text-primary dark:text-[#948cf4] mt-0.5 font-medium">67 actual</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm">
                      <div className="text-[9px] text-slate-400 font-medium">Going to Depart</div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">223</div>
                      <div className="text-[8px] text-amber-500 mt-0.5 font-medium">120 scheduled</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm">
                      <div className="text-[9px] text-slate-400 font-medium">In Transit</div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">54</div>
                      <div className="text-[8px] text-emerald-500 mt-0.5 font-medium">Live tracking</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm">
                      <div className="text-[9px] text-slate-400 font-medium">Delayed Trips</div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">12</div>
                      <div className="text-[8px] text-destructive mt-0.5 font-medium">Requires action</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 sm:p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm col-span-3 sm:col-span-1">
                      <div className="text-[9px] text-slate-400 font-medium">Completed</div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">189</div>
                      <div className="text-[8px] text-emerald-500 mt-0.5 font-medium">98.1% on-time</div>
                    </div>
                  </div>

                  {/* Operational Dispatch View Section */}
                  <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm min-h-[220px] sm:min-h-[260px] md:min-h-[285px]">
                    <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                      <div className="font-semibold text-slate-900 dark:text-white text-[10px] sm:text-xs">
                        Operational Dispatch View — Live Active Tracks
                      </div>
                      <div className="text-[8px] sm:text-[9px] text-slate-400">
                        Click sidebar tabs or buttons below to navigate
                      </div>
                    </div>

                    <div className="p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/50">
                      {DASHBOARD_LIVE_TRACKS.map((track, idx) => (
                        <div key={idx} className="py-2.5 flex items-center gap-3">
                          <div className="w-20 sm:w-28 shrink-0">
                            <div className="font-semibold text-slate-900 dark:text-white text-[10px] sm:text-[11px] truncate">{track.route}</div>
                            <div className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5 font-medium">Trip status: Loading</div>
                          </div>
                          
                          <div className="flex-1 min-w-[80px] px-1 relative">
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full relative">
                              <div className="absolute left-0 top-0 bottom-0 bg-[#5b4dd3] dark:bg-primary rounded-full transition-all" style={{ width: `${track.progress}%` }}>
                                <div className={`absolute -right-2 -top-1.5 w-[14px] h-[14px] bg-white dark:bg-slate-900 rounded-full flex items-center justify-center border border-[#5b4dd3] dark:border-primary shadow-sm ${idx === 0 ? "animate-pulse" : ""}`}>
                                  <Truck className="w-[8px] h-[8px] text-[#5b4dd3] dark:text-primary fill-current" />
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between text-[7px] sm:text-[8px] text-slate-400 mt-1">
                              <span>{track.origin}</span>
                              <span>{track.progress}% completed</span>
                              <span>{track.destination}</span>
                            </div>
                          </div>

                          <div className="hidden lg:block w-36 text-slate-500 dark:text-slate-400 pl-4 border-l border-slate-100 dark:border-slate-800/60">
                            <div className="font-medium text-[9px] text-slate-700 dark:text-slate-300">Truck: {track.truckNo}</div>
                            <div className="text-[8px] mt-0.5">Driver: {track.driver}</div>
                          </div>
                          
                          <div className="shrink-0 text-right">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-semibold">
                              <CheckCircle2 className="w-2 h-2 fill-current" />
                              {track.status}
                            </span>
                            <div className="text-[8px] sm:text-[9px] text-slate-400 mt-0.5">ETA: {track.eta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 2: OPERATIONS */}
              {activeTab === "operations" && (
                <>
                  {/* Operations KPI row */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">Planned Trips</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">40</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">Going to Depart</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">27</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">On-Time</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">8 <span className="text-[7px] text-slate-400 font-normal">Trips</span></div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">Delayed</div>
                      <div className="text-xs sm:text-sm font-bold text-amber-500 mt-0.5">27</div>
                    </div>
                  </div>

                  {/* Operations Gantt-style Grid */}
                  <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 flex-1 h-[250px] sm:h-[300px] md:h-[330px] overflow-hidden flex flex-col shadow-sm">
                    {/* Days Column Header Grid */}
                    <div className="grid grid-cols-8 bg-slate-50 dark:bg-[#1f213a]/30 border-b border-slate-200 dark:border-slate-800 text-[8px] sm:text-[9px] text-center font-bold text-slate-800 dark:text-slate-300 shrink-0">
                      <div className="p-1.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-400">GMT+5:30</div>
                      {weekDays.map((d, index) => (
                        <div key={d.day} className={`p-1 flex flex-col justify-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${index === currentDayIdx ? "bg-[#5b4dd3]/5 text-[#5b4dd3] dark:text-[#948cf4]" : ""}`}>
                          <span className="font-semibold text-[8px] sm:text-[9px]">{d.day}</span>
                          <span className="text-[6.5px] text-slate-400 font-normal leading-tight">{d.sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Calendar Matrix Rows */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50 relative">
                      {[
                        { hour: "01:00", sun: "", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "" },
                        { hour: "02:00", sun: "orange", mon: "orange", tue: "orange", wed: "orange", thu: "blue", fri: "blue", sat: "blue" },
                        { hour: "04:00", sun: "", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "" },
                        { hour: "05:00", sun: "green", mon: "green", tue: "green", wed: "peach", thu: "blue_alt", fri: "blue_alt", sat: "blue_alt" },
                        { hour: "06:00", sun: "peach", mon: "peach", tue: "peach", wed: "peach", thu: "blue_alt", fri: "blue_alt", sat: "blue_alt" },
                        { hour: "07:00", sun: "peach", mon: "peach", tue: "peach", wed: "peach", thu: "blue_alt", fri: "blue_alt", sat: "blue_alt" }
                      ].map((row, idx) => (
                        <div key={row.hour} className="grid grid-cols-8 h-12 relative text-slate-400">
                          <div className="border-r border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center font-medium text-[8px] sm:text-[9px] bg-slate-50/50 dark:bg-slate-900/10 shrink-0">
                            {row.hour}
                          </div>

                          {Array.from({ length: 7 }).map((_, dayIdx) => {
                            const isToday = dayIdx === currentDayIdx;
                            let block = null;
                            if (row.hour === "02:00") {
                              const isPast = dayIdx < currentDayIdx;
                              block = (
                                <div className={`mx-0.5 p-1 rounded h-10 flex flex-col justify-between text-[7px] leading-tight border transition-transform hover:scale-105 cursor-pointer ${
                                  isPast 
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" 
                                    : "bg-[#5b4dd3]/10 border-[#5b4dd3]/20 text-[#5b4dd3] dark:text-[#948cf4]"
                                }`}>
                                  <span className="font-semibold truncate">DELHI</span>
                                  <span className="opacity-80">02:15</span>
                                </div>
                              );
                            } else if (row.hour === "05:00" && dayIdx < 3) {
                              block = (
                                <div className="mx-0.5 p-1 rounded h-20 absolute top-1 left-0 right-0 z-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex flex-col justify-between text-[7px] leading-tight hover:scale-[1.03] transition-transform cursor-pointer">
                                  <span className="font-semibold truncate">AMBALA</span>
                                  <div>
                                    <span className="block opacity-90 truncate">HR55AW80</span>
                                    <span className="opacity-80">04:30</span>
                                  </div>
                                </div>
                              );
                            } else if (row.hour === "05:00" && dayIdx === 3) {
                              block = (
                                <div className="mx-0.5 p-1 rounded h-16 absolute top-1 left-0 right-0 z-10 bg-pink-500/10 border border-pink-500/20 text-pink-700 dark:text-pink-400 flex flex-col justify-between text-[7px] leading-tight hover:scale-[1.03] transition-transform cursor-pointer">
                                  <span className="font-semibold truncate">AMB...</span>
                                  <span className="opacity-80">04:30</span>
                                </div>
                              );
                            } else if (row.hour === "05:00" && dayIdx >= 4) {
                              block = (
                                <div className="mx-0.5 p-1 rounded h-14 absolute top-1 left-0 right-0 z-10 bg-[#5b4dd3]/10 border border-[#5b4dd3]/20 text-[#5b4dd3] dark:text-[#948cf4] flex flex-col justify-between text-[7px] leading-tight hover:scale-[1.03] transition-transform cursor-pointer">
                                  <span className="font-semibold truncate">AMBALA</span>
                                  <span className="opacity-80">04:30</span>
                                </div>
                              );
                            } else if (row.hour === "07:00" && dayIdx < 4) {
                              block = (
                                <div className="mx-0.5 p-1 rounded h-7 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-between text-[7px] leading-tight hover:scale-105 transition-transform cursor-pointer">
                                  <span className="font-semibold truncate">HARI...</span>
                                  <span className="opacity-80 shrink-0">07:00</span>
                                </div>
                              );
                            }

                            return (
                              <div 
                                key={dayIdx} 
                                className={`border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative p-1 ${
                                  isToday ? "bg-[#5b4dd3]/5" : ""
                                }`}
                              >
                                {block}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 3: TRIPS */}
              {activeTab === "trips" && (
                <div className="flex flex-col h-[300px] sm:h-[350px] md:h-[385px] gap-3 text-slate-800 dark:text-slate-200">
                  {/* Trips Sub-tab header */}
                  <div className="flex justify-between items-center bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm shrink-0">
                    <div className="flex gap-1.5">
                      {([
                        { label: "Trip Tracking", value: "tracking" },
                        { label: "Trip Itinerary", value: "itinerary" },
                        { label: "Trip Details", value: "details" }
                      ] as const).map((tabObj) => {
                        const isActive = tripsSubTab === tabObj.value;
                        return (
                          <button
                            key={tabObj.value}
                            onClick={() => setTripsSubTab(tabObj.value)}
                            className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold transition-all ${
                              isActive 
                                ? "bg-[#5b4dd3]/10 text-[#5b4dd3] dark:text-[#948cf4]" 
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            }`}
                          >
                            {tabObj.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="text-[8px] sm:text-[9.5px] font-bold text-[#5b4dd3] dark:text-[#948cf4] uppercase tracking-wide">
                      ABRTRIP002315
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 flex-1 min-h-0 overflow-hidden">
                    {/* Left Column: Switchable Telemetry Panels */}
                    <div className="col-span-2 bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 p-3 overflow-y-auto relative shadow-sm">
                      
                      {/* Sub-tab 1: Trip Itinerary Timeline */}
                      {tripsSubTab === "itinerary" && (
                        <div className="space-y-3 relative">
                          <div className="absolute left-[9px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800/50" />
                          
                          {/* Node 1: Origin */}
                          <div className={`relative pl-5 space-y-0.5 transition-opacity duration-200 ${playbackPercent < 25 ? "opacity-100 font-semibold" : "opacity-75"}`}>
                            <div className={`absolute left-[4.5px] top-1.5 w-2 h-2 rounded-full border-2 bg-white dark:bg-slate-900 ${playbackPercent >= 25 ? "border-emerald-500 bg-emerald-500/10" : "border-primary bg-primary/20 animate-pulse"}`} />
                            <div className="flex justify-between text-[7px] text-slate-400 font-medium"><span>09:15 PM</span><span>Jun 13, 2026</span></div>
                            <div className="font-bold text-slate-900 dark:text-white text-[9px]">Origin (Starting Location)</div>
                            <div className="text-[7.5px] text-slate-500 dark:text-slate-400 leading-tight">Greater Indra Nagar, Zone 3, Mumbai Suburban, Maharashtra</div>
                          </div>

                          {/* Node 2: Stop */}
                          <div className={`relative pl-5 space-y-0.5 transition-opacity duration-200 ${playbackPercent >= 25 && playbackPercent < 50 ? "opacity-100 font-semibold" : "opacity-75"}`}>
                            <div className={`absolute left-[4.5px] top-1.5 w-2 h-2 rounded-full border-2 bg-white dark:bg-slate-900 ${playbackPercent >= 50 ? "border-emerald-500 bg-emerald-500/10" : playbackPercent >= 25 ? "border-destructive animate-pulse" : "border-slate-300 dark:border-slate-800"}`} />
                            <div className="flex justify-between text-[7px] text-slate-400 font-medium"><span>02:30 AM</span><span>Jun 14, 2026</span></div>
                            <div className="font-bold text-slate-900 dark:text-white text-[9px]">Stop (Transit Delay)</div>
                            <div className="text-[7.5px] text-slate-500 dark:text-slate-400 leading-tight">At rest area coordinates 21.1702, 72.8311 (Surat, Gujarat)</div>
                            {playbackPercent >= 25 && (
                              <div className="inline-block bg-destructive/10 border border-destructive/20 rounded px-1.5 py-0.2 text-[6.5px] text-destructive font-semibold">
                                Stop: 2h 19m
                              </div>
                            )}
                          </div>

                          {/* Node 3: Moving */}
                          <div className={`relative pl-5 space-y-0.5 transition-opacity duration-200 ${playbackPercent >= 50 && playbackPercent < 80 ? "opacity-100 font-semibold" : "opacity-75"}`}>
                            <div className={`absolute left-[4.5px] top-1.5 w-2 h-2 rounded-full border-2 bg-white dark:bg-slate-900 ${playbackPercent >= 80 ? "border-emerald-500 bg-emerald-500/10" : playbackPercent >= 50 ? "border-[#5b4dd3] dark:border-[#948cf4] animate-pulse" : "border-slate-300 dark:border-slate-800"}`} />
                            <div className="flex justify-between text-[7px] text-slate-400 font-medium"><span>04:49 AM</span><span>Jun 14, 2026</span></div>
                            <div className="font-bold text-slate-900 dark:text-white text-[9px]">Moving (In Transit)</div>
                            <div className="text-[7.5px] text-slate-500 dark:text-slate-400 leading-tight">Heading towards Udaipur-Rajasthan</div>
                            {playbackPercent >= 50 && (
                              <div className="grid grid-cols-2 gap-1 mt-1 text-[6.5px]">
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded border border-slate-200/50 dark:border-slate-800/50">
                                  Dist: <strong className="text-slate-700 dark:text-slate-300">{(634.5 * (playbackPercent / 100)).toFixed(1)} km</strong>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded border border-slate-200/50 dark:border-slate-800/50">
                                  Speed: <strong className="text-slate-700 dark:text-slate-300">{playbackPercent >= 25 && playbackPercent < 50 ? 0 : 58 + Math.floor(Math.sin(playbackPercent) * 6)} km/h</strong>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Node 4: Destination */}
                          <div className={`relative pl-5 space-y-0.5 transition-opacity duration-200 ${playbackPercent >= 80 ? "opacity-100 font-semibold" : "opacity-50"}`}>
                            <div className={`absolute left-[4.5px] top-1.5 w-2 h-2 rounded-full border-2 bg-white dark:bg-slate-900 ${playbackPercent >= 98 ? "border-emerald-500 bg-emerald-500/10" : "border-slate-300 dark:border-slate-800"}`} />
                            <div className="flex justify-between text-[7px] text-slate-400 font-medium"><span>03:15 PM</span><span>Jun 14, 2026</span></div>
                            <div className="font-bold text-slate-900 dark:text-white text-[9px]">Destination (New Delhi)</div>
                            <div className="text-[7.5px] text-slate-500 dark:text-slate-400 leading-tight">Okhla Industrial Area Phase 3, New Delhi</div>
                          </div>
                        </div>
                      )}

                      {/* Sub-tab 2: Trip Tracking live telemetry */}
                      {tripsSubTab === "tracking" && (
                        <div className="space-y-3 text-[9px] text-slate-700 dark:text-slate-300">
                          {/* Stats cards */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-lg flex items-center justify-between shadow-sm">
                              <div>
                                <div className="text-[7.5px] text-slate-400 uppercase font-semibold">Live Speed</div>
                                <div className="text-xs sm:text-sm font-bold text-primary dark:text-[#948cf4] mt-0.5">
                                  {playbackPercent >= 25 && playbackPercent < 50 ? 0 : 58 + Math.floor(Math.sin(playbackPercent) * 6)} <span className="text-[7.5px] font-normal text-slate-400">km/h</span>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 relative flex items-center justify-center">
                                <div className="absolute inset-0.5 rounded-full border-2 border-primary border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="text-[6px] font-bold">RPM</span>
                              </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-lg flex flex-col justify-between shadow-sm">
                              <div className="flex justify-between items-center text-[7.5px] text-slate-400 uppercase font-semibold">
                                <span>Signal Link</span>
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              </div>
                              <div className="flex items-center justify-between mt-1 text-[8px] font-semibold text-slate-600 dark:text-slate-300">
                                <span>✔ GPS Lock</span>
                                <span>✔ 5G Link</span>
                              </div>
                            </div>
                          </div>

                          {/* Telemetry charts */}
                          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 p-2 rounded-lg shadow-sm">
                            <div className="text-[7.5px] text-slate-400 uppercase font-semibold mb-1">Telemetry Profile (Last 4 Hours)</div>
                            <div className="h-16 w-full relative flex items-end">
                              <svg viewBox="0 0 200 60" className="w-full h-full text-primary/15 dark:text-primary/10 fill-current">
                                <path d="M 0,50 Q 15,30 30,45 T 60,25 T 90,48 T 120,15 T 150,38 T 180,20 T 200,32 L 200,60 L 0,60 Z" />
                                <path d="M 0,50 Q 15,30 30,45 T 60,25 T 90,48 T 120,15 T 150,38 T 180,20 T 200,32" fill="none" className="stroke-[#5b4dd3] dark:stroke-[#948cf4]" strokeWidth="1.5" />
                                {/* Pulsing ticker pointer */}
                                <circle cx={((playbackPercent / 100) * 200).toString()} cy={(30 + Math.sin(playbackPercent) * 8).toString()} r="3.5" className="fill-[#f07b13] stroke-white" strokeWidth="1.5" />
                              </svg>
                              <div className="absolute top-1 right-2 text-[7px] text-slate-400 font-semibold">Avg: 60.2 km/h</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-tab 3: Trip Details dispatch metadata */}
                      {tripsSubTab === "details" && (
                        <div className="bg-slate-50/50 dark:bg-slate-900/10 border border-slate-200/50 dark:border-slate-800/50 rounded-lg p-2.5 space-y-2 text-[8px] sm:text-[8.5px] text-slate-700 dark:text-slate-300">
                          <div className="border-b border-slate-200/50 dark:border-slate-800/50 pb-1.5 flex justify-between items-center">
                            <span className="font-bold uppercase tracking-wider text-[7.5px] text-slate-400">Cargo Manifest</span>
                            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-semibold text-[6.5px]">E-Way Bill Verified</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 leading-tight">
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">Vehicle Pilot</div>
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">MH-01-AB-1234</div>
                              <div className="text-slate-400 text-[7px]">Tata Signa 5530.S (Trailer)</div>
                            </div>
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">Driver Pilots</div>
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Rajesh Kumar</div>
                              <div className="text-slate-400 text-[7px]">Pilot Exp: 8 Years</div>
                            </div>
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">Origin Client</div>
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Acme Steel Corp</div>
                            </div>
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">Destination Hub</div>
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">Apex Logistics</div>
                            </div>
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">Consignment Load</div>
                              <div className="font-bold text-slate-800 dark:text-slate-200">32 Tons steel / ₹48.5L</div>
                            </div>
                            <div>
                              <div className="text-[7.5px] text-slate-400 font-semibold uppercase">E-Way Bill Code</div>
                              <div className="font-bold text-[#5b4dd3] dark:text-[#948cf4]">271048392011</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Premium Animated India Routing Map */}
                    <div className="col-span-3 bg-[#e6ebf4] dark:bg-[#111425] rounded-lg border border-slate-200 dark:border-slate-800/80 p-1 relative overflow-hidden flex flex-col justify-between shadow-inner">
                      
                      {/* SVG map visual */}
                      <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden h-full">
                        <svg viewBox="0 0 600 550" className="w-full h-full text-slate-200 dark:text-slate-800/30 fill-current select-none">
                          {/* Ocean background grid */}
                          <g className="stroke-slate-300/40 dark:stroke-slate-800/35" strokeWidth="0.5" strokeDasharray="3 3">
                            <line x1="0" y1="100" x2="600" y2="100" />
                            <line x1="0" y1="200" x2="600" y2="200" />
                            <line x1="0" y1="300" x2="600" y2="300" />
                            <line x1="0" y1="400" x2="600" y2="400" />
                            <line x1="0" y1="500" x2="600" y2="500" />
                            <line x1="100" y1="0" x2="100" y2="550" />
                            <line x1="200" y1="0" x2="200" y2="550" />
                            <line x1="300" y1="0" x2="300" y2="550" />
                            <line x1="400" y1="0" x2="400" y2="550" />
                            <line x1="500" y1="0" x2="500" y2="550" />
                          </g>

                          {/* Country Outlines */}
                          <path d="M 50,150 L 150,120 L 220,100 L 220,130 L 180,180 L 190,230 L 180,260 L 140,290 L 120,300 L 90,300 L 50,250 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />
                          <path d="M 290,180 L 390,210 L 375,230 L 280,200 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />
                          <path d="M 420,240 L 450,240 L 460,280 L 430,300 L 415,280 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />

                          {/* India Mainland outline */}
                          <path 
                            d="M 220,100 
                               C 225,80 235,50 250,30 
                               C 260,20 270,30 275,45 
                               C 280,55 275,70 272,85
                               C 270,95 285,95 290,100
                               C 295,105 295,115 290,120
                               C 285,125 280,125 275,130
                               C 270,135 272,142 278,145
                               C 285,150 295,145 300,150
                               C 305,155 310,165 312,175
                               C 314,185 300,185 290,180
                               C 280,175 282,195 280,200
                               C 278,205 320,220 375,230
                               C 385,232 390,220 395,215
                               C 400,210 405,215 410,220
                               C 415,225 418,230 420,240
                               C 415,245 412,250 410,255
                               C 408,260 405,270 408,275
                               C 412,280 415,278 418,280
                               C 422,282 425,290 422,295
                               C 420,300 435,295 440,300
                               C 445,305 450,295 455,302
                               C 460,310 465,330 460,340
                               C 455,350 450,345 445,350
                               C 440,355 435,360 432,365
                               C 430,370 425,360 420,355
                               C 415,350 410,342 405,340
                               C 400,338 395,335 390,330
                               C 385,325 380,318 375,320
                               C 370,322 368,310 365,305
                               C 362,300 360,290 355,288
                               C 350,286 345,280 340,282
                               C 335,284 330,285 328,280
                               C 325,275 320,278 315,275
                               C 310,272 305,268 300,270
                               C 295,272 290,280 288,290
                               C 285,300 290,310 292,320
                               C 294,330 300,340 305,350
                               C 310,360 315,370 318,380
                               C 320,390 315,405 310,420
                               C 305,435 300,450 292,465
                               C 285,480 275,495 270,510
                               C 268,515 265,510 262,500
                               C 259,490 258,480 256,470
                               C 254,460 250,450 248,440
                               C 246,430 244,420 242,410
                               C 240,400 238,390 235,380
                               C 232,370 230,360 228,350
                               C 225,340 222,330 220,320
                               C 218,310 215,300 212,290
                               C 210,280 205,275 200,270
                               C 195,265 190,260 185,255
                               C 180,250 175,245 170,240
                               C 165,235 160,230 155,228
                               C 150,226 145,225 140,228
                               C 135,230 132,235 130,240
                               C 128,245 125,242 122,238
                               C 120,234 118,228 116,220
                               C 114,212 120,205 125,200
                               C 130,195 138,190 145,185
                               C 152,180 160,175 165,170
                               C 170,165 175,160 178,155
                               C 180,150 185,145 188,140
                               C 190,135 192,130 195,125
                               C 198,120 205,115 210,110
                               C 215,105 218,102 220,100 Z"
                            className="fill-white dark:fill-[#151726] stroke-slate-300 dark:stroke-slate-800/80" 
                            strokeWidth="1.5" 
                          />

                          {/* Sri Lanka Tip */}
                          <path 
                            d="M 305,520
                               C 307,522 308,525 308,528
                               C 308,531 306,535 304,537
                               C 302,539 299,537 298,535
                               C 297,533 297,530 298,527
                               C 299,524 302,521 305,520 Z"
                            className="fill-white dark:fill-[#151726] stroke-slate-300 dark:stroke-slate-800/80" 
                            strokeWidth="1" 
                          />

                          {/* Scheduled / suggested route (dashed gray outline) */}
                          <path 
                            d="M 160,358 L 165,310 L 180,260 L 215,230 L 248,212" 
                            className="stroke-slate-400/50 dark:stroke-slate-700/60 fill-none" 
                            strokeWidth="2.5" 
                            strokeDasharray="4 4" 
                            strokeLinecap="round"
                          />

                          {/* Traversed route segments (glowing purple/indigo) dynamically drawn */}
                          {(() => {
                            const traversedPoints = [];
                            if (playbackPercent >= 0) traversedPoints.push({ x: 160, y: 358 });
                            if (playbackPercent >= 25) traversedPoints.push({ x: 165, y: 310 });
                            if (playbackPercent >= 50) traversedPoints.push({ x: 180, y: 260 });
                            if (playbackPercent >= 75) traversedPoints.push({ x: 215, y: 230 });
                            traversedPoints.push(truckCoords);

                            const dPath = traversedPoints.reduce(
                              (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
                              ""
                            );
                            return (
                              <path 
                                d={dPath} 
                                className="stroke-[#5b4dd3] dark:stroke-[#948cf4] fill-none" 
                                strokeWidth="3.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            );
                          })()}

                          {/* Route City Nodes Markers */}
                          {/* 1. Mumbai (Origin) */}
                          <circle cx="160" cy="358" r="4.5" className="fill-emerald-500 stroke-white" strokeWidth="1.5" />
                          {/* 2. Surat (Stop) */}
                          <circle cx="165" cy="310" r="4.5" className="fill-amber-500 stroke-white" strokeWidth="1.5" />
                          {/* 3. Udaipur (Active target) */}
                          <circle cx="180" cy="260" r="4.5" className="fill-primary stroke-white" strokeWidth="1.5" />
                          {/* 4. New Delhi (Destination) */}
                          <circle cx="248" cy="212" r="4.5" className="fill-[#5b4dd3] dark:fill-[#948cf4] stroke-white" strokeWidth="1.5" />

                          {/* City labels */}
                          <text x="115" y="362" className="text-[7.5px] font-bold fill-slate-700 dark:fill-slate-300">Mumbai</text>
                          <text x="128" y="313" className="text-[7px] fill-slate-500 dark:fill-slate-400">Surat</text>
                          <text x="190" y="264" className="text-[7.5px] font-bold fill-slate-700 dark:fill-slate-300">Udaipur</text>
                          <text x="255" y="215" className="text-[7.5px] font-bold fill-slate-700 dark:fill-slate-300">New Delhi</text>
                        </svg>

                        {/* Truck Icon dynamically positioned overlay matching truckCoords relative to SVG box coordinates */}
                        <div 
                          className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20 hover:scale-125 transition-transform"
                          style={{
                            top: `${((truckCoords.y / 550) * 100).toFixed(1)}%`,
                            left: `${((truckCoords.x / 600) * 100).toFixed(1)}%`
                          }}
                        >
                          <div className="w-5 h-5 rounded-full bg-[#f07b13] border border-white flex items-center justify-center shadow-lg relative">
                            <span className="absolute inset-0 rounded-full bg-[#f07b13] animate-ping opacity-45" />
                            <Truck className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                        </div>

                        {/* Floating legend overlay (top left) */}
                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-[#0e111a]/95 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg text-[6.5px] sm:text-[7.5px] space-y-0.5 shadow-sm text-slate-500 dark:text-slate-400 leading-tight">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-0.5 mb-0.5">Route Guide</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-slate-300 dark:bg-slate-700 inline-block" /> Suggested</div>
                          <div className="flex items-center gap-1.5"><span className="w-2 h-0.5 bg-primary dark:bg-[#948cf4] inline-block" /> Traversed</div>
                        </div>
                      </div>

                      {/* Playback Controls & Slider HUD */}
                      <div className="mt-1 bg-white dark:bg-[#0e111a]/85 border border-slate-200/50 dark:border-slate-800/50 px-2 py-1 rounded-lg flex items-center justify-between shrink-0 shadow-sm z-10 mx-1">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)} 
                          className="w-5 h-5 rounded-full bg-[#5b4dd3] dark:bg-primary text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                        >
                          {isPlaying ? <Pause className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
                        </button>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[8px] font-semibold flex-1 justify-end ml-4 select-none">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={playbackPercent}
                            onChange={(e) => setPlaybackPercent(parseInt(e.target.value))}
                            className="w-24 sm:w-28 accent-[#5b4dd3] dark:accent-[#948cf4] h-1 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer outline-none transition-colors"
                          />
                          <span className="w-6 text-right font-bold text-slate-700 dark:text-slate-300">{playbackPercent}%</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: EXPENSES */}
              {activeTab === "expenses" && (
                <>
                  <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800 pb-1">
                    {["Payment", "Trip", "Driver", "Vehicle", "Approval"].map((tabName, index) => (
                      <span key={tabName} className={`px-2 py-0.5 rounded text-[8px] font-semibold cursor-pointer ${index === 0 ? "bg-[#5b4dd3]/10 text-[#5b4dd3] dark:text-[#948cf4]" : "text-slate-400"}`}>
                        {tabName}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-[#151726]/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm text-center">
                      <div className="text-[8px] text-slate-400 font-medium">Total Planned</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{totalPlanned.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm text-center">
                      <div className="text-[8px] text-slate-400 font-medium">Total Paid</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{totalPaid.toLocaleString()}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm text-center">
                      <div className="text-[8px] text-slate-400 font-medium">Total Pending</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{totalPending.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden h-[190px] sm:h-[240px] md:h-[265px] overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[9px] sm:text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/30 text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800/80">
                            <th className="p-2">Expense ID</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Vehicle / Driver</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {EXPENSES_DUMMY_DATA.map((expense) => (
                            <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                              <td className="p-2 font-semibold text-slate-900 dark:text-white">{expense.id}</td>
                              <td className="p-2">{expense.type}</td>
                              <td className="p-2 text-slate-500">{expense.entity}</td>
                              <td className="p-2 font-semibold text-slate-900 dark:text-white">₹{expense.amount.toLocaleString()}</td>
                              <td className="p-2 text-slate-400">{expense.date}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded font-semibold text-[8px] ${
                                  expense.status === "Paid" 
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                }`}>
                                  {expense.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 5: VEHICLES */}
              {activeTab === "vehicles" && (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Total Fleet</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{totalFleet}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Active</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{activeVehicles}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">In Workshop</div>
                      <div className="text-xs font-bold text-destructive mt-0.5">{workshopVehicles}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Standby</div>
                      <div className="text-xs font-bold text-primary dark:text-[#948cf4] mt-0.5">{standbyVehicles}</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden h-[190px] sm:h-[240px] md:h-[265px] overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[9px] sm:text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/30 text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800/80">
                            <th className="p-2">Vehicle No</th>
                            <th className="p-2">Model & Type</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {VEHICLES_DUMMY_DATA.map((vehicle) => {
                            const statusBg = 
                              vehicle.statusColor === "emerald" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              vehicle.statusColor === "amber" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                              vehicle.statusColor === "destructive" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                              "bg-blue-500/10 text-blue-600 dark:text-blue-400";
                            return (
                              <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                <td className="p-2 font-semibold">{vehicle.id}</td>
                                <td className="p-2">{vehicle.model}</td>
                                <td className="p-2">
                                  <span className={`px-1.5 py-0.5 rounded font-semibold text-[8px] ${statusBg}`}>
                                    {vehicle.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 6: DRIVERS */}
              {activeTab === "drivers" && (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Total Pilots</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{totalDrivers}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Active</div>
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{activeDrivers}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Available</div>
                      <div className="text-xs font-bold text-primary dark:text-[#948cf4] mt-0.5">{availableDrivers}</div>
                    </div>
                    <div className="bg-white dark:bg-[#151726]/80 p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <div className="text-[8px] text-slate-400 font-medium">Leaves</div>
                      <div className="text-xs font-bold text-slate-500 mt-0.5">{leaveDrivers}</div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden h-[190px] sm:h-[240px] md:h-[265px] overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[9px] sm:text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/30 text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800/80">
                            <th className="p-2">Driver Name</th>
                            <th className="p-2">Exp</th>
                            <th className="p-2">Route</th>
                            <th className="p-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {DRIVERS_DUMMY_DATA.map((driver) => {
                            const statusBg = 
                              driver.statusColor === "emerald" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                              driver.statusColor === "primary" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                              "bg-slate-500/10 text-slate-600 dark:text-slate-400";
                            return (
                              <tr key={driver.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                                <td className="p-2 font-semibold">{driver.name}</td>
                                <td className="p-2 text-slate-500">{driver.exp}</td>
                                <td className="p-2">{driver.route}</td>
                                <td className="p-2">
                                  <span className={`px-1.5 py-0.5 rounded font-semibold text-[8px] ${statusBg}`}>
                                    {driver.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* VIEW 7: MASTER DATA (GEO ZONE TYPE ACCORDIONS AND INDIA MAP PLOTTING RECREATION) */}
              {activeTab === "master-data" && (
                <div className="flex flex-col gap-3 h-[300px] sm:h-[350px] md:h-[385px] w-full text-slate-800 dark:text-slate-200">
                  {/* Sub-header controls matching screenshot */}
                  <div className="flex items-center justify-between shrink-0 gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
                    {/* Search bar */}
                    <div className="relative w-40 sm:w-48">
                      <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search place" 
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-7 pr-3 py-1 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-300 focus:outline-none placeholder:text-slate-400 shadow-sm"
                        readOnly
                      />
                    </div>

                    {/* Table / Map Segmented Control Switcher */}
                    <div className="flex p-0.5 bg-slate-200/60 dark:bg-slate-900/60 rounded-lg text-[9px] font-bold">
                      <button 
                        onClick={() => setPlacesViewMode("Table")}
                        className={`px-3 py-1 rounded-md transition-all ${placesViewMode === "Table" ? "bg-white dark:bg-[#151726] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                      >
                        Table
                      </button>
                      <button 
                        onClick={() => setPlacesViewMode("Map")}
                        className={`px-3 py-1 rounded-md transition-all ${placesViewMode === "Map" ? "bg-white dark:bg-[#151726] text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                      >
                        Map
                      </button>
                    </div>
                  </div>

                  {/* Dynamic View: Map or Table */}
                  {placesViewMode === "Map" ? (
                    <div className="grid grid-cols-5 gap-3 flex-1 min-h-0 overflow-hidden">
                      {/* Left Column: Interactive Accordion List */}
                      <div className="col-span-2 bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 overflow-y-auto p-2 space-y-1.5 shadow-sm text-[9px] sm:text-[10px]">
                        <div className="px-1.5 py-0.5 text-slate-400 font-semibold uppercase tracking-wider text-[8px]">
                          Places by type
                        </div>
                        <div className="text-[7.5px] text-slate-400 px-1.5 pb-1">
                          Browse categories and update place details.
                        </div>

                        {PLACES_CATEGORIES.map((category) => {
                          const isExpanded = !!expandedAccordions[category.id];
                          const isOffices = category.id === "offices";
                          
                          const textColorClass = isOffices 
                            ? "text-amber-600 dark:text-amber-500" 
                            : "text-slate-800 dark:text-slate-300";

                          const dotColorClass = 
                            category.color === "amber" ? "bg-amber-500" :
                            category.color === "indigo" ? "bg-indigo-400" :
                            category.color === "emerald" ? "bg-emerald-400" :
                            category.color === "blue" ? "bg-blue-500" :
                            "bg-slate-950 dark:bg-white";

                          const chevronColorClass = isOffices ? "text-amber-500" : "text-slate-400";

                          const badgeClass = isOffices 
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

                          const borderClass = isOffices 
                            ? "border-amber-500/20" 
                            : "border-slate-100 dark:border-slate-800/50";

                          const itemWrapperClass = isOffices 
                            ? "flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800/50 last:border-b-0 hover:bg-amber-500/5 px-1 rounded cursor-pointer"
                            : "flex justify-between items-center py-0.5 hover:text-[#5b4dd3] dark:hover:text-[#948cf4] cursor-pointer";

                          const itemTitleClass = isOffices 
                            ? "font-semibold text-slate-800 dark:text-slate-200" 
                            : "font-semibold text-slate-700 dark:text-slate-300";

                          return (
                            <div key={category.id} className="space-y-0.5">
                              <button 
                                onClick={() => toggleAccordion(category.id)}
                                className="w-full flex items-center justify-between p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/20 text-left transition-colors"
                              >
                                <div className={`flex items-center gap-1.5 font-semibold ${textColorClass}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />
                                  <ChevronRight className={`w-3 h-3 transition-transform ${chevronColorClass} ${isExpanded ? "rotate-90" : ""}`} />
                                  <span>{category.label}</span>
                                </div>
                                <span className={`${badgeClass} px-1.5 py-0.2 rounded font-bold text-[8px]`}>
                                  {category.count.toString().padStart(2, '0')}
                                </span>
                              </button>
                              {isExpanded && category.items.length > 0 && (
                                <div className={`pl-6 pr-2 py-1 space-y-1 text-[8px] sm:text-[8.5px] border-l ml-2 ${borderClass}`}>
                                  {category.items.map((item, idx) => (
                                    <div 
                                      key={item.id} 
                                      className={itemWrapperClass}
                                    >
                                      <div className="leading-tight">
                                        <div className={itemTitleClass}>
                                          {idx + 1}. {item.name}
                                        </div>
                                        <div className="text-slate-400 text-[7px]">{item.address}</div>
                                      </div>
                                      <span className="text-slate-400">⋮</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Right Column: Premium Mapped India visual */}
                      <div className="col-span-3 bg-[#e6ebf4] dark:bg-[#111425] rounded-lg border border-slate-200 dark:border-slate-800/80 p-1 relative overflow-hidden flex flex-col justify-between shadow-inner">
                        {/* India SVG map with border divisions, neighboring labels, city names */}
                        <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden h-full">
                          <svg viewBox="0 0 600 550" className="w-full h-full text-slate-200 dark:text-slate-800/30 fill-current select-none">
                            {/* Sea grid backdrop */}
                            <g className="stroke-slate-300/40 dark:stroke-slate-800/35" strokeWidth="0.5" strokeDasharray="3 3">
                              <line x1="0" y1="100" x2="600" y2="100" />
                              <line x1="0" y1="200" x2="600" y2="200" />
                              <line x1="0" y1="300" x2="600" y2="300" />
                              <line x1="0" y1="400" x2="600" y2="400" />
                              <line x1="0" y1="500" x2="600" y2="500" />
                              <line x1="100" y1="0" x2="100" y2="550" />
                              <line x1="200" y1="0" x2="200" y2="550" />
                              <line x1="300" y1="0" x2="300" y2="550" />
                              <line x1="400" y1="0" x2="400" y2="550" />
                              <line x1="500" y1="0" x2="500" y2="550" />
                            </g>

                            {/* Pakistan / Afghanistan shape */}
                            <path d="M 50,150 L 150,120 L 220,100 L 220,130 L 180,180 L 190,230 L 180,260 L 140,290 L 120,300 L 90,300 L 50,250 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />
                            {/* Nepal shape */}
                            <path d="M 290,180 L 390,210 L 375,230 L 280,200 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />
                            {/* Bangladesh shape */}
                            <path d="M 420,240 L 450,240 L 460,280 L 430,300 L 415,280 Z" className="fill-slate-100/50 dark:fill-slate-900/10 stroke-slate-300/50 dark:stroke-slate-800/20" strokeWidth="0.5" />

                            {/* India Mainland outline */}
                            <path 
                              d="M 220,100 
                                 C 225,80 235,50 250,30 
                                 C 260,20 270,30 275,45 
                                 C 280,55 275,70 272,85
                                 C 270,95 285,95 290,100
                                 C 295,105 295,115 290,120
                                 C 285,125 280,125 275,130
                                 C 270,135 272,142 278,145
                                 C 285,150 295,145 300,150
                                 C 305,155 310,165 312,175
                                 C 314,185 300,185 290,180
                                 C 280,175 282,195 280,200
                                 C 278,205 320,220 375,230
                                 C 385,232 390,220 395,215
                                 C 400,210 405,215 410,220
                                 C 415,225 418,230 420,240
                                 C 415,245 412,250 410,255
                                 C 408,260 405,270 408,275
                                 C 412,280 415,278 418,280
                                 C 422,282 425,290 422,295
                                 C 420,300 435,295 440,300
                                 C 445,305 450,295 455,302
                                 C 460,310 465,330 460,340
                                 C 455,350 450,345 445,350
                                 C 440,355 435,360 432,365
                                 C 430,370 425,360 420,355
                                 C 415,350 410,342 405,340
                                 C 400,338 395,335 390,330
                                 C 385,325 380,318 375,320
                                 C 370,322 368,310 365,305
                                 C 362,300 360,290 355,288
                                 C 350,286 345,280 340,282
                                 C 335,284 330,285 328,280
                                 C 325,275 320,278 315,275
                                 C 310,272 305,268 300,270
                                 C 295,272 290,280 288,290
                                 C 285,300 290,310 292,320
                                 C 294,330 300,340 305,350
                                 C 310,360 315,370 318,380
                                 C 320,390 315,405 310,420
                                 C 305,435 300,450 292,465
                                 C 285,480 275,495 270,510
                                 C 268,515 265,510 262,500
                                 C 259,490 258,480 256,470
                                 C 254,460 250,450 248,440
                                 C 246,430 244,420 242,410
                                 C 240,400 238,390 235,380
                                 C 232,370 230,360 228,350
                                 C 225,340 222,330 220,320
                                 C 218,310 215,300 212,290
                                 C 210,280 205,275 200,270
                                 C 195,265 190,260 185,255
                                 C 180,250 175,245 170,240
                                 C 165,235 160,230 155,228
                                 C 150,226 145,225 140,228
                                 C 135,230 132,235 130,240
                                 C 128,245 125,242 122,238
                                 C 120,234 118,228 116,220
                                 C 114,212 120,205 125,200
                                 C 130,195 138,190 145,185
                                 C 152,180 160,175 165,170
                                 C 170,165 175,160 178,155
                                 C 180,150 185,145 188,140
                                 C 190,135 192,130 195,125
                                 C 198,120 205,115 210,110
                                 C 215,105 218,102 220,100 Z"
                              className="fill-white dark:fill-[#151726] stroke-slate-300 dark:stroke-slate-800/80" 
                              strokeWidth="1.5" 
                            />

                            {/* Sri Lanka outline */}
                            <path 
                              d="M 305,520
                                 C 307,522 308,525 308,528
                                 C 308,531 306,535 304,537
                                 C 302,539 299,537 298,535
                                 C 297,533 297,530 298,527
                                 C 299,524 302,521 305,520 Z"
                              className="fill-white dark:fill-[#151726] stroke-slate-300 dark:stroke-slate-800/80" 
                              strokeWidth="1" 
                            />

                            {/* Region Labels */}
                            <text x="55" y="145" className="text-[7px] sm:text-[8px] fill-slate-400 dark:fill-slate-500 font-bold tracking-wider italic uppercase">Afghanistan</text>
                            <text x="75" y="210" className="text-[8px] sm:text-[9px] fill-slate-400 dark:fill-slate-500 font-bold tracking-wider italic uppercase">Pakistan</text>
                            <text x="320" y="160" className="text-[7.5px] sm:text-[8px] fill-slate-400 dark:fill-slate-500 font-bold tracking-wider italic uppercase">Lhasa</text>
                            <text x="300" y="202" className="text-[7px] fill-slate-400 dark:fill-slate-500 font-semibold uppercase">Nepal</text>
                            <text x="425" y="278" className="text-[7px] fill-slate-400 dark:fill-slate-500 font-semibold uppercase">Bangladesh</text>

                            {/* Center India text watermarked */}
                            <text x="235" y="325" className="text-[20px] font-extrabold fill-slate-100 dark:fill-slate-900/50 tracking-widest uppercase">INDIA</text>

                            {/* Major Cities text */}
                            <text x="135" y="150" className="text-[6.5px] fill-slate-400 dark:fill-slate-500">Islamabad</text>
                            <text x="145" y="168" className="text-[6.5px] fill-slate-400 dark:fill-slate-500">Lahore</text>
                            <text x="105" y="280" className="text-[6.5px] fill-slate-400 dark:fill-slate-500">Karachi</text>
                            <text x="248" y="212" className="text-[7px] font-semibold fill-slate-700 dark:text-slate-300">New Delhi</text>
                            <text x="375" y="275" className="text-[7px] fill-slate-500 dark:fill-slate-400">Kolkata</text>
                            <text x="160" y="358" className="text-[7px] fill-slate-500 dark:fill-slate-400">Mumbai</text>
                            <text x="250" y="360" className="text-[7px] fill-slate-500 dark:fill-slate-400">Hyderabad</text>
                            <text x="210" y="445" className="text-[7px] fill-slate-500 dark:fill-slate-400">Bengaluru</text>
                            <text x="262" y="450" className="text-[7px] fill-slate-500 dark:fill-slate-400">Chennai</text>
                          </svg>

                          {/* Plotted plants markers (black circles with tiny white factory outline inside) */}
                          {/* Plants counts: 40 scattered throughout India */}
                          {[
                            { top: "35%", left: "54%", label: "Delhi Plant" },
                            { top: "58%", left: "41%", label: "Mumbai Whse" },
                            { top: "79%", left: "48%", label: "Bengaluru Whse" },
                            { top: "80%", left: "55%", label: "Chennai Plant" },
                            { top: "45%", left: "64%", label: "Kolkata Hub" },
                            { top: "62%", left: "52%", label: "Hyd Plant" },
                            { top: "46%", left: "39%", label: "Gujarat Plant" },
                            { top: "37%", left: "44%", label: "Jaipur Plant" },
                            { top: "46%", left: "47%", label: "Bhopal Hub" },
                            { top: "23%", left: "48%", label: "Punjab Hub" }
                          ].map((marker, idx) => (
                            <div 
                              key={idx}
                              title={marker.label}
                              className="absolute w-3.5 h-3.5 rounded-full bg-slate-900 border border-white dark:border-slate-800 flex items-center justify-center shadow-md hover:scale-125 transition-transform cursor-pointer"
                              style={{ top: marker.top, left: marker.left }}
                            >
                              <div className="w-[4px] h-[4px] bg-white rounded-full" />
                            </div>
                          ))}

                          {/* Plotted offices markers (orange building pins) */}
                          {/* 1. BINOLA (pulsing and text labeled) */}
                          <div 
                            className="absolute flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-transform" 
                            style={{ top: "33%", left: "49.5%" }}
                          >
                            <div className="w-4.5 h-4.5 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-lg animate-bounce p-0.5">
                              <Building className="w-2.5 h-2.5 text-white" />
                            </div>
                            <div className="bg-slate-900/90 dark:bg-slate-950/90 text-white text-[5.5px] px-1 py-0.2 rounded border border-slate-700 mt-0.5 shadow-sm whitespace-nowrap">
                              Binola
                            </div>
                          </div>

                          {/* 2. AML ABR */}
                          <div 
                            className="absolute flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-transform" 
                            style={{ top: "27%", left: "47.5%" }}
                          >
                            <div className="w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center shadow-lg animate-pulse p-0.5">
                              <Building className="w-2 h-2 text-white" />
                            </div>
                          </div>

                          {/* Floating Map Zoom Control HUD (right side) */}
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-[#121424] border border-slate-200 dark:border-slate-800 rounded-lg p-1 flex flex-col gap-1 shadow-md z-10 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                            <button className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded">+</button>
                            <hr className="border-slate-200 dark:border-slate-800" />
                            <button className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded">-</button>
                            <hr className="border-slate-200 dark:border-slate-800" />
                            <button className="w-5 h-5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm16 0v6h-6v-2h4v-4h2z"/></svg>
                            </button>
                          </div>

                          {/* Legend Overlay Card in bottom left */}
                          <div className="absolute bottom-2 left-2 bg-white/95 dark:bg-[#0e111a]/95 border border-slate-200 dark:border-slate-800 p-1.5 rounded-lg text-[6.5px] sm:text-[7.5px] space-y-0.5 shadow-sm text-slate-500 dark:text-slate-400 leading-tight z-10">
                            <div className="font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-0.5 mb-0.5">Legend Map</div>
                            {PLACES_CATEGORIES.map((category) => {
                              const dotColorClass = 
                                category.color === "amber" ? "bg-amber-500" :
                                category.color === "indigo" ? "bg-indigo-400" :
                                category.color === "emerald" ? "bg-emerald-400" :
                                category.color === "blue" ? "bg-blue-500" :
                                "bg-slate-900 border border-white";
                              return (
                                <div key={category.id} className="flex items-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />
                                  <span>{category.label}: <strong className="text-slate-800 dark:text-white font-bold">{category.count.toString().padStart(2, '0')}</strong></span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Table View mode displaying all places in rows */
                    <div className="bg-white dark:bg-[#151726]/80 rounded-lg border border-slate-200 dark:border-slate-800/80 shadow-sm flex-1 min-h-0 overflow-y-auto">
                      <table className="w-full text-left text-[9px] sm:text-[10px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-800/30 text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800/80">
                            <th className="p-2 sm:p-2.5">Place Name</th>
                            <th className="p-2 sm:p-2.5">Type</th>
                            <th className="p-2 sm:p-2.5">Address</th>
                            <th className="p-2 sm:p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                          {PLACES_CATEGORIES.flatMap(category => 
                            category.items.map(item => ({
                              ...item,
                              type: category.label
                            }))
                          ).map((place) => (
                            <tr key={`${place.type}-${place.id}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                              <td className="p-2 sm:p-2.5 font-semibold text-slate-900 dark:text-white">{place.name}</td>
                              <td className="p-2 sm:p-2.5">{place.type}</td>
                              <td className="p-2 sm:p-2.5 text-slate-500">{place.address}</td>
                              <td className="p-2 sm:p-2.5"><span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">Active</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Walkthrough Previous & Next Navigation HUD Bar */}
            <div className="bg-slate-100/80 dark:bg-slate-900/40 p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800/40 flex items-center justify-between shrink-0 text-[9px] sm:text-[10px] mt-2">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`flex items-center gap-0.5 font-bold transition-all px-2 py-1 rounded ${
                  currentIndex === 0
                    ? "text-slate-300 dark:text-slate-800 cursor-not-allowed"
                    : "text-[#5b4dd3] dark:text-[#948cf4] hover:bg-[#5b4dd3]/10"
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Screen</span>
              </button>

              {/* Step info indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium select-none">
                <span>View {currentIndex + 1} of 7:</span>
                <span className="font-bold text-slate-800 dark:text-white capitalize">
                  {activeTab === "master-data" ? "Geo Zone" : activeTab}
                </span>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={currentIndex === TABS_ORDER.length - 1}
                className={`flex items-center gap-0.5 font-bold transition-all px-2.5 py-1 rounded ${
                  currentIndex === TABS_ORDER.length - 1
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                    : "bg-[#5b4dd3] dark:bg-primary text-white hover:opacity-90 shadow-sm"
                }`}
              >
                <span>Next Screen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;

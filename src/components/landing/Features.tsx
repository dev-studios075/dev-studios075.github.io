import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  Route, Clock, Satellite, FileBarChart2, BellRing,
  Users, Wrench, Boxes, Wallet,
} from "lucide-react";

// 1. Trip Planning Visualizer
const TripPlanningVisualizer = () => {
  return (
    <div className="relative h-28 w-full rounded-xl overflow-hidden p-3 font-mono text-[10px]" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="absolute inset-0 dot-bg opacity-30" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90">
        <motion.path d="M 30,70 L 100,25 L 170,65" fill="none" stroke="rgba(94, 92, 230, 0.15)" strokeWidth="2" />
        <motion.path
          d="M 30,70 L 100,25 L 170,65"
          fill="none" stroke="url(#gradient-route)" strokeWidth="2" strokeDasharray="200"
          initial={{ strokeDashoffset: 200 }} animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="gradient-route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5e5ce6" />
            <stop offset="100%" stopColor="#948cf4" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="70" r="3.5" className="fill-primary animate-pulse" />
        <text x="22" y="81" className="fill-slate-400 font-bold" fontSize="7">MUM</text>
        <circle cx="100" cy="25" r="3.5" className="fill-primary" />
        <text x="94" y="16" className="fill-slate-400 font-bold" fontSize="7">DEL</text>
        <circle cx="170" cy="65" r="3.5" className="fill-primary" />
        <text x="164" y="76" className="fill-slate-400 font-bold" fontSize="7">BLR</text>
        <motion.circle cx="0" cy="0" r="3" className="fill-white shadow-glow"
          animate={{ cx: [30, 100, 170], cy: [70, 25, 65] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <div className="absolute top-2 right-2 bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5 text-primary text-[8px] font-bold tracking-wider animate-pulse">SAVED 14.8%</div>
      <div className="absolute bottom-2 left-2 text-[8px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">NH-48 Optimal Route Selected</div>
    </div>
  );
};

// 2. GPS Tracking Visualizer
const GPSTrackingVisualizer = () => {
  return (
    <div className="relative h-28 w-full rounded-xl overflow-hidden p-3 font-mono text-[9px] flex flex-col justify-between" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex justify-between items-center text-slate-400">
        <span>SHIPMENT TRACKER</span>
        <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />LIVE</span>
      </div>
      <div className="relative my-2">
        <div className="h-1 bg-slate-800 rounded-full w-full relative">
          <motion.div className="absolute left-0 top-0 h-full bg-primary rounded-full"
            animate={{ width: ["0%", "84%", "0%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute top-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-slate-950 flex items-center justify-center shadow-glow"
            animate={{ left: ["0%", "84%", "0%"] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translate(-50%, -50%)", width: "18px", height: "18px" }}>
            <span className="text-[8px]">🚛</span>
          </motion.div>
        </div>
        <div className="flex justify-between text-[7px] text-slate-500 mt-2">
          <span>MUMBAI</span><span>84% ARRIVED</span><span>DELHI</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[7.5px] text-slate-400 border-t border-slate-900 pt-1.5">
        <div>SPEED: <span className="text-white">58 km/h</span></div>
        <div>ETA: <span className="text-white">06:30 AM</span></div>
      </div>
    </div>
  );
};

// 3. Departure Mgmt Visualizer
const DepartureMgmtVisualizer = () => {
  const [checked, setChecked] = useState([false, false, false]);
  useEffect(() => {
    const loop = setInterval(() => {
      setChecked([false, false, false]);
      const t1 = setTimeout(() => setChecked([true, false, false]), 1000);
      const t2 = setTimeout(() => setChecked([true, true, false]), 2000);
      const t3 = setTimeout(() => setChecked([true, true, true]), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, 5000);
    const t1 = setTimeout(() => setChecked([true, false, false]), 1000);
    const t2 = setTimeout(() => setChecked([true, true, false]), 2000);
    const t3 = setTimeout(() => setChecked([true, true, true]), 3000);
    return () => { clearInterval(loop); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const items = ["Loading Sheet mapped", "Gate Pass validated", "E-Way Bill registered"];
  return (
    <div className="h-28 w-full rounded-xl p-3 flex flex-col justify-between font-mono text-[9px]" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-slate-500 font-semibold uppercase tracking-wider">GATE OUT INTEGRATION</div>
      <div className="space-y-1 my-1">
        {items.map((item, idx) => (
          <div key={item} className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all duration-300 ${checked[idx] ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-glow" : "border-slate-800 text-transparent"}`}>✓</div>
            <span className={checked[idx] ? "text-slate-200" : "text-slate-500"}>{item}</span>
          </div>
        ))}
      </div>
      <div className="text-[7.5px] text-slate-600 text-right">GATE-PASS AUTO-API v1.2</div>
    </div>
  );
};

// 4. Expense Visualizer
const ExpenseVisualizer = () => (
  <div className="relative h-28 w-full rounded-xl overflow-hidden p-3 font-mono text-[9px] flex flex-col justify-between" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
      <span className="text-slate-400">EXPENSE BALANCES</span>
      <span className="text-emerald-400 font-bold">RECONCILED</span>
    </div>
    <div className="flex items-baseline gap-1 mt-1">
      <span className="text-base font-bold text-white">₹12,45,000</span>
      <span className="text-emerald-500 font-bold text-[8px]">↓ 18.4% cost</span>
    </div>
    <div className="h-10 w-full relative flex items-end">
      <svg viewBox="0 0 200 40" className="w-full h-full text-primary/10 fill-current">
        <path d="M 0,40 Q 40,30 80,18 T 160,8 T 200,2 L 200,40 L 0,40 Z" />
        <path d="M 0,40 Q 40,30 80,18 T 160,8 T 200,2" fill="none" className="stroke-primary" strokeWidth="1.5" />
        <line x1="0" y1="30" x2="200" y2="30" className="stroke-slate-900/60" strokeWidth="0.5" />
        <line x1="0" y1="15" x2="200" y2="15" className="stroke-slate-900/60" strokeWidth="0.5" />
      </svg>
    </div>
    <div className="flex justify-between text-[7px] text-slate-500 pt-1">
      <span>Fastag Auto-settled</span><span>Receivables Clear</span>
    </div>
  </div>
);

// 5. Alerts Visualizer
const AlertsVisualizer = () => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setStep((prev) => (prev + 1) % 2), 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-28 w-full rounded-xl p-3 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-slate-500 font-semibold uppercase tracking-wider">EXCEPTION TRIAGE</div>
      <div className="flex-1 flex items-center justify-center">
        {step === 0 ? (
          <motion.div key="alert" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 flex items-start gap-1.5 text-rose-400">
            <span className="animate-pulse">⚠️</span>
            <div><div className="font-bold text-[9px]">ROUTE DEVIATION DETECTED</div>
              <p className="text-[8px] text-rose-300/80 mt-0.5">MH-01 deviation &gt; 12km</p></div>
          </motion.div>
        ) : (
          <motion.div key="resolved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 flex items-start gap-1.5 text-emerald-400">
            <span>✓</span>
            <div><div className="font-bold text-[9px]">AUTO-RESOLVED</div>
              <p className="text-[8px] text-emerald-300/80 mt-0.5">Rerouted via NH-52. Customer SMS sent.</p></div>
          </motion.div>
        )}
      </div>
      <div className="text-[7px] text-slate-600 text-right">System latency: 200ms</div>
    </div>
  );
};

// 6. Maintenance Visualizer
const MaintenanceVisualizer = () => (
  <div className="h-28 w-full rounded-xl p-3 flex flex-col justify-between font-mono text-[9px]" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="text-slate-500 font-semibold uppercase tracking-wider">TELEMATICS DIAGNOSTICS</div>
    <div className="space-y-2 py-1">
      <div className="space-y-1">
        <div className="flex justify-between text-[8.5px] text-slate-300"><span>Engine Health</span><span className="text-emerald-400 font-bold">96% (Optimal)</span></div>
        <div className="h-1 bg-slate-900 rounded-full w-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "96%" }} /></div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[8.5px] text-slate-300"><span>Tire Tread Wear</span><span className="text-amber-500 font-bold">48% (Service Scheduled)</span></div>
        <div className="h-1 bg-slate-900 rounded-full w-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: "48%" }} /></div>
      </div>
    </div>
    <div className="text-[7px] text-slate-600">OBD-II Predictive Telemetry</div>
  </div>
);

// 7. Spare Parts Visualizer
const SparePartsVisualizer = () => (
  <div className="h-28 w-full rounded-xl p-3 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="text-slate-500 font-semibold uppercase tracking-wider">VISION INVENTORY SCAN</div>
    <div className="relative flex-1 flex items-center justify-center my-1 bg-slate-900/60 border border-slate-800/60 rounded-lg">
      <motion.div className="absolute left-0 right-0 h-[2.5px] bg-primary shadow-[0_0_10px_#5e5ce6] z-10"
        animate={{ top: ["5%", "95%", "5%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="relative border border-slate-800 rounded p-1.5 flex items-center gap-2">
        <span className="text-base animate-pulse">📦</span>
        <div className="text-[8px] leading-tight text-slate-400">
          <div>SKU: <span className="text-white">AIR-FILT-892</span></div>
          <div>STATUS: <span className="text-amber-400 font-bold">LOW STOCK</span></div>
        </div>
      </div>
    </div>
    <div className="flex justify-between text-[7.5px] text-slate-500">
      <span>Stock: 2 left</span><span className="text-primary font-bold">AUTO-ORDERED ✓</span>
    </div>
  </div>
);

// 8. Task Automation Visualizer
const TaskAutomationVisualizer = () => (
  <div className="relative h-28 w-full rounded-xl overflow-hidden p-3 font-mono text-[8.5px] flex flex-col justify-between" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="text-slate-500 font-semibold uppercase tracking-wider">WORKFLOW DISPATCH ENGINE</div>
    <div className="relative flex items-center justify-between py-2.5">
      <div className="bg-slate-900/80 border border-slate-800 rounded p-1.5 text-center text-slate-300 relative z-10">
        <div>Demand Load</div><div className="text-[7.5px] text-emerald-400 mt-0.5">Auto-Created</div>
      </div>
      <div className="h-[1px] bg-slate-800 flex-1 relative mx-1">
        <motion.div className="absolute top-0 bottom-0 bg-primary shadow-glow"
          animate={{ left: ["0%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} style={{ width: "20px" }} />
      </div>
      <div className="bg-slate-900/80 border border-slate-800 rounded p-1.5 text-center text-slate-300 relative z-10">
        <div>Match Driver</div><div className="text-[7.5px] text-primary mt-0.5">SOP Verified</div>
      </div>
      <div className="h-[1px] bg-slate-800 flex-1 relative mx-1">
        <motion.div className="absolute top-0 bottom-0 bg-primary shadow-glow"
          animate={{ left: ["0%", "100%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1.25 }} style={{ width: "20px" }} />
      </div>
      <div className="bg-slate-900/80 border border-slate-800 rounded p-1.5 text-center text-slate-300 relative z-10">
        <div>Mobile Push</div><div className="text-[7.5px] text-emerald-400 mt-0.5">Dispatched</div>
      </div>
    </div>
    <div className="text-[7.5px] text-slate-500 text-center">No dispatcher touchpoints. Latency: 220ms</div>
  </div>
);

// 9. Report Gen Visualizer
const ReportGenVisualizer = () => {
  const [text, setText] = useState("");
  const fullText = "[REPORT] CO2 offset: 4,120 liters. Compliance: 99.8%. Toll: 100% matched.";
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-28 w-full rounded-xl p-3 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="text-slate-500 font-semibold uppercase tracking-wider">AI REPORT AUTO-GEN</div>
      <div className="flex-1 bg-slate-950/60 border border-slate-900/60 rounded p-2 text-slate-300 leading-normal overflow-hidden mt-1 select-none">
        <span>{text}</span><span className="w-1.5 h-3 bg-primary inline-block ml-0.5 animate-pulse" />
      </div>
      <div className="text-[7px] text-slate-600 text-right">PDF format · Scheduled Daily</div>
    </div>
  );
};

const features = [
  {
    icon: Route,
    title: "Automated Trip Planning",
    desc: "AI builds optimal routes, loads, and schedules from live demand and constraints.",
    bullets: ["Multi-stop route optimization", "Load balancing across fleet", "Auto-assigns driver & vehicle"],
    visualizer: TripPlanningVisualizer,
  },
  {
    icon: Satellite,
    title: "Autonomous GPS Tracking",
    desc: "Continuous tracking with predictive ETAs and deviation intelligence.",
    bullets: ["Real-time position & ETA updates", "Geo-fence alerts & boundary triggers", "Deviation detection with auto-escalation"],
    visualizer: GPSTrackingVisualizer,
  },
  {
    icon: Clock,
    title: "Smart Departure Management",
    desc: "System orchestrates loading, paperwork, and gate-out with zero manual coordination.",
    bullets: ["Auto-generates trip documents", "Loading checklist enforcement", "Gate-out confirmation workflow"],
    visualizer: DepartureMgmtVisualizer,
  },
  {
    icon: Wallet,
    title: "Expense & Collection",
    desc: "Automated reconciliation, receivables tracking, and cash-flow visibility.",
    bullets: ["Driver advance & settlement automation", "POD-linked invoice generation", "Overdue receivables alerts"],
    visualizer: ExpenseVisualizer,
  },
  {
    icon: BellRing,
    title: "Auto Alerts & Exceptions",
    desc: "Detects anomalies, triages severity, and resolves or escalates automatically.",
    bullets: ["Rule-based exception engine", "Multi-channel alert routing", "Auto-closes resolved events"],
    visualizer: AlertsVisualizer,
  },
  {
    icon: Wrench,
    title: "Vehicle Maintenance AI",
    desc: "Image-processing inspection plus predictive service windows for every asset.",
    bullets: ["Photo-based damage detection", "Service interval forecasting", "Workshop booking automation"],
    visualizer: MaintenanceVisualizer,
  },
  {
    icon: Boxes,
    title: "Spare Parts Intelligence",
    desc: "Visual recognition and demand forecasting keep inventory lean and ready.",
    bullets: ["AI-matched part identification", "Consumption-based reorder triggers", "Vendor lead-time optimization"],
    visualizer: SparePartsVisualizer,
  },
  {
    icon: Users,
    title: "Staff Task Automation",
    desc: "Tasks generated, assigned, and tracked across your team without supervisors.",
    bullets: ["Role-based task auto-assignment", "Completion tracking & SLA alerts", "Performance reporting per staff"],
    visualizer: TaskAutomationVisualizer,
  },
  {
    icon: FileBarChart2,
    title: "AI Report Generation",
    desc: "Operational, financial, and compliance reports written by the system, on schedule.",
    bullets: ["Scheduled PDF & dashboard exports", "Natural-language narrative summaries", "Regulatory compliance reports"],
    visualizer: ReportGenVisualizer,
  },
];

// ─── Scroll-driven single card ───────────────────────────────────────────────
const StackCard = ({
  f,
  i,
  total,
  scrollYProgress,
}: {
  f: typeof features[0];
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const Icon = f.icon;
  const Visualizer = f.visualizer;

  const rangeStart = i / total;
  const rangeEnd = (i + 1) / total;
  const fadeIn = Math.max(0, rangeStart - 0.07);

  const y = useTransform(scrollYProgress, [fadeIn, rangeStart], [60, 0]);
  const opacity = useTransform(scrollYProgress, [fadeIn, rangeStart], [0, 1]);
  const scale = useTransform(
    scrollYProgress,
    [rangeStart, rangeEnd, Math.min(1, rangeEnd + 0.005)],
    [1, 1, 0.96]
  );

  return (
    <motion.div
      style={{ y, opacity, scale, zIndex: i + 1 }}
      className="absolute inset-0"
    >
      {/* Terminal window wrapper */}
      <div className="group relative h-full rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/[0.08]">

        {/* ── Title bar ── */}
        <div className="flex items-center gap-3 px-5 py-3 shrink-0 bg-slate-50 dark:bg-[#161b22] border-b border-slate-200 dark:border-white/[0.07]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
          </div>
          <span className="flex-1 text-center font-mono text-[10px] tracking-widest uppercase text-slate-400 dark:text-[#4b5563]">
            FLEETCODES AUTOPILOT · {f.title.toUpperCase()}
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-[#4b5563]">
            {String(i + 1).padStart(2, "0")}/{String(features.length).padStart(2, "0")}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="grid lg:grid-cols-2 gap-0" style={{ height: "calc(100% - 44px)" }}>
          {/* Left: text */}
          <div className="p-8 lg:p-12 flex flex-col justify-center border-r border-slate-200 dark:border-white/[0.07]">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 mb-6 w-fit group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl mb-3 text-slate-800 dark:text-white group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed max-w-sm mb-6 text-slate-500 dark:text-slate-400">{f.desc}</p>

            {/* Bullet points */}
            <ul className="space-y-2.5">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: visualizer */}
          <div className="p-8 lg:p-12 flex items-center justify-center bg-slate-50/80 dark:bg-white/[0.02]">
            <div className="w-full">
              <Visualizer />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Progress dots on the right ──────────────────────────────────────────────
const ProgressDot = ({
  i,
  total,
  scrollYProgress,
}: {
  i: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const start = i / total;
  const end = (i + 1) / total;
  const scale = useTransform(scrollYProgress, [start, end], [1, 1.4]);
  const opacity = useTransform(scrollYProgress, [start, (start + end) / 2, end], [0.3, 1, 0.3]);
  return (
    <motion.div
      style={{ scale, opacity }}
      className="w-1.5 h-1.5 rounded-full bg-primary"
    />
  );
};

// ─── Main Features section ────────────────────────────────────────────────────
const NAVBAR_H = 64;   // px  — navbar height
const HEADER_H = 180;  // px  — heading strip height (includes extra top gap)
const PB       = 80;   // px  — bottom padding → controls card height (larger = smaller card)

const Features = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start 64px", "end 64px"],
  });

  const cardH = `calc(100vh - ${NAVBAR_H}px - ${HEADER_H}px - ${PB}px)`;

  return (
    <section id="features" className="relative">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[320px] h-[320px] rounded-full bg-[#948cf4]/5 blur-[120px] pointer-events-none" />

      {/* ── Scroll container: height = num cards × scroll-per-card ── */}
      <div
        ref={scrollRef}
        style={{ height: `${features.length * 100}vh` }}
        className="relative"
      >
        {/*
          sticky top = navbar height so content never slides under nav.
          h = 100vh − navbar so the panel fills the visible window exactly.
        */}
        <div
          className="sticky overflow-hidden flex flex-col"
          style={{ top: `${NAVBAR_H}px`, height: `calc(100vh - ${NAVBAR_H}px)` }}
        >
          <div className="container-tight w-full h-full flex flex-col pt-14 pb-6">

            {/* ── Section heading strip — always visible ── */}
            <div className="max-w-2xl shrink-0 mb-4" style={{ height: `${HEADER_H}px` }}>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">Capabilities</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-2 text-slate-900 dark:text-white">
                One platform. <span className="text-gradient">Nine autonomous systems.</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Replace fragmented tools and manual coordination with a single,
                self-operating engine built for modern logistics.
              </p>
            </div>

            {/* ── Card stack + progress dots row ── */}
            <div className="relative" style={{ height: cardH }}>
              {/* Progress dots — aligned to card area, right edge */}
              <div className="absolute -right-6 inset-y-0 flex flex-col items-center justify-center gap-2.5 z-50">
                {features.map((_, i) => (
                  <ProgressDot
                    key={i}
                    i={i}
                    total={features.length}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>

              {/* Cards — all absolute inset-0, driven by scroll progress */}
              {features.map((f, i) => (
                <StackCard
                  key={f.title}
                  f={f}
                  i={i}
                  total={features.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;



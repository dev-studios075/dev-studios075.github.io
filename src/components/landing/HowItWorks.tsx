import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Zap, 
  UserCheck, 
  TrendingUp, 
  FileText, 
  Terminal, 
  LineChart,
  ArrowRight
} from "lucide-react";

const steps = [
  { 
    icon: Brain, 
    title: "Digitize SOPs", 
    desc: "Upload processes, manuals, and templates. Fleetcodes AI maps your operational DNA automatically." 
  },
  { 
    icon: Zap, 
    title: "Live Dispatch Engine", 
    desc: "Every trip, approval, advance request, and route corridor is evaluated in real time (200ms latency)." 
  },
  { 
    icon: UserCheck, 
    title: "Auto-Assign Tasks", 
    desc: "Roster actions are routed straight to driver and staff app queues. Zero phone tag or manual messaging." 
  },
  { 
    icon: TrendingUp, 
    title: "Learn & Optimize", 
    desc: "Every shift's delay logs and route metrics feed back to retrain the model, cutting empty miles automatically." 
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  // Auto-advance loop effect
  useEffect(() => {
    if (isAutoplayPaused) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const duration = 4000; // 4 seconds per step

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed >= duration) {
        setProgress(0);
        setActiveStep((prev) => (prev + 1) % steps.length);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeStep, isAutoplayPaused]);

  return (
    <section id="how" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      {/* Background dot grid and soft ambient light glows */}
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

      <div className="container-tight relative">
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">Autonomous Workflow</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4 text-slate-900 dark:text-white">
            From SOP to <span className="text-gradient">self-driving operations</span> in four steps.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            See how Fleetcodes parses static operational rules and automates decisions, dispatch schedules, and continuous feedback loops.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Timeline Steps */}
          <div className="lg:col-span-5 space-y-3.5">
            {steps.map((s, idx) => {
              const isActive = activeStep === idx;
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  onMouseEnter={() => {
                    setIsAutoplayPaused(true);
                    setActiveStep(idx);
                  }}
                  onMouseLeave={() => {
                    setIsAutoplayPaused(false);
                  }}
                  onClick={() => setActiveStep(idx)}
                  className={`relative p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-4 select-none ${
                    isActive 
                      ? "bg-primary/5 border-primary/25 shadow-sm opacity-100 dark:bg-primary/5" 
                      : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/30 opacity-60 hover:opacity-90"
                  }`}
                >
                  {/* Left Active Timer Progress Line */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 rounded-l-xl overflow-hidden">
                      <div 
                        className="w-full bg-primary transition-all ease-linear"
                        style={{
                          height: `${progress}%`,
                          transitionDuration: progress === 0 ? "0ms" : "100ms"
                        }}
                      />
                    </div>
                  )}

                  <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                    isActive 
                      ? "bg-primary text-white" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className={`font-display font-semibold text-[15px] leading-tight transition-colors ${
                      isActive ? "text-primary dark:text-[#948cf4]" : "text-slate-700 dark:text-slate-300"
                    }`}>
                      {s.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Animated Simulation Screen */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/80 border border-slate-200/10 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
              
              {/* Window Header */}
              <div className="bg-slate-950 px-4 py-3 border-b border-slate-200/5 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono tracking-wider">
                  FLEETCODES AUTOPILOT SIMULATOR v4.1
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Console Body Area */}
              <div className="p-5 h-[280px] sm:h-[300px] flex flex-col justify-between bg-slate-950/90 font-mono">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 flex-1 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>Acme_Standard_Operations_SOP.pdf</span>
                        </div>
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-semibold animate-pulse">
                          PARSING CLAUSES
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 pt-3 text-xs leading-normal">
                        <div className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <span className="text-slate-200 font-semibold">Clause 1.4: Route Deviation</span>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">IF vehicle deviating &gt; 10km ➔ Alert Dispatcher + SMS Client</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <span className="text-slate-200 font-semibold">Clause 2.1: Driver Safety Hours</span>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">IF active duty exceeds 9h ➔ Flag rest window mandatory</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-bold">✔</span>
                          <div>
                            <span className="text-slate-200 font-semibold">Clause 4.3: Automated Toll Settlements</span>
                            <p className="text-[10.5px] text-slate-400 mt-0.5">IF Fastag charges &gt; ₹5,000 ➔ Auto-reconcile with trip ledger</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/60 pt-2.5 flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Progress: 100% processed</span>
                        <span className="text-emerald-400">Operational DNA mapped successfully</span>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between text-[10.5px]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <Terminal className="w-4 h-4 text-amber-500" />
                          <span>decision-engine.log</span>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>

                      <div className="space-y-1.5 py-3 flex-1 leading-relaxed text-slate-400">
                        <div>[02:14:15.002] <span className="text-[#948cf4] font-semibold">TRIP_REQUEST</span>: Load ID Acme-DEL-MUM-892</div>
                        <div>[02:14:15.018] [SOP_EVAL] Parsing constraint parameters... OK</div>
                        <div>[02:14:15.050] [CORRIDOR] Calculated route NH-48 toll estimate: ₹6,450</div>
                        <div>[02:14:15.110] [VEHICLE_SELECT] Roster MH-01-AB-1234 matched successfully</div>
                        <div>[02:14:15.142] [DRIVER_SELECT] Rajesh Kumar assigned. Exp: 8 Yrs. Shift checklist: OK</div>
                        <div className="text-amber-500 font-bold">[02:14:15.220] [DISPATCH] Status: AUTO-DISPATCH (0 exceptions, 218ms latency)</div>
                      </div>

                      <div className="border-t border-slate-800/60 pt-2 flex justify-between text-[10px] text-slate-500">
                        <span>Engine Load: 8%</span>
                        <span className="text-primary font-bold">DISPATCH SENT ➔</span>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col items-center justify-center space-y-4"
                    >
                      {/* Interactive Mobile Notification Mockup */}
                      <div className="w-64 bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-2xl relative overflow-hidden text-left">
                        <div className="flex items-center justify-between border-b border-slate-800/60 pb-2 mb-2">
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span>Auto-Dispatch Notification</span>
                          </div>
                          <span className="text-[8px] text-slate-500">Just Now</span>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="font-bold text-[11px] text-white">🔔 New Trip Roster Assigned</div>
                          <p className="text-[9.5px] text-slate-400 leading-tight">
                            Route: <strong>Mumbai ➔ Delhi NH-48</strong><br/>
                            Vehicle: <strong>MH-01-AB-1234 (Trailer)</strong><br/>
                            Report Time: <strong>02:30 AM (Tonight)</strong>
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[9px] font-bold text-center">
                          <div className="bg-primary hover:bg-primary/90 text-white py-1 rounded cursor-pointer transition-all">
                            Accept
                          </div>
                          <div className="bg-slate-800 hover:bg-slate-800/90 text-slate-400 py-1 rounded cursor-pointer transition-all">
                            Decline
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 text-center leading-normal max-w-sm">
                        Notification routed automatically to the driver's phone app via SMS & WhatsApp. No dispatcher calling required.
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 3 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col justify-between text-[10.5px]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                          <LineChart className="w-4 h-4 text-emerald-400" />
                          <span>retraining-analysis.report</span>
                        </div>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-semibold">
                          OPTIMIZING MODEL
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 py-2.5 text-center leading-tight">
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                          <div className="text-[8px] text-slate-500 font-semibold">EMPTY MILES</div>
                          <div className="text-xs font-bold text-emerald-400 mt-1.5">-18.4%</div>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                          <div className="text-[8px] text-slate-500 font-semibold">ON-TIME DISP</div>
                          <div className="text-xs font-bold text-[#948cf4] mt-1.5">99.4%</div>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                          <div className="text-[8px] text-slate-500 font-semibold">RETENTION</div>
                          <div className="text-xs font-bold text-amber-500 mt-1.5">+24%</div>
                        </div>
                      </div>

                      {/* SVG Line Graph */}
                      <div className="h-20 w-full relative flex items-end">
                        <svg viewBox="0 0 200 65" className="w-full h-full text-emerald-500/5 fill-current">
                          {/* Grid Lines */}
                          <line x1="0" y1="15" x2="200" y2="15" className="stroke-slate-800/40" strokeWidth="0.5" />
                          <line x1="0" y1="35" x2="200" y2="35" className="stroke-slate-800/40" strokeWidth="0.5" />
                          <line x1="0" y1="55" x2="200" y2="55" className="stroke-slate-800/40" strokeWidth="0.5" />
                          
                          {/* Path 1: Efficiency curve */}
                          <path d="M 0,55 Q 35,45 70,30 T 140,20 T 200,10 L 200,65 L 0,65 Z" />
                          <path d="M 0,55 Q 35,45 70,30 T 140,20 T 200,10" fill="none" className="stroke-emerald-400/80" strokeWidth="1.5" />
                          
                          {/* Path 2: Empty miles curve */}
                          <path d="M 0,15 Q 40,30 80,45 T 160,50 T 200,55" fill="none" className="stroke-rose-500/50" strokeWidth="1" strokeDasharray="3 3" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

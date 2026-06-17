import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ─── Mini visualizers (dark-terminal style, improved contrast) ─────────────

// 1. Cost Visualizer
const CostVisualizer = () => (
  <div className="relative h-24 w-full rounded-xl overflow-hidden p-2.5 font-mono text-[9px] flex flex-col justify-between"
    style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="flex justify-between items-center">
      <span style={{ color: "#64748b" }}>OVERHEAD LEDGER</span>
      <span className="font-bold" style={{ color: "#34d399" }}>SAVED</span>
    </div>
    <div className="h-10 w-full relative flex items-end">
      <svg viewBox="0 0 200 40" className="w-full h-full" style={{ fill: "rgba(239,68,68,0.08)" }}>
        <path d="M 0,5 Q 50,15 100,28 T 200,38 L 200,40 L 0,40 Z" />
        <path d="M 0,5 Q 50,15 100,28 T 200,38" fill="none" style={{ stroke: "rgba(239,68,68,0.7)" }} strokeWidth="1.5" />
        <line x1="0" y1="10" x2="200" y2="10" style={{ stroke: "rgba(255,255,255,0.05)" }} strokeWidth="0.5" />
        <line x1="0" y1="25" x2="200" y2="25" style={{ stroke: "rgba(255,255,255,0.05)" }} strokeWidth="0.5" />
      </svg>
    </div>
    <div className="flex justify-between text-[7px]" style={{ color: "#64748b" }}>
      <span>Admin: -54%</span>
      <span>Call overhead: -80%</span>
    </div>
  </div>
);

// 2. Errors Visualizer
const ErrorsVisualizer = () => {
  const [pulse, setPulse] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(false);
      setTimeout(() => setPulse(true), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-24 w-full rounded-xl p-2.5 flex flex-col justify-between font-mono text-[9px]"
      style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ color: "#64748b" }} className="font-semibold uppercase tracking-wider">ERROR SANITIZER</div>
      <div className="flex-1 flex items-center justify-center gap-2">
        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
          pulse ? "border-emerald-500" : "border-slate-700"
        }`} style={pulse ? { background: "rgba(52,211,153,0.15)", color: "#34d399" } : { color: "transparent" }}>
          ✓
        </div>
        <div className="text-left">
          <div className="font-bold text-[9px]" style={{ color: "#e2e8f0" }}>0 ANOMALIES</div>
          <div className="text-[7.5px]" style={{ color: "#64748b" }}>100% inputs sanitized</div>
        </div>
      </div>
      <div className="text-[7px] text-right" style={{ color: "#475569" }}>No manual entry exceptions</div>
    </div>
  );
};

// 3. Efficiency Visualizer
const EfficiencyVisualizer = () => (
  <div className="h-24 w-full rounded-xl p-2.5 flex flex-col justify-between font-mono text-[9px]"
    style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>UTILIZATION RATE</div>
    <div className="flex items-end justify-around h-12 pt-2 gap-4">
      <div className="flex flex-col items-center flex-1">
        <div className="text-[7.5px] font-bold mb-1" style={{ color: "#94a3b8" }}>67%</div>
        <div className="w-full rounded-t h-6" style={{ background: "#1e293b" }} />
        <div className="text-[6.5px] mt-1 uppercase" style={{ color: "#475569" }}>Before</div>
      </div>
      <div className="flex flex-col items-center flex-1">
        <div className="text-[7.5px] font-bold mb-1" style={{ color: "#a78bfa" }}>94%</div>
        <motion.div
          className="w-full rounded-t"
          initial={{ height: 0 }}
          whileInView={{ height: "32px" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ background: "rgba(124,58,237,0.35)", borderTop: "1px solid rgba(124,58,237,0.7)" }}
        />
        <div className="text-[6.5px] mt-1 uppercase font-bold" style={{ color: "#a78bfa" }}>Fleetcodes</div>
      </div>
    </div>
  </div>
);

// 4. Latency Visualizer
const LatencyVisualizer = () => {
  const [val, setVal] = useState("169ms");
  useEffect(() => {
    const interval = setInterval(() => {
      setVal(Math.floor(120 + Math.random() * 80) + "ms");
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-24 w-full rounded-xl p-2.5 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden"
      style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>LATENCY MONITOR</div>
      <div className="flex-1 flex items-center justify-center gap-3">
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ borderTop: "1px solid var(--color-primary)", borderLeft: "1px solid transparent", borderRight: "1px solid transparent", borderBottom: "1px solid transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-[7px]">⚡</span>
        </div>
        <div className="text-left">
          <div className="font-bold text-[10px] tracking-wider" style={{ color: "#f1f5f9" }}>{val}</div>
          <div className="text-[7px]" style={{ color: "#64748b" }}>Auto-dispatch delay</div>
        </div>
      </div>
      <div className="text-[7px]" style={{ color: "#475569" }}>Threshold: &lt;2.0s</div>
    </div>
  );
};

// 5. Scale Visualizer
const ScaleVisualizer = () => (
  <div className="relative h-24 w-full rounded-xl overflow-hidden p-2.5 font-mono text-[8px]"
    style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 90">
      <line x1="100" y1="45" x2="30"  y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="100" y1="45" x2="170" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="100" y1="45" x2="40"  y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="100" y1="45" x2="160" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <circle cx="100" cy="45" r="5"  fill="var(--color-primary)" />
      <circle cx="100" cy="45" r="9"  stroke="rgba(124,58,237,0.3)" fill="none" className="animate-ping" />
      <circle cx="30"  cy="20" r="3.5" fill="#334155" />
      <circle cx="170" cy="20" r="3.5" fill="#334155" />
      <circle cx="40"  cy="70" r="3.5" fill="#334155" />
      <circle cx="160" cy="70" r="3.5" fill="#334155" />
    </svg>
    <div className="absolute top-2 left-2 font-semibold uppercase tracking-wider text-[7.5px]" style={{ color: "#64748b" }}>
      OPERATOR CAPACITY
    </div>
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-bold"
      style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c4b5fd" }}>
      1 OPS : 40 ASSETS
    </div>
  </div>
);

// 6. Uptime Visualizer
const UptimeVisualizer = () => (
  <div className="h-24 w-full rounded-xl p-2.5 flex flex-col justify-between font-mono text-[9px] relative overflow-hidden"
    style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>DAEMON LIFELINE</div>
    <div className="flex-1 flex items-center justify-center gap-2">
      <div className="relative flex items-center justify-center">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
      </div>
      <div className="text-left">
        <div className="font-bold text-[10px]" style={{ color: "#f1f5f9" }}>99.99% UPTIME</div>
        <div className="text-[7px]" style={{ color: "#64748b" }}>Autonomous loop</div>
      </div>
    </div>
    <div className="text-[7px] text-right" style={{ color: "#475569" }}>24/7/365 telemetry</div>
  </div>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "−38%", label: "Operational cost",    desc: "Less coordination overhead, fewer manual touchpoints.", visualizer: CostVisualizer },
  { value: "0",    label: "Manual entry errors", desc: "AI-generated tasks and reports remove human typos.",    visualizer: ErrorsVisualizer },
  { value: "+27%", label: "Fleet efficiency",    desc: "Optimized routes and asset utilization across the network.", visualizer: EfficiencyVisualizer },
  { value: "<2s",  label: "Decision latency",    desc: "Real-time triage instead of meetings and email chains.", visualizer: LatencyVisualizer },
  { value: "10×",  label: "Scale per ops head",  desc: "Grow fleet without proportionally growing your team.",  visualizer: ScaleVisualizer },
  { value: "24/7", label: "Always-on operations",desc: "The system never sleeps, never misses an exception.",  visualizer: UptimeVisualizer },
];

// ─── Component ─────────────────────────────────────────────────────────────────

const Benefits = () => {
  return (
    <section id="benefits" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container-tight relative">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">Outcomes</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4 text-slate-900 dark:text-white">
            What teams unlock with <span className="text-gradient">automation-first ops.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s, i) => {
            const Visualizer = s.visualizer;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative rounded-2xl p-6 flex flex-col justify-between gap-5 overflow-hidden transition-all duration-300 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/[0.08] hover:border-primary/30 hover:shadow-glow"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  <div className="font-display font-bold text-4xl text-gradient-primary mb-2">{s.value}</div>
                  <div className="font-display font-semibold text-[15px] mb-2 text-slate-800 dark:text-slate-100">{s.label}</div>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
                </div>

                <div className="relative mt-auto pt-1">
                  <Visualizer />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

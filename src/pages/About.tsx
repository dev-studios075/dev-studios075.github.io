import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight,
  Zap, Shield, Heart, Globe, Target, Lightbulb,
  Users, TrendingUp, BarChart3, Clock,
  Sun, Moon, Sparkles, MapPin, Mail,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/landing/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "500+",  label: "Fleets managed",         icon: TrendingUp },
  { value: "12k+",  label: "Vehicles tracked daily", icon: MapPin     },
  { value: "38%",   label: "Avg cost reduction",     icon: BarChart3  },
  { value: "14d",   label: "Deploy guarantee",       icon: Clock      },
];

const values = [
  {
    icon: Target,
    title: "Operator-First",
    desc: "Every feature starts with a real pain point from a fleet operator, not a product brainstorm session.",
  },
  {
    icon: Zap,
    title: "Automation Over Headcount",
    desc: "We believe the best logistics companies of the next decade will run 10x the volume with the same team — through software.",
  },
  {
    icon: Shield,
    title: "Trust Through Reliability",
    desc: "A TMS that's down costs real money. We obsess over uptime, data accuracy, and response times.",
  },
  {
    icon: Lightbulb,
    title: "Simplicity at Scale",
    desc: "Complex operations shouldn't mean complex software. We hide the complexity so your team can focus on moving goods.",
  },
  {
    icon: Heart,
    title: "Long-Term Partnerships",
    desc: "We don't do pilots that go nowhere. Our 14-day deployment SLA and dedicated CSM model is built for real adoption.",
  },
  {
    icon: Globe,
    title: "India-Built, India-First",
    desc: "Designed ground-up for Indian logistics — Fastag, e-way bills, regional languages, and India-specific compliance.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Founding & Launch",
    desc: "Founded with a mission to eliminate manual dispatch. Launched our core platform to early fleet operators in Pune.",
  },
  {
    year: "2025",
    title: "100+ Active Fleets",
    desc: "Crossed 100+ active fleets. Shipped our automated billing engine, driver app, and real-time Fastag integration.",
  },
  {
    year: "2026",
    title: "AI-Powered Dispatch",
    desc: "Expanded to 500+ fleets across India. Launched AI dispatch planning, automated route optimization, and instant e-way bills.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const About = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Seo
        title={`About Us | ${SITE_NAME}`}
        description="Learn how Fleetcodes was built by logistics operators for logistics operators — and why we're obsessed with automating fleet management across India."
        path="/about"
      />

      {/* Background — fixed so they never affect scroll height */}
      <div className="fixed top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-primary/7 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed inset-0 grid-bg opacity-[0.12] pointer-events-none -z-10" />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div className="container-tight">
          <nav
            className="flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300"
            style={{
              background: scrolled
                ? theme === "dark" ? "rgba(15,17,25,0.88)" : "rgba(255,255,255,0.92)"
                : theme === "dark" ? "rgba(15,17,25,0.4)"  : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: scrolled
                ? theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
                : "1px solid transparent",
              boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.12)" : "none",
            }}
          >
            <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg shrink-0">
              <span className="relative grid place-items-center w-8 h-8 rounded-xl bg-white border border-border/40 shadow-sm overflow-hidden shrink-0">
                <img src="/favicon.png" alt="Fleetcodes Logo" className="w-5 h-5 object-contain" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
              </span>
              <span className="text-gradient hidden sm:inline">Fleetcodes</span>
              <span className="text-muted-foreground/60 text-[10px] font-body uppercase tracking-[0.18em] hidden lg:inline border-l border-border/40 pl-2.5">TMS</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="w-px h-5 bg-border/60 hidden sm:block" />
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-20 sm:pt-44 sm:pb-24 text-center relative">
        <div className="container-tight">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20 bg-primary/5 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Our story
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-slate-900 dark:text-white max-w-4xl mx-auto mb-6">
            Built by operators,{" "}
            <span className="text-gradient-primary">for operators.</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            We started Fleetcodes because we lived the chaos of running fleet operations manually.
            WhatsApp dispatch. Paper chalans. Excel billing. We knew there was a better way.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/book-demo"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
            >
              See the Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/careers"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="p-6 rounded-2xl text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] group hover:border-primary/30 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </div>
                  <div className="font-display font-bold text-3xl text-gradient-primary mb-1">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4 text-primary">Mission</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-6 leading-tight">
                Make Indian logistics run on{" "}
                <span className="text-gradient-primary">software, not instinct.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 text-base">
                India moves ₹140 lakh crore of goods every year, yet most of it is managed with
                phone calls, paper receipts, and tribal knowledge locked in a dispatcher's head.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                Fleetcodes is building the operating system for Indian logistics — a platform that gives
                every fleet manager the same digital leverage that a Fortune 500 company has, at a price
                that makes sense for a 50-truck operation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1117]/80 border border-slate-200 dark:border-white/[0.08] shadow-2xl relative overflow-hidden font-mono text-left select-none">
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-10 bg-primary/10 blur-xl rounded-full pointer-events-none" />

              {/* Console Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Network Console</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/20 dark:bg-red-500/25" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/20 dark:bg-yellow-500/25" />
                  <span className="w-2 h-2 rounded-full bg-green-500/20 dark:bg-green-500/25" />
                </div>
              </div>

              {/* Grid of Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { value: "90%",   label: "Dispatch Auto" },
                  { value: "99.9%", label: "GPS Telemetry" },
                  { value: "97%",   label: "Billing Match" },
                  { value: "94%",   label: "TMS Retention" },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] text-center hover:border-primary/20 hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-all duration-300">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-medium truncate">{s.label}</div>
                    <div className="text-xl font-bold font-display text-gradient-primary">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Live Telemetry Stream Terminal */}
              <div className="space-y-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-black/45 p-4 rounded-xl border border-slate-200/50 dark:border-white/[0.03]">
                <div className="text-emerald-600 dark:text-emerald-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:01] MH-12-Q-4029 auto-dispatched</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:14] FASTag matched (toll_id: 8291)</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:28] Telemetry ping received (12k/sec)</span>
                </div>
                <div className="text-primary/90 flex items-center gap-1.5 animate-pulse">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:31] Syncing billing ledger...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story / Timeline ───────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3 text-primary">Our Journey</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              How we got here
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year + m.title} className="flex gap-6 group">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-xs text-primary transition-all group-hover:scale-110"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 my-2 bg-slate-200 dark:bg-white/[0.07]" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-10 ${i === milestones.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-primary mb-1">{m.year}</p>
                  <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3 text-primary">Principles</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              What we believe in
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07]"
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </span>
                  <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20 bg-primary/5 mb-6">
                <Users className="w-3.5 h-3.5" />
                500+ fleets trust Fleetcodes
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
                Ready to see it in action?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Book a 30-minute live walkthrough. We'll show you how your fleet can cut operational
                costs by 38% and run on autopilot.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/book-demo"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
                >
                  Book a Live Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="mailto:support@fleetcodes.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
                >
                  <Mail className="w-4 h-4" />
                  support@fleetcodes.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

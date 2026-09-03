import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, MapPin, Clock, Briefcase,
  Code2, BarChart3, Headphones, Rocket, Globe, Heart,
  Laptop, ShieldCheck, Zap, Users, TrendingUp, Coffee,
  ChevronDown, ChevronUp, Sparkles, Star, Check,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Data ─────────────────────────────────────────────────────────────────────
const valueDefaults = [
  {
    icon: Rocket,
    title: "Move Fast",
    desc: "We ship weekly. Every engineer owns their feature end-to-end — from PRD to production.",
  },
  {
    icon: Users,
    title: "Customer Obsessed",
    desc: "Every decision starts with the fleet operator. We regularly ride along on deliveries to stay grounded.",
  },
  {
    icon: Globe,
    title: "Remote-First",
    desc: "Work from wherever you do your best thinking. We care about output, not office hours.",
  },
  {
    icon: TrendingUp,
    title: "High Ownership",
    desc: "Small team, big surface area. You'll have real equity and real impact from day one.",
  },
];

const perkDefaults = [
  { icon: Laptop,      label: "Remote-first",          desc: "Work from anywhere in India" },
  { icon: Heart,       label: "Health Insurance",       desc: "Full family coverage included" },
  { icon: ShieldCheck, label: "ESOP",                   desc: "Equity stake in Fleetcodes" },
  { icon: Coffee,      label: "Flexible Hours",         desc: "Async-first culture" },
  { icon: Zap,         label: "Learning Budget",        desc: "₹50k/year for courses & books" },
  { icon: Star,        label: "Annual Retreats",        desc: "Full team off-sites twice a year" },
];

type Job = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  level: string;
  icon: React.ElementType;
  desc: string;
  responsibilities: string[];
  requirements: string[];
};

const jobDefaults: Job[] = [
  {
    id: "swe-backend",
    title: "Senior Backend Engineer",
    team: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    level: "Senior",
    icon: Code2,
    desc: "Build the data pipelines and APIs that power real-time fleet tracking, dispatch automation, and billing for thousands of vehicles.",
    responsibilities: [
      "Design and maintain high-throughput microservices in Node.js / Python",
      "Own the GPS data ingestion pipeline (10M+ events/day)",
      "Collaborate with product on dispatch automation features",
      "Set engineering standards and mentor junior engineers",
    ],
    requirements: [
      "5+ years backend experience (Node.js, Python, or Go)",
      "Strong understanding of event-driven architectures (Kafka / RabbitMQ)",
      "Experience with PostgreSQL, Redis, and cloud platforms (AWS / GCP)",
      "Bonus: logistics, IoT, or fintech domain experience",
    ],
  },
  {
    id: "swe-frontend",
    title: "Frontend Engineer",
    team: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    level: "Mid–Senior",
    icon: Code2,
    desc: "Own the operator dashboard — the control tower used by fleet managers to dispatch trips, monitor vehicles, and settle payments in real time.",
    responsibilities: [
      "Build performant React + TypeScript dashboards with live data updates",
      "Implement map-based vehicle tracking UI using Mapbox / Leaflet",
      "Own the design system and component library",
      "Work closely with design to ship pixel-perfect experiences",
    ],
    requirements: [
      "4+ years of React / TypeScript experience",
      "Strong CSS skills (Tailwind, animation, responsive design)",
      "Experience with real-time data (WebSockets, SSE)",
      "Bonus: experience with mapping libraries or logistics tools",
    ],
  },
  {
    id: "pm",
    title: "Product Manager – Fleet Operations",
    team: "Product",
    location: "Remote (India)",
    type: "Full-time",
    level: "Senior",
    icon: BarChart3,
    desc: "Define the product roadmap for our core TMS — dispatch, GPS tracking, Fastag integration, and freight billing.",
    responsibilities: [
      "Own the 0→1 roadmap for new fleet automation modules",
      "Interview fleet operators weekly to identify pain points",
      "Write detailed PRDs and work with engineering on delivery",
      "Define and track KPIs for feature adoption and retention",
    ],
    requirements: [
      "4+ years of B2B SaaS product management",
      "Strong analytical skills (SQL preferred)",
      "Experience in logistics, supply chain, or fleet management",
      "Ability to translate operational workflows into product specs",
    ],
  },
  {
    id: "bdm",
    title: "Business Development Manager",
    team: "Sales",
    location: "Hybrid – Bangalore / Remote",
    type: "Full-time",
    level: "Mid–Senior",
    icon: TrendingUp,
    desc: "Own the full sales cycle for mid-market and enterprise fleet operators across India.",
    responsibilities: [
      "Identify and qualify logistics companies with 50+ vehicle fleets",
      "Conduct product demos and manage pilot deployments",
      "Negotiate contracts and close ₹10L–₹1Cr ARR deals",
      "Build relationships with logistics associations and transport unions",
    ],
    requirements: [
      "3+ years B2B enterprise sales (SaaS or logistics preferred)",
      "Strong network in the Indian logistics / transport ecosystem",
      "Proven track record of closing deals >₹20L ACV",
      "Willingness to travel 20–30% for client meetings",
    ],
  },
  {
    id: "csm",
    title: "Customer Success Manager",
    team: "Customer Success",
    location: "Remote (India)",
    type: "Full-time",
    level: "Mid",
    icon: Headphones,
    desc: "Ensure our fleet operators go live fast, use the platform deeply, and renew every year.",
    responsibilities: [
      "Own onboarding for new customers (14-day deployment SLA)",
      "Conduct weekly check-ins with top 20 accounts",
      "Identify expansion opportunities within existing accounts",
      "Collect and synthesize product feedback for the PM team",
    ],
    requirements: [
      "2+ years in customer success, account management, or logistics ops",
      "Strong communication and relationship-building skills",
      "Ability to understand and explain technical product features",
      "Bonus: prior experience in fleet or transport industry",
    ],
  },
];

const JobCard = ({ job }: { job: Job }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const Icon = job.icon;

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !resume) {
      setError(t("pages.careers.form.required"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("pages.careers.form.invalidEmail"));
      return;
    }

    setSubmitting(true);
    setError("");

    const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        const finalMessage = `Role: ${job.title}
LinkedIn: ${linkedin || "N/A"}
Resume/Portfolio: ${resume}

Message:
${message || "N/A"}`;

        const params = new URLSearchParams();
        params.append("name", name);
        params.append("email", email);
        params.append("message", finalMessage);
        params.append("source", "Careers Application");

        await fetch(sheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      } catch (err) {
        /* ignore error for no-cors */
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    setName("");
    setEmail("");
    setLinkedin("");
    setResume("");
    setMessage("");
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 bg-white dark:bg-white/[0.03] border ${
        open
          ? "border-primary/40 shadow-[0_0_0_1px_rgba(124,58,237,0.1),0_8px_32px_rgba(0,0,0,0.1)]"
          : "border-slate-200 dark:border-white/[0.07]"
      }`}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-start gap-4">
          <span
            className="mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            <Icon className="w-5 h-5" style={{ color: "#7c3aed" }} />
          </span>
          <div>
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white mb-1.5 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Briefcase className="w-3 h-3" /> {job.team}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3" /> {job.location}
              </span>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" /> {job.type}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                {job.level}
              </span>
            </div>
          </div>
        </div>
        <div className="shrink-0 ml-4">
          {open
            ? <ChevronUp className="w-5 h-5 text-primary" />
            : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          }
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-100 dark:border-white/[0.06]">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-5">{job.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.15em] mb-3 text-primary">
                {t("pages.careers.responsibilities")}
              </p>
              <ul className="space-y-2">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.15em] mb-3 text-primary">
                {t("pages.careers.requirements")}
              </p>
              <ul className="space-y-2">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4">
            {!formOpen ? (
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all cursor-pointer"
              >
                {t("pages.careers.apply")} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="pt-6 border-t border-slate-100 dark:border-white/[0.06] animate-fade-in">
                <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-white mb-4">
                  {t("pages.careers.applyFor", { role: job.title })}
                </h4>
                
                {submitted ? (
                  <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-sm font-medium leading-relaxed animate-scale-in">
                    <p className="font-semibold mb-1">{t("pages.careers.form.success")}</p>
                    <p className="text-xs opacity-90">{t("pages.careers.form.successText")}</p>
                    <button 
                      onClick={() => { setFormOpen(false); setSubmitted(false); }}
                      className="mt-3 text-xs underline font-semibold cursor-pointer"
                    >
                      {t("pages.careers.form.close")}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor={`name-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {t("pages.careers.form.name")}
                        </Label>
                        <Input
                          id={`name-${job.id}`}
                          type="text"
                          required
                          placeholder={t("pages.careers.form.namePlaceholder")}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`email-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {t("pages.careers.form.email")}
                        </Label>
                        <Input
                          id={`email-${job.id}`}
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor={`linkedin-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {t("pages.careers.form.linkedin")}
                        </Label>
                        <Input
                          id={`linkedin-${job.id}`}
                          type="url"
                          placeholder="https://linkedin.com/in/username"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`resume-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {t("pages.careers.form.resume")}
                        </Label>
                        <Input
                          id={`resume-${job.id}`}
                          type="url"
                          required
                          placeholder={t("pages.careers.form.resumePlaceholder")}
                          value={resume}
                          onChange={(e) => setResume(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`message-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {t("pages.careers.form.why")}
                      </Label>
                      <Textarea
                        id={`message-${job.id}`}
                        rows={3}
                        placeholder={t("pages.careers.form.whyPlaceholder")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-xs text-destructive/80 font-medium font-sans">
                        {error}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all cursor-pointer disabled:opacity-50"
                      >
                        {submitting ? t("pages.careers.form.submitting") : t("pages.careers.form.submit")}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFormOpen(false); setError(""); }}
                        className="text-sm font-semibold px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
                      >
                        {t("pages.careers.form.cancel")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page Component ────────────────────────────────────────────────────────────
const Careers = () => {
  const { t, tObject } = useTranslation();
  const values = tObject<Array<{ title: string; desc: string }>>("pages.careers.values").map((item, index) => ({ ...item, icon: valueDefaults[index].icon }));
  const perks = tObject<Array<{ label: string; desc: string }>>("pages.careers.perks").map((item, index) => ({ ...item, icon: perkDefaults[index].icon }));
  const translatedJobs = tObject<Array<Omit<Job, "icon">>>("pages.careers.jobs");
  const jobs = translatedJobs.map((item, index) => ({ ...item, icon: jobDefaults[index].icon }));
  const stats = tObject<Array<{ value: string; label: string }>>("pages.careers.stats");
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Seo
        title={t("pages.careers.seoTitle")}
        description={t("pages.careers.seoDescription")}
        path="/careers"
      />

      {/* Background — fixed so they never affect scroll height */}
      <div className="fixed top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-primary/7 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed inset-0 grid-bg opacity-[0.12] pointer-events-none -z-10" />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-14 text-center sm:pt-36 sm:pb-16 lg:pt-40">
        <div className="container-tight">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            {t("pages.careers.heroBadge")}
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-slate-900 dark:text-white max-w-4xl mx-auto mb-6">
            {t("pages.careers.heroTitle")}{" "}
            <span className="text-gradient-primary">{t("pages.careers.heroAccent")}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
            {t("pages.careers.heroDescription")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#open-roles"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
            >
              {t("pages.careers.viewRoles")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:careers@fleetcodes.com"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
            >
              {t("pages.careers.openApplication")}
            </a>
          </div>

          {/* Quick stats */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-3xl text-gradient-primary mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              {t("pages.careers.cultureLabel")}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {t("pages.careers.cultureTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:scale-[1.02] dark:border-white/[0.07] dark:bg-white/[0.02]"
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
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Open Roles ─────────────────────────────────────────────────────── */}
      <section id="open-roles" className="scroll-mt-24 border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              {t("pages.careers.rolesLabel")}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              {t("pages.careers.rolesTitle")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
              {t("pages.careers.rolesDescription")}
            </p>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              {t("pages.careers.benefitsLabel")}
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {t("pages.careers.benefitsTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {perks.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.label}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06]"
                >
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.18)" }}
                  >
                    <Icon className="w-4 h-4" style={{ color: "#7c3aed" }} />
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-0.5">{p.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center sm:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            <div className="relative">
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4" style={{ color: "#7c3aed" }}>
                {t("pages.careers.ctaLabel")}
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
                {t("pages.careers.ctaTitle")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                {t("pages.careers.ctaDescription")}
              </p>
              <a
                href="mailto:careers@fleetcodes.com"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
              >
                {t("pages.careers.ctaButton")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Careers;

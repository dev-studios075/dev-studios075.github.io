import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, MapPin, Clock, Briefcase,
  Code2, BarChart3, Headphones, Rocket, Globe, Heart,
  Laptop, ShieldCheck, Zap, Users, TrendingUp, Coffee,
  ChevronDown, ChevronUp, Sparkles, Star, Check,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ─── Data ─────────────────────────────────────────────────────────────────────
const values = [
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

const perks = [
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

const jobs: Job[] = [
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
      setError("Name, email, and resume link are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
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
                Responsibilities
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
                Requirements
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
                Apply for this role <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="pt-6 border-t border-slate-100 dark:border-white/[0.06] animate-fade-in">
                <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-white mb-4">
                  Apply for {job.title}
                </h4>
                
                {submitted ? (
                  <div className="p-4 rounded-xl bg-success/15 border border-success/30 text-success text-sm font-medium leading-relaxed animate-scale-in">
                    <p className="font-semibold mb-1">Application Submitted Successfully!</p>
                    <p className="text-xs opacity-90">Thank you for applying. Our hiring team will review your details and get back to you shortly.</p>
                    <button 
                      onClick={() => { setFormOpen(false); setSubmitted(false); }}
                      className="mt-3 text-xs underline font-semibold cursor-pointer"
                    >
                      Close Form
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor={`name-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Full Name *
                        </Label>
                        <Input
                          id={`name-${job.id}`}
                          type="text"
                          required
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`email-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Email Address *
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
                          LinkedIn Profile URL
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
                          Resume/Portfolio Link *
                        </Label>
                        <Input
                          id={`resume-${job.id}`}
                          type="url"
                          required
                          placeholder="Google Drive, Dropbox, or PDF URL"
                          value={resume}
                          onChange={(e) => setResume(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor={`message-${job.id}`} className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Why Fleetcodes? (Optional)
                      </Label>
                      <Textarea
                        id={`message-${job.id}`}
                        rows={3}
                        placeholder="Tell us why you want to join our team..."
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
                        {submitting ? "Submitting..." : "Submit Application"}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => { setFormOpen(false); setError(""); }}
                        className="text-sm font-semibold px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
                      >
                        Cancel
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
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Seo
        title={`Careers | ${SITE_NAME}`}
        description="Join the Fleetcodes team and help build the automation-first TMS transforming Indian logistics. View open roles in engineering, product, and sales."
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
      <section className="pt-40 pb-24 sm:pt-44 sm:pb-28 text-center relative">
        <div className="container-tight">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20 bg-primary/5 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            We're hiring across 5 roles
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-slate-900 dark:text-white max-w-4xl mx-auto mb-6">
            Build the Future of{" "}
            <span className="text-gradient-primary">Logistics</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Join a small, high-ownership team solving one of India's biggest operational challenges —
            moving goods efficiently at scale.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#open-roles"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
            >
              View Open Roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:careers@fleetcodes.com"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
            >
              Send Open Application
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-14">
            {[
              { value: "15+", label: "Team size" },
              { value: "100%", label: "Remote-friendly" },
              { value: "5", label: "Open roles" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-bold text-3xl text-gradient-primary mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              Culture
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              How we work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Open Roles ─────────────────────────────────────────────────────── */}
      <section id="open-roles" className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              Open Positions
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
              Find your role
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
              Click any role to expand — see responsibilities, requirements, and apply directly.
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
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div className="text-center mb-14">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "#7c3aed" }}>
              Benefits
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              What you get
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
      <section className="py-20 border-t border-slate-200 dark:border-white/[0.05]">
        <div className="container-tight">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            <div className="relative">
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4" style={{ color: "#7c3aed" }}>
                Don't see a fit?
              </p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
                Send us your CV anyway
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                We hire for talent, not just headcount. If you're exceptional at what you do and care about
                logistics, we want to hear from you.
              </p>
              <a
                href="mailto:careers@fleetcodes.com"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
              >
                Email careers@fleetcodes.com
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

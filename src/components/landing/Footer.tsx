import { useState } from "react";
import { Linkedin, Twitter, Github, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────
const cols = [
  {
    title: "Product",
    links: [
      { label: "Features",            href: "/#features" },
      { label: "How it works",        href: "/#how"      },
      { label: "GPS & Fastag",        href: "/#features" },
      { label: "Dispatch Automation", href: "/#features" },
      { label: "Integrations",        href: "#"          },
      { label: "Security",            href: "#"          },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",     href: "/about", isInternal: true      },
      { label: "Customers", href: "#" },
      { label: "Careers",   href: "/careers", isInternal: true },
      { label: "Press",     href: "#" },
      { label: "Contact",   href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog",          href: "/blog", isInternal: true },
      { label: "Documentation", href: "#" },
      { label: "API",           href: "#" },
      { label: "Case Studies",  href: "#" },
      { label: "Changelog",     href: "#" },
    ],
  },

];

const socials = [
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter,  href: "#", label: "Twitter"  },
  { Icon: Github,   href: "#", label: "GitHub"   },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);

    const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        const params = new URLSearchParams();
        params.append("email",  email);
        params.append("source", "News Letter");
        await fetch(sheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      } catch { /* no-cors fetch always throws — ignore */ }
    }

    setLoading(false);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: "#0a0d14" }}>
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[200px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* ── Newsletter strip ───────────────────────────────────────────────── */}
      <div className="border-b relative" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="container-tight py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.18em] mb-1.5" style={{ color: "#7c3aed" }}>
              NEWSLETTER
            </p>
            <h3 className="font-display font-semibold text-lg text-white mb-1">
              Stay ahead of logistics
            </h3>
            <p className="text-sm" style={{ color: "#64748b" }}>
              Product updates, industry insights, and automation tips — weekly.
            </p>
          </div>
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="flex-1 lg:w-60 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Subscribing…" : <>{"Subscribe"} <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </form>
          ) : (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              You're subscribed — welcome aboard! 🎉
            </div>
          )}
        </div>
      </div>

      {/* ── Main columns ───────────────────────────────────────────────────── */}
      <div className="container-tight pt-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg w-fit">
              <span className="relative grid place-items-center w-8 h-8 rounded-xl bg-white border border-white/10 overflow-hidden shrink-0">
                <img src="/favicon.png" alt="Fleetcodes Logo" className="w-5 h-5 object-contain" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#0a0d14]" />
              </span>
              <span className="text-white font-bold">Fleetcodes</span>
              <span
                className="text-[10px] font-body uppercase tracking-[0.18em] border-l border-white/10 pl-2.5"
                style={{ color: "#64748b" }}
              >
                TMS
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#64748b" }}>
              Automation-first TMS for logistics, fleet, and supply-chain enterprises.
              Built to think, decide, and execute — without human intervention.
            </p>

            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational · 99.99% uptime
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-1">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 grid place-items-center rounded-lg transition-all duration-200 hover:bg-white/[0.06] group/icon"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-4 h-4 text-slate-500 group-hover/icon:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <h4
                className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-6"
                style={{ color: "#64748b" }}
              >
                {c.title}
              </h4>
              <ul className="space-y-4">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {"isInternal" in l && l.isInternal ? (
                      <Link
                        to={l.href}
                        className="text-sm transition-all duration-200 hover:text-white w-fit block"
                        style={{ color: "#94a3b8" }}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <a
                        href={l.href}
                        className="text-sm transition-all duration-200 hover:text-white w-fit block"
                        style={{ color: "#94a3b8" }}
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs" style={{ color: "#4b5563" }}>
              © {new Date().getFullYear()} Fleetcodes Technologies Pvt. Ltd. · All rights reserved.
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <span
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}
              >
                <Shield className="w-2.5 h-2.5" /> SOC 2
              </span>
              <span
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}
              >
                <Zap className="w-2.5 h-2.5" /> 14-day deploy
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs" style={{ color: "#4b5563" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Linkedin, Twitter, Github, Shield, Zap, ArrowRight, ArrowDownToLine } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import { APP_DOWNLOAD_QR_SRC, APP_DOWNLOAD_URL, LINKEDIN_URL } from "@/lib/site";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features",            href: "/#features" },
      { label: "How it works",        href: "/#how"      },
      { label: "Compare",             href: "/#compare"  },
      { label: "Savings Estimator",   href: "/#roi-calculator" },
      { label: "Outcomes",            href: "/#benefits" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",     href: "/about", isInternal: true      },
      { label: "Careers",   href: "/careers", isInternal: true },
      { label: "Book a Demo", href: "/book-demo", isInternal: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog",          href: "/blog", isInternal: true },
      { label: "FAQ",           href: "/#faq" },
    ],
  },
];

const socials = [
  { Icon: Linkedin, href: LINKEDIN_URL, label: "Fleetcodes on LinkedIn" },
  { Icon: Twitter,  href: "#", label: "Twitter"  },
  { Icon: Github,   href: "#", label: "GitHub"   },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Footer = () => {
  const [email, setEmail]         = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading]       = useState(false);

  const trackFooterAppDownload = () => {
    trackEvent("app_download_click", {
      cta_label: "Footer download app",
      cta_location: "footer",
    });
  };

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
    <footer id="footer" className="relative overflow-hidden" style={{ background: "#0a0d14" }}>
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-primary/8 blur-[130px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[200px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      {/* ── Newsletter strip ───────────────────────────────────────────────── */}
      <div className="border-b relative" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="container-tight py-8 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
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
            <form onSubmit={handleSubscribe} className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="min-w-0 flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all focus:outline-none sm:min-w-64 lg:w-64"
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
                className="flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
      <div className="container-tight pt-12 pb-10 lg:pt-14">
        <div className="mb-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mb-14 lg:grid-cols-[minmax(260px,1.3fr)_minmax(110px,0.6fr)_minmax(110px,0.6fr)_minmax(110px,0.6fr)_minmax(290px,0.9fr)] xl:gap-x-12">

          {/* Brand column */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
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

            <p className="max-w-sm text-sm leading-relaxed lg:max-w-xs" style={{ color: "#64748b" }}>
              Automation-first TMS for logistics, fleet, and supply-chain enterprises.
              Built to think, decide, and execute — without human intervention.
            </p>

            {/* Status badge */}
            <div
              className="inline-flex max-w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-mono"
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
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
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
                className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#64748b" }}
              >
                {c.title}
              </h4>
              <ul className="space-y-3.5">
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

          {/* App download column */}
          <div className="lg:justify-self-end xl:justify-self-start">
            <h4
              className="mb-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#64748b" }}
            >
              Download App
            </h4>
            <div
              className="flex w-full max-w-[300px] items-center gap-3 rounded-2xl p-3 sm:max-w-[330px] lg:max-w-[300px]"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <a
                href={APP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackFooterAppDownload}
                className="shrink-0 rounded-xl bg-white p-2 shadow-sm transition-transform hover:scale-[1.02]"
                aria-label="Download Fleetcodes app using QR code"
              >
                <img
                  src={APP_DOWNLOAD_QR_SRC}
                  alt="Scan QR to download Fleetcodes Android app"
                  className="h-28 w-28 object-contain"
                  loading="lazy"
                />
              </a>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Fleetcodes App</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "#64748b" }}>
                  Scan QR or install Android APK directly.
                </p>
                <a
                  href={APP_DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackFooterAppDownload}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
                >
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                  Download APK
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div
          className="flex flex-col gap-5 border-t pt-6 lg:flex-row lg:items-center lg:justify-between"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <p className="text-xs" style={{ color: "#4b5563" }}>
              © {new Date().getFullYear()} Fleetcodes Technologies Pvt. Ltd. · All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-2">
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

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs" style={{ color: "#4b5563" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

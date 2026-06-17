import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun, X, ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { trackEvent } from "@/lib/analytics";

const links = [
  { label: "Product",      href: "/#features", internal: false },
  { label: "How it works", href: "/#how",      internal: false },
  { label: "Why us",       href: "/#compare",  internal: false },
  { label: "Benefits",     href: "/#benefits", internal: false },
  { label: "Blog",         href: "/blog",      internal: true  },
];

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const { theme, toggleTheme }    = useTheme();
  const location                  = useLocation();

  const trackNavEvent = (label: string, loc: string) => {
    trackEvent(label === "Sign in" ? "login_click" : "generate_lead", {
      cta_label: label,
      cta_location: loc,
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location]);

  const NavLink = ({ l }: { l: typeof links[0] }) => {
    const cls =
      "relative px-3.5 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg " +
      "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white " +
      "hover:bg-slate-100/80 dark:hover:bg-white/[0.06] group";

    return l.internal ? (
      <Link key={l.href} to={l.href} className={cls}>
        {l.label}
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-4 bg-primary rounded-full transition-all duration-300" />
      </Link>
    ) : (
      <a key={l.href} href={l.href} className={cls}>
        {l.label}
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-4 bg-primary rounded-full transition-all duration-300" />
      </a>
    );
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "pt-3 pb-0" : "pt-5 pb-0"
      }`}
    >
      <div className="container-tight">
        {/* ── Floating pill navbar ── */}
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${
            scrolled
              ? "shadow-lg dark:shadow-black/40"
              : ""
          }`}
          style={{
            background: scrolled
              ? theme === "dark"
                ? "rgba(15,17,25,0.85)"
                : "rgba(255,255,255,0.88)"
              : theme === "dark"
              ? "rgba(15,17,25,0.4)"
              : "rgba(255,255,255,0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: scrolled
              ? theme === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.08)"
              : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg shrink-0">
            <span className="relative grid place-items-center w-8 h-8 rounded-xl bg-white border border-border/40 shadow-sm overflow-hidden shrink-0">
              <img src="/favicon.png" alt="Fleetcodes Logo" className="w-5 h-5 object-contain" />
              {/* Live pulse dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
            </span>
            <span className="text-gradient hidden sm:inline">Fleetcodes</span>
            <span className="text-muted-foreground text-[10px] font-body uppercase tracking-[0.18em] hidden lg:inline border-l border-border/40 pl-2.5">
              TMS
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => <NavLink key={l.href} l={l} />)}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all duration-200"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-border/60" />

            {/* Sign in */}
            <a
              href="https://app.fleetcodes.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackNavEvent("Sign in", "desktop_nav")}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-slate-100/80 dark:hover:bg-white/[0.06]"
            >
              Sign in
            </a>

            {/* Book Demo CTA */}
            <Link
              to="/book-demo"
              onClick={() => trackNavEvent("Book Demo", "desktop_nav")}
              className="group flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-primary transition-all duration-200 hover:opacity-90 hover:shadow-glow"
            >
              Book Demo
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* ── Mobile dropdown ── */}
        {open && (
          <div
            className="md:hidden mt-2 rounded-2xl p-3 flex flex-col gap-1 animate-fade-in-up"
            style={{
              background: theme === "dark" ? "rgba(15,17,25,0.95)" : "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            {links.map((l) =>
              l.internal ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                >
                  {l.label}
                </a>
              ),
            )}

            <div className="my-1 border-t border-border/40" />

            <a
              href="https://app.fleetcodes.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackNavEvent("Sign in", "mobile_nav"); setOpen(false); }}
              className="px-4 py-2.5 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:text-foreground dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
            >
              Sign in
            </a>
            <Link
              to="/book-demo"
              onClick={() => { trackNavEvent("Book Demo", "mobile_nav"); setOpen(false); }}
              className="flex items-center justify-center gap-2 mt-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary transition-all"
            >
              Book Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

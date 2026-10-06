import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, Moon, Sun, X, ArrowRight, ChevronDown,
  Layers, GitMerge, Zap, Receipt, BookOpen, 
  Info, Briefcase, Mail, HelpCircle, Smartphone, Languages
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ─── Types ────────────────────────────────────────────────────────────────────
type DropItem = { label: string; desc: string; href: string; icon: React.ElementType; internal?: boolean };
type NavItem  = { label: string; href?: string; internal?: boolean; dropdown?: DropItem[] };
type DropPos  = { left: number; top: number; width: number };

// ─── Nav data ─────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    label: "Product",
    dropdown: [
      { label: "Features",             desc: "Explore all platform capabilities",  href: "/#features", icon: Layers   },
      { label: "How it works",         desc: "Step-by-step automation flow",       href: "/#how",      icon: GitMerge },
      { label: "Savings Estimator",    desc: "Calculate your operational savings", href: "/#roi-calculator", icon: Receipt  },
      { label: "Outcomes",             desc: "What teams unlock with automation-first ops", href: "/#benefits", icon: Zap },
      { label: "Mobile app",           desc: "Scan QR code to download the app",   href: "/#footer", icon: Smartphone },
    ],
  },
  {
    label: "Resources",
    dropdown: [
      { label: "Blog",          desc: "Industry insights & updates",           href: "/blog/", icon: BookOpen, internal: true },
      { label: "FAQ",           desc: "Frequently asked questions",            href: "/#faq", icon: HelpCircle },
    ],
  },
  {
    label: "Company",
    dropdown: [
      { label: "About",         desc: "Our story and mission",                  href: "/about/", icon: Info, internal: true      },
      { label: "Careers",       desc: "Join the Fleetcodes team",              href: "/careers/", icon: Briefcase, internal: true },
      { label: "Book a Demo",   desc: "Schedule a live walkthrough",            href: "/book-demo/", icon: Mail, internal: true },
    ],
  },
];

// ─── Dropdown mega-panel ───────────────────────────────────────────────────────
// Matches the exact left/right edges of the navbar pill (same width)
const DropPanel = ({
  label, items, theme, close, width,
}: { label: string; items: DropItem[]; theme: string; close: () => void; width: number }) => {
  const cols = items.length >= 5 ? 3 : 2;
  return (
    <div
      className="rounded-2xl py-5 px-6"
      style={{
        width,
        background:     theme === "dark" ? "rgba(12,14,22,0.98)" : "rgba(255,255,255,0.99)",
        border:         theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(32px)",
        boxShadow:      "0 20px 60px rgba(0,0,0,0.3)",
      }}
    >
      {/* Section label */}
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: "#7c3aed" }}>
        {label}
      </p>
      {/* Items grid */}
      <div className={`grid gap-1`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.map((item) => {
          const Icon = item.icon;
          const cls =
            "flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 group " +
            "hover:bg-slate-100 dark:hover:bg-white/[0.05]";
          const inner = (
            <>
              <span className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none mb-1 group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
              </div>
            </>
          );
          return item.internal ? (
            <Link key={item.label} to={item.href} onClick={close} className={cls}>{inner}</Link>
          ) : (
            <a key={item.label} href={item.href} onClick={close} className={cls}>{inner}</a>
          );
        })}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled]             = useState(false);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [activeMenu, setActiveMenu]         = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [dropPos, setDropPos]               = useState<DropPos | null>(null);
  const { theme, toggleTheme }              = useTheme();
  const { language, localizePath, setLanguage, t } = useTranslation();
  const location                            = useLocation();
  const leaveTimer                          = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef                              = useRef<HTMLElement>(null); // ref on the nav PILL
  const localizedNavItems = navItems.map((item) => ({
    ...item,
    label: t(`navbarMenu.${item.label}`),
    dropdown: item.dropdown?.map((sub) => ({
      ...sub,
      href: localizePath(sub.href),
      label: t(`navbarMenu.${sub.label}`),
      desc: t(`navbarMenu.${sub.desc}`)
    }))
  }));

  const trackNavEvent = (label: string, loc: string) =>
    trackEvent(label === "Sign in" ? "login_click" : "generate_lead", { cta_label: label, cta_location: loc });

  useEffect(() => {
    let frameId = 0;
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        setScrolled((current) => {
          const next = window.scrollY > 20;
          return current === next ? current : next;
        });
        frameId = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => { setMobileOpen(false); setActiveMenu(null); }, [location]);

  // Compute panel position from the nav PILL rect → panel matches navbar edges exactly
  useEffect(() => {
    if (activeMenu && navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      setDropPos({ left: rect.left, top: rect.bottom + 2, width: rect.width });
    } else if (!activeMenu) {
      setDropPos(null);
    }
  }, [activeMenu, scrolled]);

  const openMenu  = (label: string) => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setActiveMenu(label); };
  const closeMenu = ()               => { leaveTimer.current = setTimeout(() => setActiveMenu(null), 150); };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div className="container-tight">
          {/* ── Main pill — ref for measuring alignment ── */}
          <nav
            ref={navRef}
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "shadow-lg dark:shadow-black/40" : ""}`}
            style={{
              background: scrolled
                ? theme === "dark" ? "rgba(15,17,25,0.88)" : "rgba(255,255,255,0.92)"
                : theme === "dark" ? "rgba(15,17,25,0.4)"  : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: scrolled
                ? theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
                : "1px solid transparent",
            }}
          >
            {/* Logo */}
            <Link to={localizePath("/")} className="flex shrink-0 items-center gap-2" aria-label="Fleetcodes home">
              <img src="/assets/brand/logo-with-bg.png" alt="Fleetcodes" className="h-9 w-9 object-contain" />
              <span className="leading-none">
                <span className="block font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  fleet<span className="text-[#5542f6]">codes</span>
                </span>
                <span className="hidden text-[5px] font-medium uppercase tracking-[0.13em] text-slate-500 sm:block dark:text-slate-400">
                  AI operating system for fleet operations
                </span>
              </span>
            </Link>

            {/* Desktop nav items */}
            <div
              className="hidden lg:flex items-center gap-0.5"
              onMouseLeave={closeMenu}
              onMouseEnter={() => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }}
            >
              {localizedNavItems.map((item) => {
                const hasDropdown = !!item.dropdown;
                const isActive    = activeMenu === item.label;
                const btnCls =
                  "flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 " +
                  "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white " +
                  "hover:bg-slate-100/80 dark:hover:bg-white/[0.06] cursor-pointer select-none";

                return hasDropdown ? (
                  <div
                    key={item.label}
                    onMouseEnter={() => openMenu(item.label)}
                  >
                    <button className={btnCls} aria-haspopup="true" aria-expanded={isActive}>
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                ) : item.internal ? (
                  <Link
                    key={item.label}
                    to={item.href!}
                    className={btnCls}
                    onMouseEnter={() => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setActiveMenu(null); }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href!}
                    className={btnCls}
                    onMouseEnter={() => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setActiveMenu(null); }}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex h-9 items-center rounded-[14px] border border-slate-200 bg-white p-1 dark:border-white/[0.08] dark:bg-white/[0.04] shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
                  className="flex h-7 items-center gap-1.5 rounded-[10px] pl-2 pr-1.5 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                  aria-label={t("navbarMenu.switchLanguage") as string}
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-semibold tracking-wide mt-0.5">{t("navbarMenu.langAbbr")}</span>
                </button>
                <div className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-white/20" />
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  className="flex h-7 w-7 items-center justify-center rounded-[10px] transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                >
                  {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="w-px h-5 bg-border/60" />
              <a
                href="https://app.fleetcodes.com"
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={() => trackNavEvent("Sign in", "desktop_nav")}
                className="flex h-9 items-center justify-center px-4 text-sm font-medium text-slate-700 transition-colors duration-200 rounded-[14px] bg-white border border-slate-200 shadow-sm hover:bg-slate-50 dark:text-slate-300 dark:bg-white/[0.04] dark:border-white/[0.08] dark:hover:bg-white/[0.08] dark:shadow-none"
              >
                {t("navbarMenu.signIn")}
              </a>
              <Link
                to={localizePath("/book-demo/")}
                onClick={() => trackNavEvent("Book Demo", "desktop_nav")}
                className="group flex h-9 items-center justify-center gap-1.5 px-4 rounded-[14px] text-sm font-semibold text-white bg-primary transition-all duration-200 hover:opacity-90 hover:shadow-glow"
              >
                {t("navbarMenu.bookDemo")}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="flex h-9 items-center rounded-[14px] border border-slate-200 bg-white p-1 dark:border-white/[0.08] dark:bg-white/[0.04] shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
                  className="flex h-7 items-center gap-1.5 rounded-[10px] pl-2 pr-1.5 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                  aria-label={t("navbarMenu.switchLanguage") as string}
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-semibold tracking-wide mt-0.5">{t("navbarMenu.langAbbr")}</span>
                </button>
                <div className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-white/20" />
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  className="flex h-7 w-7 items-center justify-center rounded-[10px] transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                >
                  {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-slate-200 bg-white shadow-sm transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </nav>

          {/* ── Mobile Sidebar Menu ── */}
          <>
              {/* Backdrop */}
              <div 
                className={`fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                onClick={() => setMobileOpen(false)}
                aria-hidden={!mobileOpen}
              />
              
              {/* Sidebar */}
              <div
                className={`fixed inset-y-0 right-0 z-[101] flex w-[85%] max-w-sm flex-col shadow-2xl transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{
                  background: theme === "dark" ? "rgba(13,15,22,0.98)" : "rgba(255,255,255,0.98)",
                  borderLeft: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200/50 p-4 dark:border-white/10">
                  <div className="flex shrink-0 items-center gap-2 pl-1">
                    <img src="/assets/brand/logo-with-bg.png" alt="Fleetcodes" className="h-9 w-9 object-contain" />
                    <span className="leading-none">
                      <span className="block font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                        fleet<span className="text-[#5542f6]">codes</span>
                      </span>
                      <span className="block text-[6px] font-medium uppercase tracking-[0.13em] text-slate-500 mt-0.5 dark:text-slate-400">
                        AI operating system for fleet operations
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.1] dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                  {localizedNavItems.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                          >
                            {item.label}
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`} />
                          </button>
                          {mobileExpanded === item.label && (
                            <div className="ml-4 mt-1 flex flex-col gap-1">
                              {item.dropdown.map((sub) =>
                                sub.internal ? (
                                  <Link
                                    key={sub.label}
                                    to={sub.href}
                                    onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                    className="group flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-all hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-white/[0.04] rounded-xl"
                                  >
                                    <sub.icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500" />
                                    {sub.label}
                                  </Link>
                                ) : (
                                  <a
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                                    className="group flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 transition-all hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-white/[0.04] rounded-xl"
                                  >
                                    <sub.icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary dark:text-slate-500" />
                                    {sub.label}
                                  </a>
                                )
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <a
                          href={item.href!}
                          onClick={() => setMobileOpen(false)}
                          className="block px-4 py-3 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}

                  <div className="my-3 border-t border-slate-200 dark:border-white/10" />
                  
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://app.fleetcodes.com"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      onClick={() => { trackNavEvent("Sign in", "mobile_nav"); setMobileOpen(false); }}
                      className="flex w-full items-center justify-center px-4 py-3 text-sm font-medium rounded-xl text-slate-700 border border-slate-200 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-all"
                    >
                      {t("navbarMenu.signIn")}
                    </a>
                    <Link
                      to={localizePath("/book-demo/")}
                      onClick={() => { trackNavEvent("Book Demo", "mobile_nav"); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-primary transition-all shadow-md shadow-primary/20"
                    >
                      {t("navbarMenu.bookDemo")} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </>
        </div>
      </header>

      {/* ── Mega-menu portal ──────────────────────────────────────────────────────
          Rendered at document.body level to escape backdrop-filter containing block.
          Position from navRef.getBoundingClientRect() → panel left = nav left,
          panel width = nav width → perfect edge-to-edge alignment with navbar.
      ─────────────────────────────────────────────────────────────────────────── */}
      {activeMenu && dropPos && (() => {
        const activeItem = localizedNavItems.find(i => i.label === activeMenu);
        return activeItem?.dropdown ? createPortal(
          <div
            className="hidden lg:block animate-fade-in-up"
            style={{
              position: "fixed",
              top:      dropPos.top,
              left:     dropPos.left,
              zIndex:   9999,
            }}
            onMouseEnter={() => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }}
            onMouseLeave={closeMenu}
          >
            <DropPanel
              label={activeItem.label}
              items={activeItem.dropdown}
              theme={theme}
              close={() => setActiveMenu(null)}
              width={dropPos.width}
            />
          </div>,
          document.body
        ) : null;
      })()}
    </>
  );
};

export default Navbar;

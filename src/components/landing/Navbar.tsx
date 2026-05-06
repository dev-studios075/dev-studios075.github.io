import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cpu, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const links = [
  { label: "Product", href: "/#features", internal: false },
  { label: "How it works", href: "/#how", internal: false },
  { label: "Why us", href: "/#compare", internal: false },
  { label: "Benefits", href: "/#benefits", internal: false },
  { label: "Blog", href: "/blog", internal: true },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container-tight">
        <nav
          className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-card" : ""
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg">
            <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary shadow-glow">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </span>
            <span className="text-gradient">ClairTrack</span>
            <span className="text-muted-foreground/70 text-xs font-body uppercase tracking-widest hidden sm:inline">
              TMS
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) =>
              l.internal ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40"
                >
                  {l.label}
                </a>
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="https://app.fleetcodes.com" target="_blank" rel="noopener noreferrer">
                Sign in
              </a>
            </Button>
            <Button variant="hero" size="sm">Book Demo</Button>
          </div>

          <div className="md:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <button
              className="p-2 text-foreground"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-2 animate-fade-in-up">
            {links.map((l) =>
              l.internal ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm rounded-lg hover:bg-muted/40"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm rounded-lg hover:bg-muted/40"
                >
                  {l.label}
                </a>
              ),
            )}
            <a
              href="https://app.fleetcodes.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm rounded-lg hover:bg-muted/40"
            >
              Sign in
            </a>
            <Button variant="hero" className="mt-2">Book Demo</Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

import { Cpu, Linkedin, Twitter, Github } from "lucide-react";
import { Link } from "react-router-dom";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how" },
      { label: "Integrations", href: "#" },
      { label: "Security", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API", href: "#" },
      { label: "Case studies", href: "#" },
      { label: "Blog", href: "/blog", isInternal: true },
      { label: "Changelog", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/60 pt-20 pb-10">
      <div className="container-tight">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg mb-5">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-white border border-border/40 shadow-glow overflow-hidden">
                <img src="/favicon.png" alt="Fleetcodes Logo" className="w-6 h-6 object-contain" />
              </span>
              <span className="text-gradient">Fleetcodes</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
              Automation-first TMS for logistics, fleet, and supply-chain enterprises.
              Built to think, decide, and execute.
            </p>
            <div className="flex items-center gap-3">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 grid place-items-center rounded-lg glass hover:shadow-glow transition-all"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display font-semibold text-sm mb-5">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    {"isInternal" in l && l.isInternal ? (
                      <Link to={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fleetcodes · All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

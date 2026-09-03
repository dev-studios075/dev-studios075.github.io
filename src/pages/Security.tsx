import { useEffect, useState } from "react";
import { Activity, KeyRound, LockKeyhole, Mail, ServerCog, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { SITE_NAME, absolutePageUrl } from "@/lib/site";
import { useTranslation } from "@/hooks/useTranslation";

const sections = [
  { id: "approach", title: "1. Our security approach", content: <p>Fleetcodes uses administrative, technical and organisational measures designed to protect the confidentiality, integrity and availability of customer information. Security is treated as an ongoing operational responsibility, and controls are reviewed as our platform, risks and customer needs evolve.</p> },
  { id: "access", title: "2. Access and account security", content: <p>Access to Fleetcodes is controlled through authenticated accounts and assigned permissions. Customers are responsible for authorising users, reviewing access and protecting login credentials. Our personnel access to customer information is restricted to legitimate operational, support or security needs.</p> },
  { id: "data-protection", title: "3. Data protection", content: <p>Fleetcodes is designed to keep each customer's operational data logically separated within the service. Data transmitted between supported clients and our website or platform is protected using secure HTTPS/TLS connections. We limit collection and use of personal data to purposes described in our <a href="/privacy/" className="font-medium text-primary hover:underline">Privacy Policy</a>.</p> },
  { id: "infrastructure", title: "4. Infrastructure and resilience", content: <p>We use managed infrastructure and service providers to operate the platform. We apply configuration, availability and recovery practices appropriate to the service and monitor operational health so the team can investigate disruptions. Specific contractual commitments, if any, are defined in the applicable signed agreement or order form.</p> },
  { id: "monitoring", title: "5. Logging and monitoring", content: <p>Application and infrastructure events may be logged to support reliability, troubleshooting, misuse detection and security investigation. Access to operational logs is limited to authorised purposes, and log information is retained according to operational and legal needs.</p> },
  { id: "development", title: "6. Secure development", content: <p>Security considerations are incorporated into software design, code review, dependency management, testing and deployment practices. Identified issues are assessed and prioritised according to their potential impact and likelihood.</p> },
  { id: "providers", title: "7. Service providers and integrations", content: <p>Fleetcodes may rely on cloud, mapping, telematics, analytics, payment and communication providers. We evaluate providers in proportion to the information and function involved. Customer-enabled integrations remain subject to the third party's own security practices, terms and availability.</p> },
  { id: "incidents", title: "8. Security incident response", content: <p>We maintain a process to assess, contain, investigate and remediate suspected security incidents. Where an incident affects customer data, we will provide notifications required by applicable law or contractual commitments and share relevant information as it becomes reasonably available.</p> },
  { id: "responsibility", title: "9. Customer responsibilities", content: <><p>Security is shared. Customers should:</p><ul className="list-disc space-y-2 pl-6 marker:text-primary"><li>Use strong, unique credentials and restrict account sharing</li><li>Grant only the permissions each user needs</li><li>Remove access promptly when a user's role changes</li><li>Secure devices and networks used to access Fleetcodes</li><li>Review integrations before enabling them</li><li>Report suspicious activity without delay</li></ul></> },
  { id: "reporting", title: "10. Reporting a security concern", content: <p>If you believe you have found a vulnerability or security issue involving Fleetcodes, please report it privately and provide enough detail for us to reproduce and investigate it. Do not access, modify, download or disclose data that does not belong to you, and avoid actions that could disrupt the service.</p> },
];

const icons = [KeyRound, LockKeyhole, Activity];

const Security = () => {
  const { t, tObject } = useTranslation();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cards = tObject<{ label: string; text: string }[]>("pages.security.cards");

  useEffect(() => {
    const ids = [...sections.map(({ id }) => id), "contact"];
    const update = () => {
      const marker = window.scrollY + 160;
      let current = ids[0];
      ids.forEach((id) => { const node = document.getElementById(id); if (node && node.offsetTop <= marker) current = id; });
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setActiveId(current);
      setScrollProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const tocLink = (id: string, title: string, desktop = false) => <li key={id} className="relative">
    {desktop && activeId === id && <span className="absolute -left-4 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
    <a href={`#${id}`} className={`block text-sm leading-snug transition-all duration-200 hover:text-primary ${desktop ? "font-medium hover:translate-x-1" : ""} ${activeId === id ? "font-semibold text-primary md:translate-x-1" : "text-muted-foreground"}`}>{title}</a>
  </li>;

  return <div className="min-h-screen bg-background text-foreground">
    <div className="fixed left-0 top-0 z-[100] h-[3px] bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-[width] duration-75" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
    <Seo title={t("pages.security.seoTitle")} description={t("pages.security.seoDescription")} path="/security" jsonLd={{ "@context": "https://schema.org", "@type": "WebPage", name: `Security at ${SITE_NAME}`, url: absolutePageUrl("/security"), dateModified: "2026-09-03" }} />
    <Navbar />
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 pb-14 pt-32 dark:border-white/[0.06] sm:pb-16 sm:pt-36"><div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" /><div className="container-tight relative"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary"><ShieldCheck className="h-3.5 w-3.5" />{t("pages.security.badge")}</div><h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">{t("pages.security.title")}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">{t("pages.security.subtitle")}</p><p className="mt-4 text-sm font-medium text-slate-500">{t("pages.security.lastUpdated")}</p></div></section>
      <section className="py-12 sm:py-16"><div className="container-tight px-6 lg:px-8">
        <nav aria-label="Security sections" className="glass mb-8 rounded-2xl p-5 shadow-elegant lg:hidden"><p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">{t("pages.security.onPage")}</p><ol className="space-y-2.5">{sections.map(({ id, title }) => tocLink(id, title))}{tocLink("contact", t("pages.security.contactTitle"))}</ol></nav>
        <div className="grid items-start justify-center gap-10 lg:grid-cols-[220px_minmax(0,768px)] xl:grid-cols-[260px_minmax(0,768px)]">
          <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block"><nav aria-label="Security sections" className="border-l border-border/70 pl-4"><p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">{t("pages.security.onPage")}</p><ol className="space-y-3">{sections.map(({ id, title }) => tocLink(id, title, true))}{tocLink("contact", t("pages.security.contactTitle"), true)}</ol></nav></aside>
          <article className="min-w-0"><div className="mb-10 grid gap-4 sm:grid-cols-3">{(cards || []).map(({ label, text }, i) => {
            const Icon = icons[i];
            return <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-white/[0.025]"><Icon className="mb-3 h-5 w-5 text-primary" /><h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">{label}</h2><p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p></div>;
          })}</div>
            <div className="space-y-10">{sections.map(({ id, title, content }) => <section key={id} id={id} className="scroll-mt-28"><h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2><div className="mt-4 space-y-4 text-base leading-7 text-slate-600 dark:text-slate-400">{content}</div></section>)}
              <section id="contact" className="scroll-mt-28 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><ServerCog className="mb-4 h-6 w-6 text-primary" /><h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{t("pages.security.contactTitle")}</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t("pages.security.contactText")}</p><a href="mailto:support@fleetcodes.com?subject=Security%20report" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"><Mail className="h-4 w-4" />support@fleetcodes.com</a></section>
            </div>
          </article>
        </div>
      </div></section>
    </main>
    <Footer />
  </div>;
};

export default Security;

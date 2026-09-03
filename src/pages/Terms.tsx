import { useEffect, useState } from "react";
import { BadgeCheck, FileText, Mail, Scale, ShieldCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { SITE_NAME, absolutePageUrl } from "@/lib/site";
import { useTranslation } from "@/hooks/useTranslation";

const sections = [
  { id: "acceptance", title: "1. Acceptance and scope", content: <><p>These Terms of Service govern access to the Fleetcodes website, applications and fleet and logistics services. By creating an account, signing an order form or using the services, you confirm that you have authority to bind the relevant business and agree to these terms.</p><p>If an order form, master services agreement or other written agreement applies, it will control to the extent it expressly conflicts with these terms.</p></> },
  { id: "accounts", title: "2. Accounts and authorised users", content: <p>You must provide accurate account information, keep login credentials confidential and promptly notify us of suspected unauthorised access. You are responsible for activity by users you authorise and for configuring their permissions appropriately. The services are intended for business use by persons capable of entering a binding agreement.</p> },
  { id: "services-fees", title: "3. Services, subscriptions and fees", content: <><p>Service scope, subscription period, usage limits, implementation commitments and fees are described in the applicable plan, proposal or order form. Unless that document says otherwise, taxes are additional and fees paid for an active subscription are non-refundable except where required by law.</p><p>We may improve or update the services over time. We will not materially reduce contracted core functionality during an active subscription without reasonable notice.</p></> },
  { id: "acceptable-use", title: "4. Acceptable use", content: <><p>You must use Fleetcodes lawfully and only for authorised fleet and logistics operations. You must not:</p><ul className="list-disc space-y-2 pl-6 marker:text-primary"><li>Access another customer's data or account without permission</li><li>Upload malicious code, disrupt the platform or bypass security controls</li><li>Reverse engineer or copy the services except where law expressly permits</li><li>Use the services to violate privacy, transport, employment or other applicable laws</li><li>Use automated methods that unreasonably burden or scrape the platform</li></ul></> },
  { id: "customer-data", title: "5. Customer data and permissions", content: <><p>You retain ownership of data you submit to Fleetcodes. You grant us the limited rights needed to host, process, transmit, back up and display that data to provide, secure and support the services.</p><p>You are responsible for the accuracy and lawfulness of customer data and for obtaining required permissions or notices relating to drivers, employees, vehicles, GPS and location information, customers and third-party systems. Our handling of personal data is also described in our <a href="/privacy/" className="font-medium text-primary hover:underline">Privacy Policy</a>.</p></> },
  { id: "ai-outputs", title: "6. Analytics, automation and AI outputs", content: <p>Fleetcodes may provide forecasts, recommendations, alerts, routes or other automated outputs based on available data. These outputs support operational decisions but may be incomplete or inaccurate. You remain responsible for reviewing outputs and for decisions involving safety, legal compliance, payments, personnel, cargo and vehicle operations.</p> },
  { id: "integrations", title: "7. Third-party services and integrations", content: <p>The services may interoperate with mapping, telematics, payment, cloud, analytics or communication providers. Third-party services are governed by their own terms and may change or become unavailable independently of Fleetcodes. You are responsible for accounts and permissions required for integrations you enable.</p> },
  { id: "intellectual-property", title: "8. Intellectual property", content: <p>Fleetcodes and its licensors retain all rights in the platform, software, interfaces, documentation, branding and underlying technology. These terms provide a limited, non-exclusive, non-transferable right to use the services during the applicable subscription. If you provide feedback, we may use it without restriction or obligation, provided we do not identify you publicly without permission.</p> },
  { id: "confidentiality-security", title: "9. Confidentiality and security", content: <p>Each party must protect the other party's non-public business information using reasonable care and use it only for the relationship. This obligation does not cover information that is public through no breach, independently developed, lawfully received from another source or required to be disclosed by law. We maintain reasonable safeguards designed to protect the services, but no online service is completely risk-free.</p> },
  { id: "availability-warranties", title: "10. Availability and warranties", content: <p>We aim to provide a reliable service and may perform maintenance, respond to emergencies or suspend access needed to protect the platform. Except for commitments expressly stated in a signed agreement and to the maximum extent permitted by law, the services are provided "as is" and "as available"; we do not guarantee uninterrupted operation or that every output will be error-free.</p> },
  { id: "liability", title: "11. Liability", content: <p>To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, punitive or consequential loss, or for lost profits, revenue, goodwill or data. Any aggregate liability limit will be the limit stated in the applicable signed agreement or order form. Nothing in these terms excludes liability that cannot lawfully be excluded or limited.</p> },
  { id: "termination-law", title: "12. Suspension, termination and governing terms", content: <><p>We may suspend access where reasonably necessary to address security risk, unlawful use, non-payment or a material breach. Either party may terminate as permitted by the applicable order form or signed agreement. On termination, access ends and data handling will follow contractual retention or deletion commitments and applicable law.</p><p>These terms are governed by the laws of India. Any dispute process or court jurisdiction stated in an applicable signed agreement or order form will apply. If none is stated, the parties should first attempt in good faith to resolve the matter through written notice.</p></> },
  { id: "changes", title: "13. Changes to these terms", content: <p>We may update these terms to reflect service, business or legal changes. We will publish the revised terms here and update the date below. Material changes may also be communicated through the services or by email where appropriate.</p> },
];

const icons = [FileText, ShieldCheck, BadgeCheck];

const Terms = () => {
  const { t, tObject } = useTranslation();
  const [activeId, setActiveId] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cards = tObject<{ label: string; text: string }[]>("pages.terms.cards");

  useEffect(() => {
    const ids = [...sections.map(({ id }) => id), "contact"];
    const update = () => {
      const marker = window.scrollY + 160;
      let current = ids[0];
      ids.forEach((id) => { const element = document.getElementById(id); if (element && element.offsetTop <= marker) current = id; });
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setActiveId(current);
      setScrollProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const tocLink = (id: string, title: string, desktop = false) => (
    <li key={id} className="relative">
      {desktop && activeId === id && <span className="absolute -left-4 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
      <a href={`#${id}`} className={`block text-sm leading-snug transition-all duration-200 hover:text-primary ${desktop ? "font-medium hover:translate-x-1" : ""} ${activeId === id ? "font-semibold text-primary md:translate-x-1" : "text-muted-foreground"}`}>{title}</a>
    </li>
  );

  return <div className="min-h-screen bg-background text-foreground">
    <div className="fixed left-0 top-0 z-[100] h-[3px] bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-[width] duration-75" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
    <Seo title={t("pages.terms.seoTitle")} description={t("pages.terms.seoDescription")} path="/terms" jsonLd={{ "@context": "https://schema.org", "@type": "WebPage", name: `Terms of Service | ${SITE_NAME}`, url: absolutePageUrl("/terms"), dateModified: "2026-09-03" }} />
    <Navbar />
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 pb-14 pt-32 dark:border-white/[0.06] sm:pb-16 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container-tight relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary"><Scale className="h-3.5 w-3.5" />{t("pages.terms.badge")}</div>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">{t("pages.terms.title")}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">{t("pages.terms.subtitle")}</p>
          <p className="mt-4 text-sm font-medium text-slate-500">{t("pages.terms.lastUpdated")}</p>
        </div>
      </section>
      <section className="py-12 sm:py-16"><div className="container-tight px-6 lg:px-8">
        <nav aria-label="Terms sections" className="glass mb-8 rounded-2xl p-5 shadow-elegant lg:hidden"><p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">{t("pages.terms.onPage")}</p><ol className="space-y-2.5">{sections.map(({ id, title }) => tocLink(id, title))}{tocLink("contact", t("pages.terms.contactTitle"))}</ol></nav>
        <div className="grid items-start justify-center gap-10 lg:grid-cols-[220px_minmax(0,768px)] xl:grid-cols-[260px_minmax(0,768px)]">
          <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block"><nav aria-label="Terms sections" className="border-l border-border/70 pl-4"><p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-primary">{t("pages.terms.onPage")}</p><ol className="space-y-3">{sections.map(({ id, title }) => tocLink(id, title, true))}{tocLink("contact", t("pages.terms.contactTitle"), true)}</ol></nav></aside>
          <article className="min-w-0">
            <div className="mb-10 grid gap-4 sm:grid-cols-3">{(cards || []).map(({ label, text }, i) => {
              const Icon = icons[i];
              return <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-white/[0.025]"><Icon className="mb-3 h-5 w-5 text-primary" /><h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">{label}</h2><p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p></div>;
            })}</div>
            <div className="space-y-10">{sections.map(({ id, title, content }) => <section key={id} id={id} className="scroll-mt-28"><h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h2><div className="mt-4 space-y-4 text-base leading-7 text-slate-600 dark:text-slate-400">{content}</div></section>)}
              <section id="contact" className="scroll-mt-28 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><Mail className="mb-4 h-6 w-6 text-primary" /><h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{t("pages.terms.contactTitle")}</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">{t("pages.terms.contactText")}</p><div className="mt-5 flex flex-wrap gap-3"><a href="mailto:support@fleetcodes.com" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"><Mail className="h-4 w-4" />support@fleetcodes.com</a><a href="https://www.fleetcodes.com" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-white/15 dark:text-slate-300">www.fleetcodes.com</a></div></section>
            </div>
          </article>
        </div>
      </div></section>
    </main>
    <Footer />
  </div>;
};

export default Terms;

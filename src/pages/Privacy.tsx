import { useEffect, useState } from "react";
import { Database, Eye, LockKeyhole, Mail, ShieldCheck, UserRoundCheck } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { SITE_NAME, absolutePageUrl } from "@/lib/site";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information we collect",
    content: (
      <>
        <p>We may collect information that you provide directly, including your name, work email, phone number, company name, job role, demo requests, support messages, newsletter preferences and account details.</p>
        <p>Customers may submit fleet and logistics information to the platform, including:</p>
        <ul className="list-disc space-y-2 pl-6 marker:text-primary">
          <li>Vehicle, fleet and asset information</li>
          <li>Driver, staff, customer and vendor information</li>
          <li>GPS, precise or approximate location, route and trip data</li>
          <li>Delivery, proof-of-delivery, billing, document and operational records</li>
        </ul>
        <p>When you use our website or services, we may also receive device, log and usage information such as IP address, browser and device type, pages visited, timestamps, referral source, feature interactions and diagnostic logs.</p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "2. How we use information",
    content: (
      <>
        <p>We use information to provide and improve our services, create and administer accounts, and help customers manage fleet and logistics operations. This includes producing requested analytics, operational alerts, automations and AI-powered insights.</p>
        <p>We also use information to respond to enquiries, schedule demos, deliver customer support, process requested communications, monitor performance, maintain security, prevent misuse, keep appropriate records and comply with applicable laws. We do not use customer fleet data to advertise unrelated third-party products.</p>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "3. Customer data and roles",
    content: (
      <p>For data a business customer enters into Fleetcodes, that customer generally decides why and how the data is used, while Fleetcodes processes it to deliver the contracted service. Customers are responsible for having an appropriate basis to submit personal data and for providing any notices required to their drivers, staff, vendors and customers.</p>
    ),
  },
  {
    id: "sharing",
    title: "4. When we share information",
    content: (
      <p>We may share information with vetted service providers that support hosting, analytics, communications, customer support and security; with professional advisers; during a corporate transaction; or when disclosure is reasonably necessary to comply with law, protect rights, prevent fraud or address a security incident. We do not sell personal data.</p>
    ),
  },
  {
    id: "cookies",
    title: "5. Cookies and analytics",
    content: (
      <><p>We use essential browser storage to remember preferences and support core site functions. With your permission, we may use analytics technologies to understand visits and improve user experience, and optional marketing technologies where disclosed in the consent controls.</p><p>You can accept, reject or customise non-essential categories in the consent banner and change your selection later through “Cookie Preferences” in the footer. Analytics does not load until you opt in. Browser controls can also remove stored preferences, in which case we will ask for your choice again.</p></>
    ),
  },
  {
    id: "retention-security",
    title: "6. Retention and security",
    content: (
      <p>We retain information only for as long as reasonably required for the purposes described here, contractual commitments, dispute resolution and legal or accounting requirements. We use administrative, technical and organisational safeguards designed to protect information, but no online system can guarantee absolute security.</p>
    ),
  },
  {
    id: "rights",
    title: "7. Your choices and rights",
    content: (
      <p>Depending on applicable law and our relationship with you, you may request access, correction, updating or deletion of your personal data, withdraw consent where processing relies on consent, opt out of marketing communications, or raise a grievance. We may need to verify your identity before completing a request. If your data was provided by a Fleetcodes customer, please contact that organisation first; we will assist it as appropriate.</p>
    ),
  },
  {
    id: "third-party-services",
    title: "8. Third-party services and integrations",
    content: (
      <p>Fleetcodes may connect with third-party mapping, telematics, cloud infrastructure, payment, analytics and communication providers at a customer's request or when needed to operate the services. Information sent to or received from those services may also be governed by their own terms and privacy policies. Customers should review the policies of integrations they choose to enable.</p>
    ),
  },
  {
    id: "international-children",
    title: "9. International processing and children",
    content: (
      <p>Our providers may process information in locations outside your state or country, subject to appropriate contractual and legal safeguards. Fleetcodes is a business service and is not directed to children. Please do not submit a child's personal data unless it is lawful, necessary and appropriately authorised.</p>
    ),
  },
  {
    id: "updates",
    title: "10. Updates to this policy",
    content: (
      <p>We may update this policy as our services or legal obligations change. We will publish the revised version here and update the effective date. Material changes may also be communicated through the service or by email where appropriate.</p>
    ),
  },
];

const Privacy = () => {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const sectionIds = [...sections.map((section) => section.id), "contact"];
    const updateActiveSection = () => {
      const marker = window.scrollY + 160;
      let currentId = sectionIds[0];
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= marker) currentId = id;
      });

      setActiveId(currentId);
      setScrollProgress(scrollableHeight > 0 ? Math.min(100, (window.scrollY / scrollableHeight) * 100) : 0);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  return (
  <div className="min-h-screen bg-background text-foreground">
    <div
      className="fixed left-0 top-0 z-[100] h-[3px] bg-primary shadow-[0_0_8px_hsl(var(--primary))] transition-[width] duration-75 ease-out"
      style={{ width: `${scrollProgress}%` }}
      aria-hidden="true"
    />
    <Seo
      title={`Privacy Policy | ${SITE_NAME}`}
      description="Learn how Fleetcodes collects, uses, shares, retains and protects personal data across its website and fleet management services."
      path="/privacy"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `Privacy Policy | ${SITE_NAME}`,
        url: absolutePageUrl("/privacy"),
        dateModified: "2026-09-03",
      }}
    />
    <Navbar />

    <main>
      <section className="relative overflow-hidden border-b border-slate-200 pb-14 pt-32 dark:border-white/[0.06] sm:pb-16 sm:pt-36">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="container-tight relative">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Privacy & data protection
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">Privacy Policy</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">This policy explains how Fleetcodes Technologies Pvt. Ltd. handles personal data when you visit our website, contact us or use our fleet management services.</p>
          <p className="mt-4 text-sm font-medium text-slate-500">Last updated: September 3, 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-tight px-6 lg:px-8">
          <nav aria-label="Privacy policy sections" className="glass mb-8 rounded-2xl p-5 shadow-elegant lg:hidden">
            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-widest text-primary">On this page</p>
            <ol className="space-y-2.5">
              {sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className={`text-sm leading-snug transition-colors hover:text-primary ${activeId === section.id ? "font-semibold text-primary" : "text-muted-foreground"}`}>{section.title}</a></li>)}
              <li><a href="#contact" className={`text-sm leading-snug transition-colors hover:text-primary ${activeId === "contact" ? "font-semibold text-primary" : "text-muted-foreground"}`}>11. Contact us</a></li>
            </ol>
          </nav>

          <div className="grid items-start justify-center gap-10 lg:grid-cols-[220px_minmax(0,768px)] xl:grid-cols-[260px_minmax(0,768px)]">
            <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block">
              <nav aria-label="Privacy policy sections" className="border-l border-border/70 pl-4">
                <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-widest text-primary">On this page</p>
                <ol className="space-y-3">
                  {sections.map((section) => (
                    <li key={section.id} className="relative">
                      {activeId === section.id && <span className="absolute -left-4 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                      <a href={`#${section.id}`} className={`block text-sm font-medium leading-snug transition-all duration-200 hover:translate-x-1 hover:text-primary ${activeId === section.id ? "translate-x-1 font-semibold text-primary" : "text-muted-foreground"}`}>{section.title}</a>
                    </li>
                  ))}
                  <li className="relative">
                    {activeId === "contact" && <span className="absolute -left-4 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />}
                    <a href="#contact" className={`block text-sm font-medium leading-snug transition-all duration-200 hover:translate-x-1 hover:text-primary ${activeId === "contact" ? "translate-x-1 font-semibold text-primary" : "text-muted-foreground"}`}>11. Contact us</a>
                  </li>
                </ol>
              </nav>
            </aside>

            <article className="min-w-0">
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Database, label: "Purpose limited", text: "Data used to operate and improve our services." },
                { icon: LockKeyhole, label: "Safeguarded", text: "Controls designed to protect business data." },
                { icon: UserRoundCheck, label: "Your choices", text: "Requests and preferences are supported." },
              ].map(({ icon: Icon, label, text }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/[0.07] dark:bg-white/[0.025]">
                  <Icon className="mb-3 h-5 w-5 text-primary" />
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">{label}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
                </div>
              ))}
            </div>

            <div className="space-y-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-base leading-7 text-slate-600 dark:text-slate-400">{section.content}</div>
                </section>
              ))}
              <section id="contact" className="scroll-mt-28 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <Eye className="mb-4 h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">11. Contact us</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">For privacy questions, requests or grievances, email us. Please include enough detail for us to identify the relevant account or interaction.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="mailto:support@fleetcodes.com" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"><Mail className="h-4 w-4" />support@fleetcodes.com</a>
                  <a href="https://www.fleetcodes.com" className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-slate-300">www.fleetcodes.com</a>
                </div>
              </section>
            </div>
            </article>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
  );
};

export default Privacy;

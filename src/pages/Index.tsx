import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Compare from "@/components/landing/Compare";
import ROICalculator from "@/components/landing/ROICalculator";
import Benefits from "@/components/landing/Benefits";
import SocialProof from "@/components/landing/SocialProof";
import Blog from "@/components/landing/Blog";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { APP_DOWNLOAD_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LINKEDIN_URL, SITE_NAME, absolutePageUrl, absoluteUrl } from "@/lib/site";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={DEFAULT_TITLE}
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: absolutePageUrl("/"),
            logo: absoluteUrl("/favicon.png"),
            sameAs: [LINKEDIN_URL],
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web, Android",
            url: absolutePageUrl("/"),
            downloadUrl: APP_DOWNLOAD_URL,
            installUrl: APP_DOWNLOAD_URL,
            description: DEFAULT_DESCRIPTION,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does Fleetcodes' AI-powered dispatch planning work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our system reads your operational standards (SOPs), truck types, route history, and driver availability logs. The AI algorithm then auto-recommends optimal load matches and schedules, reducing vehicle dry-runs and admin planning time by over 50%."
                }
              },
              {
                "@type": "Question",
                "name": "Does it integrate with existing GPS hardware and FASTag accounts?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, fully! Fleetcodes has pre-built API integrations for all leading GPS tracking devices (LocoNav, Trimble, etc.) and direct bank connections (ICICI, HDFC, SBI) for live toll deduction tracking and FASTag balance alerts."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to onboard our fleet?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A standard onboarding takes between 7 to 10 days. Our dedicated customer success team will setup your vehicle lists, driver KYC records, and client rates, and run training sessions for your managers and dispatch coordinators."
                }
              },
              {
                "@type": "Question",
                "name": "How does Fleetcodes prevent toll leakage and expense overcharging?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The platform dynamically correlates actual FASTag transactions with the vehicle's GPS route timeline. If a vehicle takes an unauthorized route, stands waiting excessively, or gets charged for an incorrect axle category, it gets flagged instantly on the reconciliation dashboard."
                }
              },
              {
                "@type": "Question",
                "name": "Is our shipper contract and customer data secure?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Security is central to our design. Fleetcodes utilizes multi-tenant architecture with data isolation and end-to-end TLS encryption. Your commercial rates, client contracts, and driver records are completely secure and private to your account."
                }
              },
              {
                "@type": "Question",
                "name": "Can we request custom reports or connect Fleetcodes to our ERP?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, we support enterprise integrations. Fleetcodes provides outbound REST APIs and Webhooks to sync trip sheets, POD confirmations, and billing invoices directly with standard ERPs like SAP, Oracle, and Tally Prime."
                }
              }
            ]
          }
        ]}
      />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Compare />
      <ROICalculator />
      <Benefits />
      <SocialProof />
      <Blog />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;

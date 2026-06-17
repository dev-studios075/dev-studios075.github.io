import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Compare from "@/components/landing/Compare";
import Benefits from "@/components/landing/Benefits";
import SocialProof from "@/components/landing/SocialProof";
import Blog from "@/components/landing/Blog";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, absoluteUrl } from "@/lib/site";

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
            url: absoluteUrl("/"),
            logo: absoluteUrl("/favicon.png"),
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: absoluteUrl("/"),
            description: DEFAULT_DESCRIPTION,
          },
        ]}
      />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Compare />
      <Benefits />
      <SocialProof />
      <Blog />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;

import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";
import Seo from "@/components/seo/Seo";
import { APP_DOWNLOAD_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE, LINKEDIN_URL, SITE_NAME, absolutePageUrl, absoluteUrl } from "@/lib/site";
import { useTranslation } from "@/hooks/useTranslation";

const Features = lazy(() => import("@/components/landing/Features"));
const HowItWorks = lazy(() => import("@/components/landing/HowItWorks"));
const Compare = lazy(() => import("@/components/landing/Compare"));
const ROICalculator = lazy(() => import("@/components/landing/ROICalculator"));
const Benefits = lazy(() => import("@/components/landing/Benefits"));
const SocialProof = lazy(() => import("@/components/landing/SocialProof"));
const Blog = lazy(() => import("@/components/landing/Blog"));
const FAQ = lazy(() => import("@/components/landing/FAQ"));
const CTA = lazy(() => import("@/components/landing/CTA"));

const SectionFallback = () => (
  <div className="min-h-[720px]" aria-hidden="true" />
);

const LazySection = ({ hash, children }: { hash?: string; children: ReactNode }) => {
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(() => Boolean(window.location.hash));

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash) setShow(true);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [location.hash]);

  useEffect(() => {
    if (show) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [show]);

  useEffect(() => {
    if (!show || !hash || window.location.hash !== `#${hash}`) return;

    let cancelled = false;
    const tryScroll = (attempt = 0) => {
      if (cancelled) return;
      document.getElementById(hash)?.scrollIntoView();
      if (attempt < 8) window.setTimeout(() => tryScroll(attempt + 1), 80);
    };

    tryScroll();
    return () => {
      cancelled = true;
    };
  }, [hash, location.hash, show]);

  return (
    <div ref={ref} className="landing-deferred">
      {show ? <Suspense fallback={<SectionFallback />}>{children}</Suspense> : <SectionFallback />}
    </div>
  );
};

const Index = () => {
  const { language, t, tObject } = useTranslation();
  const pageTitle = t("home.seo.title", { default: DEFAULT_TITLE }) as string;
  const pageDescription = t("home.seo.description", { default: DEFAULT_DESCRIPTION }) as string;
  const faqItems = tObject<Array<{ question: string; answer: string }>>("faq.items") ?? [];
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo
        title={pageTitle}
        description={pageDescription}
        path={language === "hi" ? "/hi" : "/"}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: absolutePageUrl("/"),
            logo: absoluteUrl("/assets/brand/logo-with-bg.png"),
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
            description: pageDescription,
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: language === "hi" ? "hi-IN" : "en-IN",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]}
      />
      <Navbar />
      <Hero />
      <LazySection hash="features"><Features /></LazySection>
      <LazySection hash="how"><HowItWorks /></LazySection>
      <LazySection hash="compare"><Compare /></LazySection>
      <LazySection hash="roi-calculator"><ROICalculator /></LazySection>
      <LazySection hash="benefits"><Benefits /></LazySection>
      <LazySection><SocialProof /></LazySection>
      <LazySection hash="blog"><Blog /></LazySection>
      <LazySection hash="faq"><FAQ /></LazySection>
      <LazySection><CTA /></LazySection>
      <Footer />
    </main>
  );
};

export default Index;

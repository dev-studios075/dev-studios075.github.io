import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { useEffect } from "react";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import BackToTop from "./components/BackToTop";
import CookieConsent from "./components/CookieConsent";
import { getPreferredLanguage, isLocalizablePath } from "@/hooks/useTranslation";

// Lazy loaded pages
const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BookDemo = lazy(() => import("./pages/BookDemo"));
const Careers = lazy(() => import("./pages/Careers"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Premium fallback loader supporting both light and dark modes
const PageLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
    <div className="w-8 h-8 rounded-full border-2 border-primary/20 dark:border-primary/10 border-t-primary animate-spin" />
    <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 dark:opacity-60">Loading...</span>
  </div>
);

// Standard scroll reset behavior on page navigations
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

const RestoreLanguagePreference = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (getPreferredLanguage() !== "hi" || location.pathname.startsWith("/hi") || !isLocalizablePath(location.pathname)) return;
    const target = location.pathname === "/" ? "/hi/" : `/hi${location.pathname}`;
    navigate(`${target}${location.search}${location.hash}`, { replace: true });
  }, [location.hash, location.pathname, location.search, navigate]);

  return null;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/page/:page" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/book-demo" element={<BookDemo />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/about" element={<About />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/security" element={<Security />} />
      <Route path="/hi" element={<Index />} />
      <Route path="/hi/blog" element={<Blog />} />
      <Route path="/hi/blog/page/:page" element={<Blog />} />
      <Route path="/hi/blog/:slug" element={<BlogPost />} />
      <Route path="/hi/about" element={<About />} />
      <Route path="/hi/careers" element={<Careers />} />
      <Route path="/hi/book-demo" element={<BookDemo />} />
      <Route path="/hi/privacy" element={<Privacy />} />
      <Route path="/hi/terms" element={<Terms />} />
      <Route path="/hi/security" element={<Security />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <RestoreLanguagePreference />
          <GoogleAnalytics />
          <CookieConsent />
          {/* <FloatingWhatsApp /> */}
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
          <BackToTop />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

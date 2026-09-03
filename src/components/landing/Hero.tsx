import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardMockup from "./DashboardMockup";
import { trackEvent } from "@/lib/analytics";
import CustomerLogos from "./CustomerLogos";
import { useTranslation } from "@/hooks/useTranslation";

const Hero = () => {
  const { t, localizePath } = useTranslation();
  const trackHeroCta = (label: string) => {
    trackEvent("select_promotion", {
      cta_label: label,
      cta_location: "hero",
    });
  };

  return (
    <section className="relative pt-32 pb-8 lg:pt-36 lg:pb-10 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      {/* Glow orbs */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      <div className="container-tight relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>{t("home.hero.badge")}</span>
          </div>

          <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] mb-6">
            {t("home.hero.title")} {" "}
            <span className="text-gradient-primary">{t("home.hero.accent")}</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            {t("home.hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="hero"
              size="lg"
              className="group"
              asChild
            >
              <Link to={localizePath("/book-demo/")} onClick={() => trackHeroCta("Book Demo")}>
                {t("common.bookDemo")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              variant="glass"
              size="lg"
              className="group"
              asChild
            >
              <a href="#how" onClick={() => trackHeroCta("See How It Works")}>
                <PlayCircle className="w-4 h-4" />
              {t("home.hero.seeHow")}
              </a>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("home.hero.noCard")}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {t("home.hero.soc")}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("home.hero.deploy")}
            </div>
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 lg:mt-16 max-w-4xl mx-auto relative"
        >
          <div className="relative rounded-2xl glass-strong p-1.5 shadow-elegant glow-border overflow-hidden">
            <DashboardMockup />
          </div>
          {/* Floating cards */}
          <div className="hidden lg:block absolute -left-20 xl:-left-28 top-1/4 glass rounded-xl p-4 animate-float shadow-card">
            <div className="text-xs text-muted-foreground">Fleet utilization</div>
            <div className="text-2xl font-display font-semibold text-gradient-primary">94.2%</div>
            <div className="text-xs text-primary mt-1">↑ 12.4% this week</div>
          </div>
          <div className="hidden lg:block absolute -right-20 xl:-right-28 bottom-1/4 glass rounded-xl p-4 animate-float shadow-card" style={{ animationDelay: "1.5s" }}>
            <div className="text-xs text-muted-foreground">Auto-resolved alerts</div>
            <div className="text-2xl font-display font-semibold text-gradient-primary">1,284</div>
            <div className="text-xs text-primary mt-1">Today</div>
          </div>
        </motion.div>

        <CustomerLogos />
      </div>
    </section>
  );
};

export default Hero;

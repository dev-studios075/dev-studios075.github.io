import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

function CallToAction() {
  const trackBottomCta = (label: string) => {
    trackEvent("generate_lead", {
      cta_label: label,
      cta_location: "bottom_cta",
    });
  };

  return (
    <section className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="group relative glass-strong rounded-3xl px-8 py-12 lg:py-20 text-center overflow-hidden glow-border hover:border-primary/20 hover:shadow-elegant transition-all duration-300"
        >
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/15 group-hover:bg-primary/25 blur-[120px] transition-colors duration-500 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto flex flex-col items-center">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary mb-6 animate-pulse uppercase tracking-wider font-mono">
              ⚡ 14-Day Deployment Guarantee
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-5 text-slate-900 dark:text-white leading-[1.15]">
              Let your logistics run on autopilot.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              See how Fleetcodes maps your SOPs and runs a live operation in a 30-minute walkthrough.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none">
              <Button
                variant="hero"
                size="lg"
                className="group/btn w-full sm:w-auto"
                asChild
              >
                <Link to="/book-demo" onClick={() => trackBottomCta("Schedule a Demo")}>
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/book-demo" onClick={() => trackBottomCta("Talk to sales")}>
                  Talk to sales
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CallToAction;

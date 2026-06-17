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
    <section className="py-24 lg:py-32 relative">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative glass-strong rounded-3xl px-8 py-16 lg:py-24 text-center overflow-hidden glow-border"
        >
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto">
            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-5">
              Let your logistics <br />
              <span className="text-gradient-primary">run on autopilot.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              See ClairTrack map your SOPs and run a live operation in a 30-minute walkthrough.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="hero"
                size="xl"
                className="group"
                asChild
              >
                <Link to="/book-demo" onClick={() => trackBottomCta("Schedule a Demo")}>
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
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

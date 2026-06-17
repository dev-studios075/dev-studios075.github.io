import { motion } from "framer-motion";
import { Brain, Zap, UserCheck, TrendingUp } from "lucide-react";

const steps = [
  { icon: Brain, title: "System learns your SOPs", desc: "Upload processes, integrate data sources. The model maps your operational DNA." },
  { icon: Zap, title: "AI decides in real time", desc: "Trips, dispatches, exceptions, and approvals are evaluated in milliseconds." },
  { icon: UserCheck, title: "Tasks auto-assigned to staff", desc: "Right person, right context, right SLA — every action routed automatically." },
  { icon: TrendingUp, title: "Continuous optimization", desc: "Outcomes feed back into the model. Operations get smarter every shift." },
];

const HowItWorks = () => {
  return (
    <section id="how" className="py-16 lg:py-24 relative">
      <div className="absolute inset-0 dot-bg opacity-40 pointer-events-none" />
      <div className="container-tight relative">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">How it works</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            From SOP to <span className="text-gradient">self-driving operations</span> in four steps.
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative"
              >
                <div className="relative z-10 mx-auto w-24 h-24 rounded-2xl glass-strong grid place-items-center mb-6 glow-border hover:-translate-y-1 hover:shadow-elegant transition-all duration-300">
                  <s.icon className="w-9 h-9 text-primary" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-display font-bold grid place-items-center shadow-glow">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-center mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

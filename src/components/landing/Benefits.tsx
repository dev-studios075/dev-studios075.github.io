import { motion } from "framer-motion";
import { Activity, Gauge, Route, ShieldCheck, TrendingDown, Users } from "lucide-react";

const stats = [
  {
    value: "−38%",
    label: "Operational cost",
    tag: "Lower overhead",
    desc: "Fewer manual touchpoints and less coordination overhead across every trip.",
    icon: TrendingDown,
  },
  {
    value: "0",
    label: "Manual entry errors",
    tag: "Validated inputs",
    desc: "AI-generated tasks and reports remove repetitive entry and human typos.",
    icon: ShieldCheck,
  },
  {
    value: "+27%",
    label: "Fleet efficiency",
    tag: "Higher utilization",
    desc: "Optimized routes and asset utilization across the operating network.",
    icon: Route,
  },
  {
    value: "<2s",
    label: "Decision latency",
    tag: "Real-time response",
    desc: "Automated triage replaces meetings, follow-ups, and fragmented email chains.",
    icon: Gauge,
  },
  {
    value: "10×",
    label: "Scale per ops head",
    tag: "Lean operations",
    desc: "Grow fleet capacity without proportionally growing the operations team.",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Always-on operations",
    tag: "Continuous control",
    desc: "Autonomous monitoring keeps operational exceptions visible around the clock.",
    icon: Activity,
  },
];

const Benefits = () => (
  <section id="benefits" className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

    <div className="container-tight relative">
      <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">Outcomes</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4 text-slate-900 dark:text-white">
            What teams unlock with <span className="text-gradient">automation-first ops.</span>
          </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          One intelligent operating layer continuously plans, validates, and improves fleet execution.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-200 dark:bg-white/[0.07] border border-slate-200 dark:border-white/[0.08] shadow-sm">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.07 }}
                className="group relative min-h-[220px] bg-white dark:bg-[#0d1117] p-6 transition-colors duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.025]"
              >
                <div className="flex h-full flex-col">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wide text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      {stat.tag}
                    </span>
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-primary transition-transform group-hover:scale-105">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="font-display text-4xl font-bold leading-none text-gradient-primary">
                    {stat.value}
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                    {stat.label}
                  </h3>
                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                    {stat.desc}
                  </p>

                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <p className="mt-4 font-mono text-[9px] leading-relaxed text-muted-foreground/60">
        Illustrative operating outcomes; actual results vary by fleet size, workflow maturity, integrations, and deployment scope.
      </p>
    </div>
  </section>
);

export default Benefits;

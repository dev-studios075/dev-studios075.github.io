import { motion } from "framer-motion";
import neuralBg from "@/assets/neural-bg.jpg";

const stats = [
  { value: "−38%", label: "Operational cost", desc: "Less coordination overhead, fewer manual touchpoints." },
  { value: "0", label: "Manual entry errors", desc: "AI-generated tasks and reports remove human typos." },
  { value: "+27%", label: "Fleet efficiency", desc: "Optimized routes and asset utilization across the network." },
  { value: "<2s", label: "Decision latency", desc: "Real-time triage instead of meetings and email chains." },
  { value: "10×", label: "Scale per ops head", desc: "Grow fleet without proportionally growing your team." },
  { value: "24/7", label: "Always-on operations", desc: "The system never sleeps, never misses an exception." },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-16 lg:py-24 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${neuralBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="container-tight relative">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Outcomes</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            What teams unlock with <span className="text-gradient">automation-first ops.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="glass rounded-2xl p-6 sm:p-7 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="font-display font-bold text-5xl text-gradient-primary mb-2">{s.value}</div>
              <div className="font-display font-semibold text-base mb-2">{s.label}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;

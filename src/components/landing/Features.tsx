import { motion } from "framer-motion";
import {
  Route, Clock, Satellite, FileBarChart2, BellRing,
  Users, Wrench, Boxes, Wallet,
} from "lucide-react";

const features = [
  { icon: Route, title: "Automated Trip Planning", desc: "AI builds optimal routes, loads, and schedules from live demand and constraints." },
  { icon: Clock, title: "Smart Departure Management", desc: "System orchestrates loading, paperwork, and gate-out with zero manual coordination." },
  { icon: Satellite, title: "Autonomous GPS Tracking", desc: "Continuous tracking with predictive ETAs and deviation intelligence." },
  { icon: FileBarChart2, title: "AI Report Generation", desc: "Operational, financial, and compliance reports written by the system, on schedule." },
  { icon: BellRing, title: "Auto Alerts & Exceptions", desc: "Detects anomalies, triages severity, and resolves or escalates automatically." },
  { icon: Users, title: "Staff Task Automation", desc: "Tasks generated, assigned, and tracked across your team without supervisors." },
  { icon: Wrench, title: "Vehicle Maintenance AI", desc: "Image-processing inspection plus predictive service windows for every asset." },
  { icon: Boxes, title: "Spare Parts Intelligence", desc: "Visual recognition and demand forecasting keep inventory lean and ready." },
  { icon: Wallet, title: "Expense & Collection", desc: "Automated reconciliation, receivables tracking, and cash-flow visibility." },
];

const Features = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="container-tight">
        <div className="max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Capabilities</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-5">
            One platform. <span className="text-gradient">Nine autonomous systems.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Replace fragmented tools and manual coordination with a single, self-operating engine
            built for modern logistics.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group relative glass rounded-2xl p-6 hover:shadow-glow transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(400px circle at var(--x,50%) var(--y,0%), hsl(var(--primary)/0.08), transparent 40%)" }}
              />
              <div className="relative">
                <div className="inline-flex p-3 rounded-xl bg-gradient-primary/10 border border-primary/20 mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

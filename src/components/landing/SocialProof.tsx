import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "We retired three internal tools and a coordination layer of five people. The platform just runs the floor.",
    author: "Rohan Mehta",
    role: "COO, Northwind Freight",
    impact: "Retired 3 Tools",
    initials: "RM",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    quote: "The first TMS that actually executes. Within a quarter, exception handling went from hours to seconds.",
    author: "Sarah Chen",
    role: "Head of Operations, CargoLink",
    impact: "Latency: Hours ➔ Seconds",
    initials: "SC",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    quote: "Maintenance costs dropped 31% in six months. The image-AI catches issues our drivers miss.",
    author: "Anand Iyer",
    role: "Founder, FleetCore Logistics",
    impact: "Maintenance: −31%",
    initials: "AI",
    gradient: "from-amber-500 to-orange-500",
  },
];

const SocialProof = () => {
  return (
    <section className="pt-10 pb-8 lg:pt-12 lg:pb-10 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#948cf4]/5 blur-[90px] pointer-events-none" />

      <div className="container-tight relative">
        <div className="max-w-2xl mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3 font-semibold">Operators talking</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-white">
            Loved by <span className="text-gradient">operations leaders.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative glass rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5 hover:border-primary/20 hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
            >
              {/* Premium CSS hover background overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Card top rating row */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-mono font-bold tracking-wide">
                  {t.impact}
                </span>
              </div>

              {/* Testimonial Quote body */}
              <div className="relative mt-2 z-10">
                <Quote className="w-6 h-6 text-primary/25 absolute -top-3.5 -left-1 shrink-0 group-hover:scale-110 group-hover:text-primary/40 transition-all duration-300" />
                <blockquote className="text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 pl-5.5 font-medium">
                  "{t.quote}"
                </blockquote>
              </div>

              {/* Operator details and Initials Avatar */}
              <figcaption className="border-t border-slate-900/10 dark:border-border/40 pt-4 flex items-center gap-3.5 relative z-10">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-bold font-mono tracking-wider shadow-inner`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-slate-900 dark:text-white">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

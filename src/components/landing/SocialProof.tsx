import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "We retired three internal tools and a coordination layer of five people. The platform just runs the floor.",
    author: "Rohan Mehta",
    role: "COO, Northwind Freight",
  },
  {
    quote: "The first TMS that actually executes. Within a quarter, exception handling went from hours to seconds.",
    author: "Sarah Chen",
    role: "Head of Operations, CargoLink",
  },
  {
    quote: "Maintenance costs dropped 31% in six months. The image-AI catches issues our drivers miss.",
    author: "Anand Iyer",
    role: "Founder, FleetCore Logistics",
  },
];

const SocialProof = () => {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container-tight">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Operators talking</p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
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
              className="glass rounded-2xl p-7 flex flex-col justify-between gap-6"
            >
              <Quote className="w-7 h-7 text-primary/60" />
              <blockquote className="text-base leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="border-t border-border/40 pt-4">
                <div className="font-display font-semibold text-sm">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

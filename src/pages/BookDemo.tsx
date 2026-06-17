import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight,
  CheckCircle2, Loader2, ShieldCheck, Clock, Sparkles,
  Building, Mail, User, Phone, MessageSquare, Sun, Moon,
  Zap, BarChart3, Globe,
} from "lucide-react";

import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Seo         from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { useTheme }   from "@/hooks/use-theme";
import { toast }      from "sonner";

// ─── Validation schema ─────────────────────────────────────────────────────────
const formSchema = z.object({
  name:      z.string().min(2, "Name must be at least 2 characters"),
  email:     z.string().email("Please enter a valid work email"),
  phone:     z.string().min(10, "Please enter a valid phone number (minimum 10 digits)"),
  company:   z.string().min(2, "Company name must be at least 2 characters"),
  fleetSize: z.string({ required_error: "Please select your fleet size" }),
  message:   z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  id, label, icon: Icon, error, children,
}: {
  id: string; label: string; icon: React.ElementType; error?: string; children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-primary/70" />
      {label}
    </Label>
    {children}
    {error && <p className="text-[11px] font-medium text-destructive mt-1">{error}</p>}
  </div>
);

// ─── Left panel stats ──────────────────────────────────────────────────────────
const stats = [
  { value: "−38%", label: "Operational cost" },
  { value: "10×",  label: "Scale per ops head" },
  { value: "14d",  label: "Deploy guarantee" },
];

const checkpoints = [
  {
    icon: Zap,
    title: "Custom SOP Mapping",
    desc: "We'll map one of your core dispatch SOPs live during the demo.",
  },
  {
    icon: BarChart3,
    title: "Real-time Cost Audit",
    desc: "See how our AI identifies leakages and empty miles instantly.",
  },
  {
    icon: Globe,
    title: "Integration Consultation",
    desc: "Learn how we connect with your existing GPS providers and ERPs.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const BookDemo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const { theme, toggleTheme }          = useTheme();
  const [scrolled, setScrolled]         = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const fleetSizeValue = watch("fleetSize");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    trackEvent("submit_lead", { fleet_size: data.fleetSize, company: data.company });

    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!googleSheetUrl) {
      await new Promise((r) => setTimeout(r, 1500));
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Demo request submitted (Dev Mode)!");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("name",      data.name);
      params.append("email",     data.email);
      params.append("phone",     data.phone);
      params.append("company",   data.company);
      params.append("fleetSize", data.fleetSize);
      params.append("message",   data.message || "");
      params.append("source",    "Website Book Demo Page");

      await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Demo request submitted successfully!");
    } catch {
      setIsSubmitting(false);
      toast.error("Something went wrong. Please try again or email us directly.");
    }
  };

  const inputCls = (hasError: boolean) =>
    `h-11 bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-primary/30 transition-colors ${
      hasError ? "border-destructive focus-visible:ring-destructive" : ""
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <Seo
        title={`Book a Free Live Demo | ${SITE_NAME}`}
        description="Schedule a 30-minute personalized walkthrough with our logistics automation experts. Learn how Fleetcodes TMS can digitize and automate your operations."
        path="/book-demo"
      />

      {/* Background orbs */}
      <div className="absolute top-[-15%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none -z-10" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div className="container-tight">
          <nav
            className="flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300"
            style={{
              background: scrolled
                ? theme === "dark" ? "rgba(15,17,25,0.85)" : "rgba(255,255,255,0.88)"
                : theme === "dark" ? "rgba(15,17,25,0.4)" : "rgba(255,255,255,0.5)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: scrolled
                ? theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"
                : "1px solid transparent",
              boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg shrink-0">
              <span className="relative grid place-items-center w-8 h-8 rounded-xl bg-white border border-border/40 shadow-sm overflow-hidden shrink-0">
                <img src="/favicon.png" alt="Fleetcodes Logo" className="w-5 h-5 object-contain" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
              </span>
              <span className="text-gradient hidden sm:inline">Fleetcodes</span>
              <span className="text-muted-foreground/60 text-[10px] font-body uppercase tracking-[0.18em] hidden lg:inline border-l border-border/40 pl-2.5">TMS</span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <div className="w-px h-5 bg-border/60 hidden sm:block" />
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-foreground dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back to home</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-grow flex items-center pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left: Value prop */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20 bg-primary/5">
                <Sparkles className="w-3.5 h-3.5" />
                30-Minute Live Walkthrough
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                  See Fleetcodes in{" "}
                  <span className="text-gradient-primary">Autopilot Mode.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">
                  Discover how our automation-first TMS connects operations, billing,
                  Fastag tracking, and driver management into a single, self-running engine.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3 text-center bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/[0.08]"
                  >
                    <div className="font-display font-bold text-xl text-gradient-primary">{s.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Checkpoints */}
              <div className="space-y-4 pt-2">
                {checkpoints.map((c) => (
                  <div key={c.title} className="flex items-start gap-3.5">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <c.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">{c.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-slate-200 dark:border-white/[0.07]">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Schedule in 60s</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">SOC 2 compliant</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">No credit card</span>
                </div>
              </div>
            </div>

            {/* Right: Form card */}
            <div className="lg:col-span-7">
              <div
                className="rounded-3xl p-8 sm:p-10 shadow-xl"
                style={{
                  background: theme === "dark" ? "#0d1117" : "#ffffff",
                  border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <AnimatePresence mode="wait">
                  {!isSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Form header */}
                      <div className="mb-7">
                        <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white mb-1.5">
                          Schedule your live demo
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Fill in your details — we'll set up a screen share at your convenience.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Name & Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field id="name" label="Full Name" icon={User} error={errors.name?.message}>
                            <Input id="name" type="text" placeholder="John Doe"
                              className={inputCls(!!errors.name)} {...register("name")} />
                          </Field>
                          <Field id="company" label="Company Name" icon={Building} error={errors.company?.message}>
                            <Input id="company" type="text" placeholder="Acme Transportation"
                              className={inputCls(!!errors.company)} {...register("company")} />
                          </Field>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field id="email" label="Work Email" icon={Mail} error={errors.email?.message}>
                            <Input id="email" type="email" placeholder="john@acme.com"
                              className={inputCls(!!errors.email)} {...register("email")} />
                          </Field>
                          <Field id="phone" label="Phone Number" icon={Phone} error={errors.phone?.message}>
                            <Input id="phone" type="tel" placeholder="+91 98000 00000"
                              className={inputCls(!!errors.phone)} {...register("phone")} />
                          </Field>
                        </div>

                        {/* Fleet Size */}
                        <Field id="fleetSize" label="Fleet Size (No. of Vehicles)" icon={BarChart3} error={errors.fleetSize?.message}>
                          <Select
                            value={fleetSizeValue}
                            onValueChange={(v) => setValue("fleetSize", v, { shouldValidate: true })}
                          >
                            <SelectTrigger
                              id="fleetSize"
                              className={`h-11 bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] ${errors.fleetSize ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder="Select fleet size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1 – 10 vehicles</SelectItem>
                              <SelectItem value="11-50">11 – 50 vehicles</SelectItem>
                              <SelectItem value="51-200">51 – 200 vehicles</SelectItem>
                              <SelectItem value="200+">200+ vehicles</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>

                        {/* Message */}
                        <Field id="message" label="What challenges are you looking to solve?" icon={MessageSquare}>
                          <Textarea
                            id="message"
                            placeholder="e.g. tracking empty miles, manual billing delays, driver shortages..."
                            rows={3}
                            className="resize-none bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            {...register("message")}
                          />
                        </Field>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group w-full h-12 flex items-center justify-center gap-2 rounded-xl font-display font-semibold text-sm text-white bg-primary transition-all duration-200 hover:opacity-90 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Scheduling Demo…
                            </>
                          ) : (
                            <>
                              Request Live Demo
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                          No credit card required · Our team responds within 2 hours
                        </p>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="py-10 text-center space-y-6"
                    >
                      {/* Success icon */}
                      <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}>
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                          Demo Slot Reserved!
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                          We've logged your request. Our team will review your fleet profile
                          and reach out within <strong className="text-slate-700 dark:text-slate-200">2 hours</strong> to confirm your calendar slot.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl text-left max-w-sm mx-auto space-y-2"
                        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> What happens next?
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Expect an email or call with a personalized Calendly link for your 30-min walkthrough.
                        </p>
                      </div>

                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary transition-all hover:opacity-90"
                      >
                        Return to Homepage <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: "#0a0d14", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container-tight py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: "#4b5563" }}>
              © {new Date().getFullYear()} Fleetcodes · All rights reserved.
            </p>
            <div className="hidden sm:flex items-center gap-2">
              <span
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}
              >
                <ShieldCheck className="w-2.5 h-2.5" /> SOC 2
              </span>
              <span
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }}
              >
                <Zap className="w-2.5 h-2.5" /> 14-day deploy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: "#4b5563" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookDemo;

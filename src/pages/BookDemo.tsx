import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight,
  CheckCircle2, Loader2, ShieldCheck, Clock, Sparkles,
  Building, Mail, User, Phone, MessageSquare, Sun, Moon, Languages,
  Zap, BarChart3, Globe, CheckCircle,
} from "lucide-react";

import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import Seo         from "@/components/seo/Seo";
import { trackEvent } from "@/lib/analytics";
import { openCookiePreferences } from "@/lib/cookieConsent";
import { useTheme }   from "@/hooks/use-theme";
import { toast }      from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Validation schema ─────────────────────────────────────────────────────────
const createFormSchema = (t: (key: string) => string) => z.object({
  name:      z.string().min(2, t("pages.demo.validation.name")),
  email:     z.string().email(t("pages.demo.validation.email")),
  phone:     z.string().min(10, t("pages.demo.validation.phone")),
  company:   z.string().min(2, t("pages.demo.validation.company")),
  fleetSize: z.string({ required_error: t("pages.demo.validation.fleet") }),
  message:   z.string().optional(),
});

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

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
const checkpointIcons = [Zap, BarChart3, Globe];

// ─── Weekdays helper ───────────────────────────────────────────────────────────
const getNextFiveWeekdays = () => {
  const days = [];
  const current = new Date();
  while (days.length < 5) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip Sunday & Saturday
      days.push(new Date(current));
    }
  }
  return days;
};

const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" });
};

// ─── Component ─────────────────────────────────────────────────────────────────
const BookDemo = () => {
  const { t, tObject, language, localizePath, setLanguage } = useTranslation();
  const locale = language === "hi" ? "hi-IN" : "en-US";
  const stats = tObject<Array<{ value: string; label: string }>>("pages.demo.stats");
  const checkpoints = tObject<Array<{ title: string; desc: string }>>("pages.demo.checkpoints").map((item, index) => ({ ...item, icon: checkpointIcons[index] }));
  const formSchema = createFormSchema(t);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [email,        setEmail]        = useState("");
  const [subscribed,   setSubscribed]   = useState(false);
  const [nlLoading,    setNlLoading]    = useState(false);
  const { theme, toggleTheme }          = useTheme();
  const [scrolled, setScrolled]         = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNlLoading(true);

    const sheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
    if (sheetUrl) {
      try {
        const params = new URLSearchParams();
        params.append("email",  email);
        params.append("source", "News Letter");
        await fetch(sheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        });
      } catch {
        toast.error(t("pages.demo.newsletter.error"));
      }
    }

    setNlLoading(false);
    setSubscribed(true);
    setEmail("");
  };

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
    
    // Append slot if selected
    let finalMessage = data.message || "";
    if (selectedDate && selectedTime) {
      finalMessage = `${finalMessage}\n\n[Preferred Demo Slot: ${selectedDate} at ${selectedTime}]`.trim();
    }
    
    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!googleSheetUrl) {
      await new Promise((r) => setTimeout(r, 1500));
      trackEvent("generate_lead", {
        fleet_size: data.fleetSize,
        demo_slot_selected: Boolean(selectedDate && selectedTime),
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t("pages.demo.toastSuccess"));
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("name",      data.name);
      params.append("email",     data.email);
      params.append("phone",     data.phone);
      params.append("company",   data.company);
      params.append("fleetSize", data.fleetSize);
      params.append("message",   finalMessage);
      params.append("source",    "Form Data");

      await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      trackEvent("generate_lead", {
        fleet_size: data.fleetSize,
        demo_slot_selected: Boolean(selectedDate && selectedTime),
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t("pages.demo.toastSuccess"));
    } catch {
      setIsSubmitting(false);
      toast.error(t("pages.demo.toastError"));
    }
  };

  const inputCls = (hasError: boolean) =>
    `h-11 bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-primary/30 transition-colors ${
      hasError ? "border-destructive focus-visible:ring-destructive" : ""
    }`;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <Seo
        title={t("pages.demo.seoTitle")}
        description={t("pages.demo.seoDescription")}
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
            <Link to={localizePath("/")} className="flex shrink-0 items-center gap-2" aria-label="Fleetcodes home">
              <img src="/assets/brand/logo-with-bg.png" alt="" className="h-9 w-9 object-contain" />
              <span className="leading-none">
                <span className="block font-display text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  fleet<span className="text-[#5542f6]">codes</span>
                </span>
                <span className="mt-1 hidden text-[5px] font-medium uppercase tracking-[0.13em] text-slate-500 sm:block dark:text-slate-400">
                  AI operating system for fleet operations
                </span>
              </span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <div className="flex h-9 items-center rounded-[14px] border border-slate-200 bg-white p-1 dark:border-white/[0.08] dark:bg-white/[0.04] shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage(language === "hi" ? "en" : "hi")}
                  className="flex h-7 items-center gap-1.5 rounded-[10px] pl-2 pr-1.5 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                  aria-label={t("navbarMenu.switchLanguage") as string}
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-semibold tracking-wide mt-0.5">{t("navbarMenu.langAbbr")}</span>
                </button>
                <div className="mx-1 h-3.5 w-px bg-slate-200 dark:bg-white/20" />
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                  className="flex h-7 w-7 items-center justify-center rounded-[10px] transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.06]"
                >
                  {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="w-px h-5 bg-border/60 hidden sm:block" />
              <Link
                to={localizePath("/")}
                className="group flex h-9 items-center justify-center gap-2 px-4 text-sm font-medium text-slate-700 transition-all duration-200 rounded-[14px] bg-white border border-slate-200 shadow-sm hover:bg-slate-50 dark:text-slate-300 dark:bg-white/[0.04] dark:border-white/[0.08] dark:hover:bg-white/[0.08] dark:shadow-none"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">{t("pages.demo.back")}</span>
                <span className="sm:hidden">{t("pages.demo.backShort")}</span>
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
                {t("pages.demo.badge")}
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                  {t("pages.demo.heroTitle")}{" "}
                  <span className="text-gradient-primary">{t("pages.demo.heroAccent")}</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-base">
                  {t("pages.demo.heroDescription")}
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
                  <span className="text-xs font-medium">{t("pages.demo.trust.schedule")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">{t("pages.demo.trust.soc")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">{t("pages.demo.trust.card")}</span>
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
                          {t("pages.demo.formTitle")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {t("pages.demo.formDescription")}
                        </p>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Name & Company */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field id="name" label={t("pages.demo.name")} icon={User} error={errors.name?.message}>
                            <Input id="name" type="text" placeholder={t("pages.demo.namePlaceholder")}
                              className={inputCls(!!errors.name)} {...register("name")} />
                          </Field>
                          <Field id="company" label={t("pages.demo.company")} icon={Building} error={errors.company?.message}>
                            <Input id="company" type="text" placeholder={t("pages.demo.companyPlaceholder")}
                              className={inputCls(!!errors.company)} {...register("company")} />
                          </Field>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <Field id="email" label={t("pages.demo.email")} icon={Mail} error={errors.email?.message}>
                            <Input id="email" type="email" placeholder="john@acme.com"
                              className={inputCls(!!errors.email)} {...register("email")} />
                          </Field>
                          <Field id="phone" label={t("pages.demo.phone")} icon={Phone} error={errors.phone?.message}>
                            <Input id="phone" type="tel" placeholder="+91 98000 00000"
                              className={inputCls(!!errors.phone)} {...register("phone")} />
                          </Field>
                        </div>

                        {/* Fleet Size */}
                        <Field id="fleetSize" label={t("pages.demo.fleet")} icon={BarChart3} error={errors.fleetSize?.message}>
                          <Select
                            value={fleetSizeValue}
                            onValueChange={(v) => setValue("fleetSize", v, { shouldValidate: true })}
                          >
                            <SelectTrigger
                              id="fleetSize"
                              className={`h-11 bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] ${errors.fleetSize ? "border-destructive" : ""}`}
                            >
                              <SelectValue placeholder={t("pages.demo.fleetPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1 – 10 {t("pages.demo.vehicles")}</SelectItem>
                              <SelectItem value="11-50">11 – 50 {t("pages.demo.vehicles")}</SelectItem>
                              <SelectItem value="51-200">51 – 200 {t("pages.demo.vehicles")}</SelectItem>
                              <SelectItem value="200+">200+ {t("pages.demo.vehicles")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>

                        {/* Message */}
                        <Field id="message" label={t("pages.demo.challenge")} icon={MessageSquare}>
                          <Textarea
                            id="message"
                            placeholder={t("pages.demo.challengePlaceholder")}
                            rows={3}
                            className="resize-none bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                            {...register("message")}
                          />
                        </Field>

                        {/* Preferred Slot Picker */}
                        <div className="space-y-4 pt-2">
                          <Label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                            {t("pages.demo.slot")}
                          </Label>
                          
                          {/* Date Picker */}
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {getNextFiveWeekdays().map((d) => {
                              const dateStr = formatDate(d, locale);
                              const isSelected = selectedDate === dateStr;
                              return (
                                <button
                                  key={dateStr}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(isSelected ? null : dateStr);
                                    if (isSelected) setSelectedTime(null);
                                  }}
                                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all min-w-[72px] shrink-0 ${
                                    isSelected
                                      ? "bg-primary/10 border-primary text-primary"
                                      : "bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                                    {d.toLocaleDateString(locale, { weekday: "short" })}
                                  </span>
                                  <span className="text-sm font-bold mt-0.5">
                                    {d.toLocaleDateString(locale, { day: "numeric" })}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Time Picker */}
                          {selectedDate && (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                              {["10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map((t) => {
                                const isSelected = selectedTime === t;
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setSelectedTime(isSelected ? null : t)}
                                    className={`py-2 px-3 rounded-lg border text-center text-xs font-semibold tracking-wide transition-all ${
                                      isSelected
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white dark:bg-[#0d1117] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-400"
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group w-full h-12 flex items-center justify-center gap-2 rounded-xl font-display font-semibold text-sm text-white bg-primary transition-all duration-200 hover:opacity-90 hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              {t("pages.demo.scheduling")}
                            </>
                          ) : (
                            <>
                              {t("pages.demo.submit")}
                              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
                          {t("pages.demo.response")}
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
                          {t("pages.demo.successTitle")}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                          {t("pages.demo.successText")}
                        </p>
                      </div>

                      {selectedDate && selectedTime ? (
                        <div className="p-5 rounded-2xl text-left max-w-sm mx-auto space-y-2 mt-4"
                          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {t("pages.demo.slotDetails")}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t("pages.demo.preferred", { date: selectedDate, time: selectedTime })}
                          </p>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl text-left max-w-sm mx-auto space-y-2 mt-4"
                          style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)" }}>
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {t("pages.demo.next")}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t("pages.demo.nextText")}
                          </p>
                        </div>
                      )}

                      <Link
                        to={localizePath("/")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary transition-all hover:opacity-90 mt-6"
                      >
                        {t("pages.demo.returnHome")} <ArrowRight className="w-4 h-4" />
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

        {/* Newsletter strip */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container-tight py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] mb-1.5" style={{ color: "#7c3aed" }}>{t("pages.demo.newsletter.label")}</p>
              <h3 className="font-display font-semibold text-lg text-white mb-1">{t("pages.demo.newsletter.title")}</h3>
              <p className="text-sm" style={{ color: "#64748b" }}>{t("pages.demo.newsletter.description")}</p>
            </div>
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full lg:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("pages.demo.newsletter.placeholder")}
                  required
                  className="flex-1 lg:w-60 px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                />
                <button
                  type="submit"
                  disabled={nlLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-primary rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {nlLoading ? t("pages.demo.newsletter.subscribing") : <>{t("pages.demo.newsletter.subscribe")} <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
            ) : (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t("pages.demo.newsletter.success")} 🎉
              </div>
            )}
          </div>
        </div>

        {/* Copyright bar */}
        <div className="container-tight py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: "#4b5563" }}>
              © {new Date().getFullYear()} Fleetcodes · {t("pages.demo.newsletter.rights")}
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
                <Zap className="w-2.5 h-2.5" /> {t("pages.demo.newsletter.deploy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs" style={{ color: "#4b5563" }}>
            <Link to={localizePath("/privacy/")} className="hover:text-white transition-colors">{t("common.privacy")}</Link>
            <Link to={localizePath("/terms/")} className="hover:text-white transition-colors">{t("common.terms")}</Link>
            <Link to={localizePath("/security/")} className="hover:text-white transition-colors">{t("common.security")}</Link>
            <button type="button" onClick={openCookiePreferences} className="hover:text-white transition-colors">{t("common.cookiePreferences")}</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookDemo;

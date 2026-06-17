import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Cpu, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Building,
  Mail,
  User,
  Phone,
  MessageSquare,
  Sun,
  Moon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import Seo from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "sonner";

// Form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email"),
  phone: z.string().min(10, "Please enter a valid phone number (minimum 10 digits)"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  fleetSize: z.string({
    required_error: "Please select your fleet size",
  }),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const BookDemo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const fleetSizeValue = watch("fleetSize");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    trackEvent("submit_lead", {
      fleet_size: data.fleetSize,
      company: data.company,
    });

    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!googleSheetUrl) {
      console.warn(
        "VITE_GOOGLE_SHEET_URL is not configured. Simulating Google Sheet submission in development mode."
      );
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Demo request submitted successfully (Dev Mode)!");
      return;
    }

    try {
      // Create urlencoded body to prevent CORS preflight issues with Google Apps Script
      const params = new URLSearchParams();
      params.append("name", data.name);
      params.append("email", data.email);
      params.append("phone", data.phone);
      params.append("company", data.company);
      params.append("fleetSize", data.fleetSize);
      params.append("message", data.message || "");
      params.append("source", "Website Book Demo Page");

      await fetch(googleSheetUrl, {
        method: "POST",
        mode: "no-cors", // Bypasses CORS restrictions on Google Apps Script redirect responses
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      // Since mode is 'no-cors', we won't get a read-response or status 200, 
      // but if the promise resolves, the request was successfully sent!
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Demo request submitted successfully!");
    } catch (error) {
      console.error("Error submitting to Google Sheet:", error);
      setIsSubmitting(false);
      toast.error("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between">
      <Seo
        title={`Book a Free Live Demo | ${SITE_NAME}`}
        description="Schedule a 30-minute personalized walkthrough with our logistics automation experts. Learn how Fleetcodes TMS can digitize and automate your operations."
        path="/book-demo"
      />

      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none -z-10" />

      {/* Simplified Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="container-tight">
          <nav
            className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
              scrolled ? "glass-strong shadow-card" : ""
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5 font-display font-semibold text-lg">
              <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary shadow-glow">
                <Cpu className="w-5 h-5 text-primary-foreground" />
              </span>
              <span className="text-gradient">Fleetcodes</span>
              <span className="text-muted-foreground/70 text-xs font-body uppercase tracking-widest hidden sm:inline">
                TMS
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center pt-28 pb-12 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-20">
        <div className="container-tight">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Value Prop & Credibility */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass text-xs font-medium text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>30-Minute Live Walkthrough</span>
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight leading-[1.1]">
                  See Fleetcodes in <br />
                  <span className="text-gradient-primary">Autopilot Mode.</span>
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Discover how our automation-first TMS connects operations, billing, Fastag tracking, and driver management into a single, self-running engine.
                </p>
              </div>

              {/* Quick Features Checklist */}
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm">Custom SOP Mapping</h4>
                    <p className="text-xs text-muted-foreground">We will map 1 of your core dispatch SOPs live during the demo.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm">Real-time Cost Audits</h4>
                    <p className="text-xs text-muted-foreground">See how our AI identifies leakages and empty miles instantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-sm">Integration Consultation</h4>
                    <p className="text-xs text-muted-foreground">Learn how we connect with your existing GPS providers and ERPs.</p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-6 border-t border-border/40 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs">Schedule in 60s</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs">SOC 2 compliant</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form Card */}
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl pointer-events-none -z-10" />
                <div className="glass-strong rounded-3xl p-8 sm:p-10 border border-border/40 shadow-elegant">
                  <AnimatePresence mode="wait">
                    {!isSuccess ? (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="mb-8 text-left">
                          <h3 className="font-display font-semibold text-2xl mb-1.5">Schedule your live demo</h3>
                          <p className="text-sm text-muted-foreground">
                            Fill in your details below. We'll set up a screen share at your convenience.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                          
                          {/* Name & Company */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <Label htmlFor="name" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-primary/70" />
                                Full Name
                              </Label>
                              <Input
                                id="name"
                                type="text"
                                placeholder="Rahul Kumar"
                                className={`h-11 ${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("name")}
                              />
                              {errors.name && (
                                <p className="text-xxs font-medium text-destructive mt-1">{errors.name.message}</p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="company" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Building className="w-3.5 h-3.5 text-primary/70" />
                                Company Name
                              </Label>
                              <Input
                                id="company"
                                type="text"
                                placeholder="Fleetcodes Logistics"
                                className={`h-11 ${errors.company ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("company")}
                              />
                              {errors.company && (
                                <p className="text-xxs font-medium text-destructive mt-1">{errors.company.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Email & Phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-primary/70" />
                                Work Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="rahul@fleetcodes.com"
                                className={`h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("email")}
                              />
                              {errors.email && (
                                <p className="text-xxs font-medium text-destructive mt-1">{errors.email.message}</p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-primary/70" />
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                className={`h-11 ${errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                {...register("phone")}
                              />
                              {errors.phone && (
                                <p className="text-xxs font-medium text-destructive mt-1">{errors.phone.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Fleet Size */}
                          <div className="space-y-1.5">
                            <Label htmlFor="fleetSize" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <Cpu className="w-3.5 h-3.5 text-primary/70" />
                              Fleet Size (Number of Vehicles)
                            </Label>
                            <Select
                              value={fleetSizeValue}
                              onValueChange={(val) => setValue("fleetSize", val, { shouldValidate: true })}
                            >
                              <SelectTrigger className={`h-11 bg-background ${errors.fleetSize ? "border-destructive focus-visible:ring-destructive" : ""}`}>
                                <SelectValue placeholder="Select fleet size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-10">1 to 10 vehicles</SelectItem>
                                <SelectItem value="11-50">11 to 50 vehicles</SelectItem>
                                <SelectItem value="51-200">51 to 200 vehicles</SelectItem>
                                <SelectItem value="200+">200+ vehicles</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.fleetSize && (
                              <p className="text-xxs font-medium text-destructive mt-1">{errors.fleetSize.message}</p>
                            )}
                          </div>

                          {/* Key Challenges / Message */}
                          <div className="space-y-1.5">
                            <Label htmlFor="message" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-primary/70" />
                              What challenges are you looking to solve?
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="e.g. tracking empty miles, manual billing delay, driver shortages..."
                              rows={3}
                              className="resize-none"
                              {...register("message")}
                            />
                          </div>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            variant="hero"
                            className="w-full h-12 mt-2 font-display text-sm font-semibold flex items-center justify-center gap-2 group"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                Scheduling Demo...
                              </>
                            ) : (
                              "Request Live Demo"
                            )}
                          </Button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="py-8 text-center space-y-6"
                      >
                        <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-glow animate-pulse-glow">
                          <CheckCircle2 className="w-10 h-10" />
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-display font-bold text-2xl text-foreground">Demo Slot Reserved!</h3>
                          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                            Thank you for reaching out. We have logged your request and a copy of your response has been saved to our database.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl border border-primary/15 bg-primary/5 text-left max-w-sm mx-auto space-y-2.5">
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> What happens next?
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Our team will review your fleet profile and email/call you within **2 hours** to confirm a calendar invitation link.
                          </p>
                        </div>

                        <div className="pt-2">
                          <Button asChild variant="hero" size="default">
                            <Link to="/">Return to Homepage</Link>
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="py-8 border-t border-border/40 bg-background/30">
        <div className="container-tight flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fleetcodes · All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BookDemo;

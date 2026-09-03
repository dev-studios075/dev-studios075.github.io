import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap, Shield, Globe, Target, Lightbulb,
  Users, TrendingUp, BarChart3, Clock,
  Sparkles, MapPin, Mail,
  Heart,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Data ─────────────────────────────────────────────────────────────────────
const statIcons = [TrendingUp, MapPin, BarChart3, Clock];

const valueIcons = [Target, Zap, Shield, Lightbulb, Heart, Globe];
type StatCopy = { value: string; label: string };
type ValueCopy = { title: string; desc: string };
type MilestoneCopy = { year: string; title: string; desc: string };

// ─── Page ─────────────────────────────────────────────────────────────────────
const About = () => {
  const { t, tObject, localizePath } = useTranslation();
  const stats = tObject<StatCopy[]>("pages.about.stats").map((item, index) => ({ ...item, icon: statIcons[index] }));
  const values = tObject<ValueCopy[]>("pages.about.values").map((item, index) => ({ ...item, icon: valueIcons[index] }));
  const milestones = tObject<MilestoneCopy[]>("pages.about.milestones");
  const consoleStats = tObject<StatCopy[]>("pages.about.consoleStats");
  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Seo
        title={t("pages.about.seoTitle")}
        description={t("pages.about.seoDescription")}
        path="/about"
      />

      {/* Background — fixed so they never affect scroll height */}
      <div className="fixed top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-primary/7 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[100px] pointer-events-none -z-10" />
      <div className="fixed inset-0 grid-bg opacity-[0.12] pointer-events-none -z-10" />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-14 text-center sm:pt-36 sm:pb-16 lg:pt-40">
        <div className="container-tight">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            {t("pages.about.heroBadge")}
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-slate-900 dark:text-white max-w-4xl mx-auto mb-6">
            {t("pages.about.heroTitle")}{" "}
            <span className="text-gradient-primary">{t("pages.about.heroAccent")}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400 sm:text-xl">
            {t("pages.about.heroDescription")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={localizePath("/book-demo/")}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
            >
              {t("pages.about.seePlatform")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to={localizePath("/careers/")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
            >
              {t("pages.about.joinTeam")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-12 dark:border-white/[0.05] sm:py-14">
        <div className="container-tight">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="p-6 rounded-2xl text-center bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07] group hover:border-primary/30 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </div>
                  <div className="font-display font-bold text-3xl text-gradient-primary mb-1">{s.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] mb-4 text-primary">{t("pages.about.missionLabel")}</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-6 leading-tight">
                {t("pages.about.missionTitle")}{" "}
                <span className="text-gradient-primary">{t("pages.about.missionAccent")}</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-5 text-base">
                {t("pages.about.missionP1")}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                {t("pages.about.missionP2")}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1117]/80 border border-slate-200 dark:border-white/[0.08] shadow-2xl relative overflow-hidden font-mono text-left select-none">
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/4 w-1/2 h-10 bg-primary/10 blur-xl rounded-full pointer-events-none" />

              {/* Console Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/[0.08] mb-5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t("pages.about.console")}</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/20 dark:bg-red-500/25" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/20 dark:bg-yellow-500/25" />
                  <span className="w-2 h-2 rounded-full bg-green-500/20 dark:bg-green-500/25" />
                </div>
              </div>

              {/* Grid of Key Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {consoleStats.map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] text-center hover:border-primary/20 hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-all duration-300">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-medium truncate">{s.label}</div>
                    <div className="text-xl font-bold font-display text-gradient-primary">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Live Telemetry Stream Terminal */}
              <div className="space-y-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100/50 dark:bg-black/45 p-4 rounded-xl border border-slate-200/50 dark:border-white/[0.03]">
                <div className="text-emerald-600 dark:text-emerald-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:01] MH-12-Q-4029 auto-dispatched</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:14] FASTag matched (toll_id: 8291)</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400/85 flex items-center gap-1.5">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:28] Telemetry ping received (12k/sec)</span>
                </div>
                <div className="text-primary/90 flex items-center gap-1.5 animate-pulse">
                  <span className="text-slate-400 dark:text-slate-600">&gt;</span>
                  <span>[15:27:31] Syncing billing ledger...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story / Timeline ───────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3 text-primary">{t("pages.about.journeyLabel")}</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {t("pages.about.journeyTitle")}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year + m.title} className="flex gap-6 group">
                {/* Connector */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-xs text-primary transition-all group-hover:scale-110"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)" }}
                  >
                    {m.year.slice(2)}
                  </div>
                  {i < milestones.length - 1 && (
                    <div className="w-px flex-1 my-2 bg-slate-200 dark:bg-white/[0.07]" />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-10 ${i === milestones.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-primary mb-1">{m.year}</p>
                  <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white mb-2">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.2em] mb-3 text-primary">{t("pages.about.principlesLabel")}</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {t("pages.about.principlesTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] group bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.07]"
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#7c3aed" }} />
                  </span>
                  <h3 className="font-display font-semibold text-base text-slate-800 dark:text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 py-14 dark:border-white/[0.05] sm:py-16">
        <div className="container-tight">
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-center sm:p-10"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0.04) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary border border-primary/20 bg-primary/5 mb-6">
                <Users className="w-3.5 h-3.5" />
                {t("pages.about.ctaBadge")}
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-4">
                {t("pages.about.ctaTitle")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                {t("pages.about.ctaDescription")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={localizePath("/book-demo/")}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:opacity-90 hover:shadow-glow transition-all"
                >
                  {t("pages.about.ctaButton")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <a
                  href="mailto:support@fleetcodes.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 border border-border hover:border-primary/40 hover:text-primary transition-all"
                >
                  <Mail className="w-4 h-4" />
                  support@fleetcodes.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

import { useEffect, useState } from "react";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { Link } from "react-router-dom";
import { OPEN_COOKIE_PREFERENCES_EVENT, readCookieConsent, saveCookieConsent } from "@/lib/cookieConsent";
import { useTranslation } from "@/hooks/useTranslation";

const CookieConsent = () => {
  const { t, localizePath } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readCookieConsent();
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
    } else {
      setVisible(true);
    }

    const open = () => {
      const current = readCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_PREFERENCES_EVENT, open);
  }, []);

  const choose = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveCookieConsent({ analytics: nextAnalytics, marketing: nextMarketing });
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setVisible(false);
    setCustomizing(false);
  };

  if (!visible) return null;

  return <div className={customizing ? "fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center sm:p-6" : "pointer-events-none fixed inset-x-0 bottom-0 z-[120] p-3 sm:p-6"} role="region" aria-label="Cookie consent">
    <div className={`pointer-events-auto relative mx-auto w-full overflow-hidden border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_-20px_rgba(15,23,42,0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#111522]/95 ${customizing ? "max-w-2xl rounded-3xl" : "max-w-4xl rounded-2xl sm:rounded-3xl"}`}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
      {customizing ? (
        <div className="relative p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-primary"><Settings2 className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-widest">{t("cookieConsent.preferences")}</span></div><h2 className="font-display text-xl font-semibold text-slate-950 dark:text-white">{t("cookieConsent.choose")}</h2></div>{readCookieConsent() && <button onClick={() => { setVisible(false); setCustomizing(false); }} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Close cookie preferences"><X className="h-5 w-5" /></button>}</div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t("cookieConsent.description")}</p>
          <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 dark:divide-white/10 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="flex items-center justify-between gap-5 p-4"><div><p className="font-semibold text-slate-900 dark:text-white">{t("cookieConsent.essential")}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t("cookieConsent.essentialDesc")}</p></div><span className="shrink-0 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t("cookieConsent.alwaysOn")}</span></div>
            {[{ label: t("cookieConsent.analytics") as string, description: t("cookieConsent.analyticsDesc") as string, value: analytics, setValue: setAnalytics }, { label: t("cookieConsent.marketing") as string, description: t("cookieConsent.marketingDesc") as string, value: marketing, setValue: setMarketing }].map(({ label, description, value, setValue }) => <div key={label} className="flex items-center justify-between gap-5 p-4"><div><p className="font-semibold text-slate-900 dark:text-white">{label}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p></div><button type="button" role="switch" aria-checked={value} onClick={() => setValue(!value)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"}`}><span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} /></button></div>)}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button onClick={() => choose(false, false)} className="min-h-11 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/15 dark:text-slate-300">{t("cookieConsent.rejectNonEssential")}</button><button onClick={() => choose(analytics, marketing)} className="min-h-11 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:opacity-95">{t("cookieConsent.savePreferences")}</button></div>
        </div>
      ) : (
        <div className="relative p-5 sm:p-6"><div className="flex max-w-3xl items-start gap-3.5"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-inner"><Cookie className="h-5 w-5" /></div><div><p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{t("cookieConsent.controls")}</p><h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">{t("cookieConsent.yourPrivacy")}</h2><p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{t("cookieConsent.bannerDesc")} <Link to={localizePath("/privacy/")} className="whitespace-nowrap font-semibold text-primary hover:underline">{t("cookieConsent.privacyPolicy")}&nbsp;↗</Link></p></div></div><div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3"><button onClick={() => choose(false, false)} className="min-h-11 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:bg-primary/[0.03] hover:text-primary dark:border-white/15 dark:text-slate-300">{t("cookieConsent.reject")}</button><button onClick={() => setCustomizing(true)} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:bg-primary/[0.03] hover:text-primary dark:border-white/15 dark:text-slate-300"><Settings2 className="h-4 w-4" />{t("cookieConsent.customize")}</button><button onClick={() => choose(true, true)} className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:opacity-95">{t("cookieConsent.acceptAll")}</button></div></div>
      )}
      <div className="relative flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-2.5 text-center text-[11px] text-slate-500 dark:border-white/10 dark:bg-white/[0.02]"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />{t("cookieConsent.footerText")}</div>
    </div>
  </div>;
};

export default CookieConsent;

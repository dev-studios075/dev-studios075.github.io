import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { COOKIE_CONSENT_KEY } from "./src/lib/cookieConsent";

// Google's installer looks for this tag immediately after <head>.
// Consent stays denied until the visitor opts in, including a saved choice read before the first config call.
const googleTag = (mode: string): Plugin => ({
  name: "google-tag",
  transformIndexHtml(html) {
    const env = { ...loadEnv(mode, process.cwd(), "VITE_"), ...process.env };
    const measurementId = env.VITE_GA_MEASUREMENT_ID || "";
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) return html;

    const snippet = `    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
      try {
        var saved = JSON.parse(localStorage.getItem('${COOKIE_CONSENT_KEY}') || 'null');
        if (saved && typeof saved.analytics === 'boolean') {
          gtag('consent', 'update', {
            'analytics_storage': saved.analytics ? 'granted' : 'denied',
            'ad_storage': saved.marketing ? 'granted' : 'denied',
            'ad_user_data': saved.marketing ? 'granted' : 'denied',
            'ad_personalization': saved.marketing ? 'granted' : 'denied'
          });
          if (saved.analytics) window.__fleetcodesGaInitialView = true;
        }
      } catch (error) {}
    </script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    </script>`;

    return html.replace("<head>", `<head>\n${snippet}`);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    googleTag(mode),
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React is shared by every route. Markdown stays in the BlogPost
          // async chunk: a manual markdown chunk makes Rollup hoist the CJS
          // interop helper into it, and the homepage then downloads that chunk.
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run\/router)\//.test(id)) {
            return "react";
          }
        },
      },
    },
  },
}));

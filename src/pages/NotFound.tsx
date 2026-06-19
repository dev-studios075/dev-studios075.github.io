import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, BookOpen } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col items-center justify-center p-6 select-none">
      <Seo
        title={`Page Not Found | ${SITE_NAME}`}
        description="The requested page could not be found."
        noindex
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-[0.03] dark:opacity-[0.07] pointer-events-none -z-10" />

      {/* Ambient background glows */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-violet-500/10 blur-[110px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: "5s" }} />

      <div className="max-w-md w-full text-center relative z-10 space-y-6">
        {/* Large stylized 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <h1 className="font-display text-9xl font-black tracking-tighter text-slate-200 dark:text-slate-800/80 leading-none select-none">
            404
          </h1>
          {/* Overlay text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-4xl font-extrabold tracking-tight text-gradient">
              ROUTE LOST
            </span>
          </div>
        </motion.div>

        {/* Text descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-2.5"
        >
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Lost in Transit
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            The coordinates you requested are offline or do not exist. Let's redirect your fleet back to the main route.
          </p>
        </motion.div>

        {/* Clean side-by-side action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
        >
          <Button asChild variant="hero" className="w-full sm:w-auto px-6 py-5 rounded-xl shadow-glow">
            <Link to="/" className="flex items-center gap-2 justify-center">
              <Home className="w-4 h-4" />
              Return to Base
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto px-6 py-5 rounded-xl border-border/60 hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-650 dark:text-slate-300">
            <Link to="/blog" className="flex items-center gap-2 justify-center">
              <BookOpen className="w-4 h-4" />
              Read Blog Logs
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Standalone clean footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] text-muted-foreground/45 tracking-wider font-mono">
        &copy; {new Date().getFullYear()} FLEETCODES. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
};

export default NotFound;

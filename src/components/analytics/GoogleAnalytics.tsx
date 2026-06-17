import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, trackPageView } from "@/lib/analytics";

const scrollMilestones = [25, 50, 75, 90];

const GoogleAnalytics = () => {
  const location = useLocation();
  const hasSeenInitialPage = useRef(false);
  const trackedScrollDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!hasSeenInitialPage.current) {
      hasSeenInitialPage.current = true;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      trackPageView(`${location.pathname}${location.search}`, document.title);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search]);

  useEffect(() => {
    trackedScrollDepths.current = new Set();

    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const depth = Math.round((window.scrollY / scrollableHeight) * 100);

      scrollMilestones.forEach((milestone) => {
        if (depth >= milestone && !trackedScrollDepths.current.has(milestone)) {
          trackedScrollDepths.current.add(milestone);
          trackEvent("scroll_depth", {
            percent_scrolled: milestone,
            page_path: `${location.pathname}${location.search}`,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;

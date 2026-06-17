import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

const GoogleAnalytics = () => {
  const location = useLocation();
  const hasSeenInitialPage = useRef(false);

  useEffect(() => {
    if (!hasSeenInitialPage.current) {
      hasSeenInitialPage.current = true;
      return;
    }

    trackPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;

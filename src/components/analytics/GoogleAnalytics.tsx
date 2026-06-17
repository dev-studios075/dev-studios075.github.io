import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initializeGoogleAnalytics, trackPageView } from "@/lib/analytics";

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`, document.title);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;

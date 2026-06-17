import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scrolls to top only on PUSH navigation (link clicks / forward nav).
 * Back / forward browser button = "POP" → scroll position preserved naturally.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType(); // "PUSH" | "REPLACE" | "POP"

  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, navType]);

  return null;
};

export default ScrollToTop;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the window to top whenever the route changes.
 * Renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // use "auto" to avoid the smooth animation during route switches
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

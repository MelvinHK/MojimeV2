import { useState, useEffect } from "react";

const QUERY = "(max-width: 480px) or (pointer: coarse)";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
import { useState, useEffect } from "react";

type queries = "width" | "coarse";

/**
 * A hook that checks if the device could be mobile using `matchMedia()`.
 * 
 * @param queries - A string array of queries to include in the query. If no array is provided, all options will be used.
 */
const useIsMobile = (queries: (queries[] | undefined) = undefined) => {
  const query = buildQuery(queries);

  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return isMobile;
};

const buildQuery = (include?: queries[]) => {
  const queries: string[] = [];

  // Default to including all options if no array is provided
  const includeWidth = include ? include.includes("width") : true;
  const includeCoarse = include ? include.includes("coarse") : true;

  if (includeWidth) queries.push("(max-width: 480px)");
  if (includeCoarse) queries.push("(pointer: coarse)");

  return queries.join(" or ");
};

export default useIsMobile;
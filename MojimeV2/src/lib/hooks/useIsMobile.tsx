import { useState, useEffect } from "react";

type Queries = "width" | "coarse" | "no-hover";

/**
 * Checks if the device could be mobile using `matchMedia()`. Use this only when CSS media queries aren't feasible.
 * 
 * @param queries - A string array of queries to include in the query. If no array is provided, all queries will be used.
 * @example useIsMobile(["width", "coarse", "no-hover"]);
 * @queries
 * - "width" - Checks if screen width is less than 768px
 * - "coarse" - Checks if pointer is coarse, i.e. touch screen 
 * - "no-hover" - Checks if the pointer can't hover over elements
 */
const useIsMobile = (queries: (Queries[] | undefined) = undefined) => {
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

const buildQuery = (include?: Queries[]) => {
  const queries: string[] = [];

  // Default to including all options if no array is provided
  const includeWidth = include ? include.includes("width") : true;
  const includeCoarse = include ? include.includes("coarse") : true;
  const includeNoHover = include ? include.includes("no-hover") : true;

  if (includeWidth) queries.push("(max-width: 768px)");
  if (includeCoarse) queries.push("(pointer: coarse)");
  if (includeNoHover) queries.push("(hover: none)");

  return queries.join(" and ");
};

export default useIsMobile;
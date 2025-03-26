import { useState, useEffect } from "react";

type Queries = "width" | "coarse";

/**
 * A hook that checks if the device could be mobile using `matchMedia()`.
 * 
 * @param queries - A string array of queries to include in the query. If no array is provided, all queries will be used.
 * @example
 * useIsMobile(["width", "coarse"]);
 * // "width": Checks if screen width is less than 480px
 * // "coarse": Checks if pointer is coarse, i.e. touch screen 
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

  if (includeWidth) queries.push("(max-width: 480px)");
  if (includeCoarse) queries.push("(pointer: coarse)");

  return queries.join(" or ");
};

export default useIsMobile;
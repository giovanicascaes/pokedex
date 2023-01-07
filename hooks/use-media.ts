import { useCallback, useEffect, useState } from "react";

export default function useMediaQuery(query: string): boolean {
  const matchQuery = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    
    return false;
  }, [query]);

  const [matches, setMatches] = useState<boolean>(matchQuery());

  const handleChange = useCallback(() => {
    setMatches(matchQuery());
  }, [matchQuery]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [handleChange, query]);

  return matches;
}

import { useCallback, useEffect, useState } from "react";

const matches = (query: string) =>
  typeof window !== "undefined" && window.matchMedia(query).matches;

export default function useMedia(query: string): boolean;

export default function useMedia<T>(
  query: string,
  value: T,
  defaultValue: T
): T;

export default function useMedia<T>(
  query: string[],
  value: T[],
  defaultValue: T
): T;

export default function useMedia<T>(
  query: string | string[],
  value?: T | T[],
  defaultValue?: T
): T | boolean {
  const isMultiple =
    Array.isArray(query) && Array.isArray(value) && defaultValue !== undefined;
  const isSingle = !Array.isArray(query);
  const isSingleBoolean =
    isSingle && value === undefined && defaultValue === undefined;
  const isSingleType =
    isSingle &&
    value !== undefined &&
    !Array.isArray(value) &&
    defaultValue !== undefined &&
    !Array.isArray(defaultValue);

  const [matchedQuery, setMatchedQuery] = useState(() => {
    if (isMultiple) {
      return query.find((query) => matches(query)) ?? null;
    }

    if (isSingle && matches(query)) {
      return query;
    }

    return null;
  });

  const handleChange = useCallback((query: string) => {
    setMatchedQuery((current) =>
      matches(query) ? query : current === query ? null : current
    );
  }, []);

  useEffect(() => {
    if (isMultiple) {
      const matchMedias: Array<{
        matchMedia: MediaQueryList;
        listener: EventListener;
      }> = [];

      query.forEach((query) => {
        const matchMedia = window.matchMedia(query);
        const listener = () => handleChange(query);

        handleChange(query);

        matchMedia.addEventListener("change", listener);
        matchMedias.push({ matchMedia, listener });
      });

      return () => {
        matchMedias.forEach(({ matchMedia, listener }) => {
          matchMedia.removeEventListener("change", listener);
        });
      };
    } else if (isSingle) {
      const matchMedia = window.matchMedia(query);
      const listener = () => handleChange(query);

      handleChange(query);

      matchMedia.addEventListener("change", listener);

      return () => {
        matchMedia.removeEventListener("change", listener);
      };
    }
  }, [handleChange, isMultiple, isSingle, query]);

  if (isMultiple) {
    return matchedQuery === null
      ? defaultValue
      : value[query.indexOf(matchedQuery)] ?? defaultValue;
  }

  if (isSingleBoolean) {
    return matchedQuery === null ? defaultValue ?? false : value ?? true;
  }

  if (isSingleType) {
    return matchedQuery === null ? defaultValue : value;
  }

  throw new Error(
    "`query` and `value` must be both either arrays or non-array values, being `value` optional when `query` is a non-array value"
  );
}

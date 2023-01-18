import throttle from "lodash.throttle";
import { UIEvent, useCallback, useMemo, useState } from "react";

export default function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = useCallback((event: UIEvent) => {
    if (event.currentTarget) setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return useMemo(
    () => [scrollTop, { onScroll: throttle(onScroll, 100) }] as const,
    [onScroll, scrollTop]
  );
}

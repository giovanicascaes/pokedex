import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef, useState } from "react";
import { UseResizeObserverArgs } from "./use-resize-observer.types";

export default function useResizeObserver({
  wait = 0,
}: UseResizeObserverArgs = {}) {
  const observerRef = useRef<ResizeObserver>();
  const [ref, setRef] = useState<Element | null>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observerCallback = ([entry]: ResizeObserverEntry[]): void => {
      const { contentRect } = entry;

      setRect(contentRect);
    };
    observerRef.current = new ResizeObserver(debounce(observerCallback, wait));
    observerRef.current.observe(ref);

    return () => observerRef.current!.disconnect();
  }, [ref, wait]);

  return useMemo(() => [setRef, rect] as const, [rect]);
}

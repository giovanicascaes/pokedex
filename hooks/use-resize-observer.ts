import { useEffect, useMemo, useRef, useState } from "react";

export default function useResizeObserver() {
  const observerRef = useRef<ResizeObserver>();
  const [ref, setRef] = useState<Element | null>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observerCallback = ([entry]: ResizeObserverEntry[]): void => {
      const { contentRect } = entry;

      setRect(contentRect);
    };
    observerRef.current = new ResizeObserver(observerCallback);
    observerRef.current.observe(ref);

    return () => observerRef.current!.disconnect();
  }, [ref]);

  return useMemo(() => [setRef, rect] as const, [rect]);
}

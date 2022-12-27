import { useEffect, useMemo, useState } from "react";
import {
  UseIntersectionObserverArgs,
  UseIntersectionObserverReturn,
} from "./use-intersection-observer.types";

function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
}: UseIntersectionObserverArgs = {}): UseIntersectionObserverReturn {
  const [ref, setRef] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    if (!ref) return;

    const observerCallback = ([entry]: IntersectionObserverEntry[]): void => {
      const { isIntersecting } = entry;

      if (isIntersecting || !freezeOnceVisible) {
        setIsIntersecting(isIntersecting);
      }
    };
    const observerOptions = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(ref);

    return () => observer.disconnect();
    // Disable rule to not trigger rerender when `threshold` is an array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, rootMargin, ref, threshold.toString(), freezeOnceVisible]);

  return useMemo(
    () => ({
      ref: setRef,
      isIntersecting,
    }),
    [isIntersecting]
  );
}

export default useIntersectionObserver;

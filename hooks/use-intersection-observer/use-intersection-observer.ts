import { usePrevious } from "hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  UseIntersectionObserverArgs,
  UseIntersectionObserverReturn,
} from "./use-intersection-observer.types";

export default function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  disconnectOnceVisible = false,
  disconnectOnceNotVisibleThenNotVisible = false,
}: UseIntersectionObserverArgs = {}): UseIntersectionObserverReturn {
  const observerRef = useRef<IntersectionObserver>();
  const [ref, setRef] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const prevIsIntersecting = usePrevious(isIntersecting);

  useEffect(() => {
    if (!ref) return;

    const observerCallback = ([entry]: IntersectionObserverEntry[]): void => {
      const { isIntersecting } = entry;

      if (isIntersecting || !freezeOnceVisible) {
        setIsIntersecting(isIntersecting);
      }
    };
    const observerOptions = { threshold, root, rootMargin };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observerRef.current.observe(ref);

    return () => observerRef.current!.disconnect();
    // Disable rule to not trigger rerender when `threshold` is an array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, rootMargin, ref, threshold.toString(), freezeOnceVisible]);

  useEffect(() => {
    if (
      (disconnectOnceVisible && isIntersecting) ||
      (disconnectOnceNotVisibleThenNotVisible &&
        prevIsIntersecting &&
        !isIntersecting)
    ) {
      observerRef.current?.disconnect();
    }
  }, [
    isIntersecting,
    disconnectOnceVisible,
    disconnectOnceNotVisibleThenNotVisible,
    prevIsIntersecting,
  ]);

  return useMemo(
    () => ({
      ref: setRef,
      isIntersecting,
    }),
    [isIntersecting]
  );
}

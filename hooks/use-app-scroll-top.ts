import { usePokemonView } from "contexts";
import { useRouter } from "next/router";
import { UIEvent, useEffect, useMemo, useState } from "react";
import useScrollTop from "./use-scroll-top";

export default function useAppScrollTop(enabled: boolean = false) {
  const [scrollContainerRef, setScrollContainerRef] = useState<Element | null>(
    null
  );
  const { asPath } = useRouter();
  const [
    { isPokemonListRendered, isPokemonListScrollEnabled },
    { onPokemonListScrollRestored },
  ] = usePokemonView();
  const [scrollTop, { onScroll }] = useScrollTop();

  useEffect(() => {
    if (!scrollContainerRef || !enabled) {
      return;
    }

    if (asPath === "/") {
      if (isPokemonListRendered && !isPokemonListScrollEnabled) {
        scrollContainerRef.scrollTo({
          top: scrollTop,
        });
        onPokemonListScrollRestored();
      }
    } else {
      scrollContainerRef.scrollTo({
        top: 0,
      });
    }
  }, [
    asPath,
    enabled,
    isPokemonListRendered,
    isPokemonListScrollEnabled,
    onPokemonListScrollRestored,
    scrollContainerRef,
    scrollTop,
  ]);

  const onScrollHandler = useMemo(() => {
    if (asPath === "/") {
      return (e: UIEvent) => {
        if (isPokemonListScrollEnabled) {
          onScroll(e);
        }
      };
    }
  }, [asPath, isPokemonListScrollEnabled, onScroll]);

  return useMemo(
    () => ({
      ref: setScrollContainerRef,
      onScroll: onScrollHandler,
    }),
    [onScrollHandler]
  );
}

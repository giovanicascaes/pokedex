import { usePokemonView } from "contexts";
import { useRouter } from "next/router";
import { UIEvent, useEffect, useMemo, useState } from "react";
import useScrollTop from "./use-scroll-top";

export default function useAppScrollTop(disabled: boolean = false) {
  const [scrollContainerRef, setScrollContainerRef] = useState<Element | null>(
    null
  );
  const { asPath } = useRouter();
  const [
    { isPokemonListRendered, isPokemonListScrollDisabled },
    { onPokemonListScrollRestored },
  ] = usePokemonView();
  const [scrollTop, { onScroll }] = useScrollTop();

  useEffect(() => {
    if (!scrollContainerRef || disabled) {
      return;
    }

    if (asPath === "/") {
      if (isPokemonListRendered && isPokemonListScrollDisabled) {
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
    disabled,
    isPokemonListRendered,
    isPokemonListScrollDisabled,
    onPokemonListScrollRestored,
    scrollContainerRef,
    scrollTop,
  ]);

  const onScrollHandler = useMemo(() => {
    if (asPath === "/") {
      return (e: UIEvent) => {
        if (!isPokemonListScrollDisabled) {
          onScroll(e);
        }
      };
    }
  }, [asPath, isPokemonListScrollDisabled, onScroll]);

  return useMemo(
    () => ({
      ref: setScrollContainerRef,
      onScroll: onScrollHandler,
    }),
    [onScrollHandler]
  );
}

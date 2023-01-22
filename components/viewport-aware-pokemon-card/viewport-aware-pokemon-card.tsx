import { useIntersectionObserver, usePrevious } from "hooks";
import { useEffect } from "react";
import { PokemonCard } from "../pokemon-card";
import { ViewportAwarePokemonCardProps } from "./viewport-aware-pokemon-card.types";

export default function ViewportAwarePokemonCard({
  onIntersectionChange,
  id,
  ...other
}: ViewportAwarePokemonCardProps) {
  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver({
      threshold: [0.1, 0.9],
      disconnectOnceNotVisibleThenNotVisible: true,
    });
  const prevIsIntersecting = usePrevious(isIntersecting);

  useEffect(() => {
    if (
      prevIsIntersecting !== undefined &&
      prevIsIntersecting !== isIntersecting
    ) {
      onIntersectionChange?.(isIntersecting, id);
    }
  }, [id, isIntersecting, onIntersectionChange, prevIsIntersecting]);

  return (
    <PokemonCard
      key={id}
      identifier={id}
      {...other}
      ref={intersectionObserverRef}
    />
  );
}

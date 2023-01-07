import { animated, useTransition } from "@react-spring/web";
import { useIntersectionObserver } from "hooks";
import { PokemonStatsMeter } from "./pokemon-stats-meter";
import { PokemonStatsProps } from "./pokemon-stats.types";

function PokemonStats({ children, ...other }: PokemonStatsProps) {
  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver({
      freezeOnceVisible: true,
      threshold: 0.5,
    });

  const transition = useTransition(isIntersecting, {
    config: { duration: 350 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
  });

  return (
    <div {...other} ref={intersectionObserverRef}>
      {transition(
        (style, show) =>
          show && (
            <animated.div className="flex space-x-2.5" style={{ ...style }}>
              {children}
            </animated.div>
          )
      )}
    </div>
  );
}

export default Object.assign(PokemonStats, {
  Meter: PokemonStatsMeter,
});

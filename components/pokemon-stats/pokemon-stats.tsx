import { animated, useTransition } from "@react-spring/web";
import { useIntersectionObserver } from "hooks";
import { PokemonStatsProps } from "./pokemon-stats.types";

export default function PokemonStats({
  children,
  ...other
}: PokemonStatsProps) {
  const { isIntersecting, ref: intersectionObserverRef } =
    useIntersectionObserver({
      freezeOnceVisible: true,
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

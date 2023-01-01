import { animated, easings, useTransition } from "@react-spring/web";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { range } from "utils";
import { PokemonStatProps } from "./pokemon-stat.types";

const DEFAULT_DURATION = 60;

interface TrailProps {
  indexes: number[];
  value: number;
  duration: number;
}

function TrailTransition({ indexes, duration, value }: TrailProps) {
  const filledBarsIndexes = useMemo(
    () => indexes.filter((i) => i < value),
    [indexes, value]
  );
  const fillBarsDuration = useMemo(
    () => (duration * indexes.length) / filledBarsIndexes.length,
    [duration, filledBarsIndexes.length, indexes.length]
  );
  const transitions = useTransition(indexes, {
    config: {
      easing: easings.easeOutCirc,
    },
    from: { opacity: 0 },
    enter: {
      opacity: 1,
    },
    trail: 50,
    delay: (key) => {
      const keyAsNumber = key as unknown as number;

      return keyAsNumber >= value
        ? 0
        : (filledBarsIndexes.length -
            1 -
            filledBarsIndexes.indexOf(keyAsNumber)) *
            fillBarsDuration;
    },
  });

  return (
    <>
      {transitions((style, i) => (
        <div
          key={i}
          className="relative bg-slate-200 first:rounded-t last:rounded-b group h-full w-full"
        >
          {i < value && (
            <animated.div
              className="absolute top-0 left-0 z-10 w-full h-full bg-sky-500 group-last:rounded-b group-first:rounded-t"
              style={{ ...style }}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function PokemonStat({
  totalBars = 10,
  value,
  label,
  transitionDuration = DEFAULT_DURATION,
  className,
  barPileClassName,
  ...other
}: PokemonStatProps) {
  return (
    <div
      {...other}
      className={twMerge("flex flex-col items-center w-full h-full", className)}
    >
      <div
        className={twMerge(
          "flex flex-col w-full h-full space-y-1.5",
          barPileClassName
        )}
      >
        <TrailTransition
          indexes={range(1, totalBars).reverse()}
          value={totalBars - value}
          duration={transitionDuration}
        />
      </div>
      <span className="text-2xs font-semibold text-slate-500 text-center mt-1">
        {label}
      </span>
    </div>
  );
}

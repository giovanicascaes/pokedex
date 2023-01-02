import { animated, easings, useTransition } from "@react-spring/web";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { range } from "utils";
import { PokemonStatMeterProps } from "./pokemon-stat-meter.types";

const DEFAULT_DURATION = 20;

const INITIAL_DELAY = 500;

interface TrailProps {
  indexes: number[];
  value: number;
  duration: number;
}

function Trail({ indexes, duration, value }: TrailProps) {
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
      easing: easings.easeInOutSine,
      duration: fillBarsDuration,
    },
    from: { height: "0%" },
    enter: {
      opacity: 1,
      height: "100%",
    },
    delay: (key) => {
      const keyAsNumber = key as unknown as number;

      return keyAsNumber >= value
        ? 0
        : (filledBarsIndexes.length -
            1 -
            filledBarsIndexes.indexOf(keyAsNumber)) *
            fillBarsDuration +
            INITIAL_DELAY;
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
              className="absolute bottom-0 left-0 z-10 w-full h-full bg-sky-500 group-last:rounded-b group-first:rounded-t"
              style={{ ...style }}
            />
          )}
        </div>
      ))}
    </>
  );
}

export default function PokemonStatMeter({
  totalBars = 10,
  value,
  label,
  transitionDuration = DEFAULT_DURATION,
  className,
  barContainerClassName,
  ...other
}: PokemonStatMeterProps) {
  return (
    <div
      {...other}
      className={twMerge("flex flex-col items-center w-full h-full", className)}
    >
      <div
        className={twMerge(
          "flex flex-col w-full h-full space-y-1.5",
          barContainerClassName
        )}
      >
        <Trail
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

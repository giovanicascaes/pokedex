import { animated, easings, useSpring } from "@react-spring/web";
import { useThemeMode } from "contexts";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { match, range } from "utils";
import { PokemonStatsMeterProps } from "./pokemon-stats-meter.types";

const TRANSITION_DURATION = 700;

const TRANSITION_DELAY = 500;

const MAX_VALUE = 255;

interface MeterBarProps {
  totalBars: number;
  value: number;
}

function MeterBar({ totalBars, value }: MeterBarProps) {
  const valueAsNumberOfBars = useMemo(() => {
    const numberOfBars = (value * totalBars) / MAX_VALUE;

    return numberOfBars < totalBars - 1
      ? Math.ceil(numberOfBars)
      : Math.floor(numberOfBars);
  }, [totalBars, value]);

  const [{ isDark }] = useThemeMode();

  const styles = useSpring({
    config: {
      easing: easings.easeOutBack,
      duration: TRANSITION_DURATION,
    },
    from: {
      opacity: 0,
      bottom: "-100%",
    },
    to: {
      opacity: 1,
      bottom: `-${
        100 -
        match(
          range(1, totalBars * 2 - 1)
            .filter((i) => i % 2 !== 0)
            .reduce<{ [K in number]: number }>(
              (acc, i) => ({
                ...acc,
                [i - (i - 1) / 2]: (100 * i) / (totalBars * 2 - 1),
              }),
              {
                0: 0,
              }
            ),
          valueAsNumberOfBars,
          100
        )!
      }%`,
    },
    delay: TRANSITION_DELAY,
  });

  const linearGradient = range(1, totalBars * 2 - 1)
    .map((i) => {
      const step = (100 / (totalBars * 2 - 1)) * i;

      return `${
        i % 2 === 0
          ? `transparent ${step}%,#000 ${step}%`
          : `#000 ${step}%,transparent ${step}%`
      }`;
    })
    .join(",");
  const mask = `linear-gradient(${linearGradient})`;

  return (
    <div
      className="relative bg-slate-200 dark:bg-slate-700/90 first:rounded-t last:rounded-b h-full w-full"
      style={{
        mask,
        WebkitMask: mask,
      }}
    >
      <animated.div
        className="absolute w-full h-full before:content-[''] before:absolute before:bg-inherit dark:before:bg-inherit before:-bottom-10 before:w-full before:h-10"
        style={{
          ...styles,
          backgroundColor: styles.bottom.to(
            (b) =>
              `hsl(${100 + parseFloat(b)}, ${isDark ? "82%, 64%" : "55%, 60%"})`
          ),
        }}
      />
    </div>
  );
}

export default function PokemonStatsMeter({
  totalBars = 10,
  value,
  label,
  className,
  barContainerClassName,
  ...other
}: PokemonStatsMeterProps) {
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
        <MeterBar totalBars={totalBars} value={value} />
      </div>
      <span className="text-2xs font-semibold text-slate-500 text-center my-2">
        {label}
      </span>
    </div>
  );
}

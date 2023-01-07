import { animated, easings, useSpring } from "@react-spring/web";
import { useTheme } from "contexts";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { match, range } from "utils";
import { PokemonStatsMeterProps } from "./pokemon-stats-meter.types";

const DEFAULT_DURATION = 700;

const INITIAL_DELAY = 500;

const MAX_VALUE = 255;

interface TrailProps {
  totalBars: number;
  value: number;
  duration: number;
}

function Trail({ totalBars, duration, value }: TrailProps) {
  const [{ isDark }] = useTheme();
  const valueAsNumberOfBars = useMemo(() => {
    const numberOfBars = (value * totalBars) / MAX_VALUE;

    return numberOfBars < totalBars - 1
      ? Math.ceil(numberOfBars)
      : Math.floor(numberOfBars);
  }, [totalBars, value]);

  const styles = useSpring({
    config: {
      easing: easings.easeOutBack,
      duration,
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
    delay: INITIAL_DELAY,
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
        className="absolute left-0 w-full h-full before:content-[''] before:absolute before:bg-sk dark:before:bg-inherit before:-bottom-10 before:w-full before:h-10"
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
  transitionDuration = DEFAULT_DURATION,
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
        <Trail
          totalBars={totalBars}
          value={value}
          duration={transitionDuration}
        />
      </div>
      <span className="text-2xs font-semibold text-slate-500 text-center my-2">
        {label}
      </span>
    </div>
  );
}

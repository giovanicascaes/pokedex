import { animated, easings, useSpring } from "@react-spring/web"
import { Tooltip } from "components"
import { useThemeMode } from "contexts"
import { useMemo } from "react"
import { twMerge } from "tailwind-merge"
import { match, range } from "utils"
import {
  PokemonStatsMeterBarsProps,
  PokemonStatsMeterProps,
} from "./pokemon-stats-meter.types"

const DEFAULT_TOTAL_BARS = 10

const TRANSITION_DURATION = 700

const TRANSITION_DELAY = 500

const MAX_VALUE = 255

function StatsMeterBars({
  totalBars,
  value,
  className,
  style,
  ...other
}: PokemonStatsMeterBarsProps) {
  const valueAsNumberOfBars = useMemo(() => {
    const numberOfBars = (value * totalBars) / MAX_VALUE

    return numberOfBars < totalBars - 1
      ? Math.ceil(numberOfBars)
      : Math.floor(numberOfBars)
  }, [totalBars, value])

  const [{ isDark }] = useThemeMode()

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
            .reduce<{ [k in number]: number }>(
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
  })

  const linearGradient = range(1, totalBars * 2 - 1)
    .map((i) => {
      const step = (100 / (totalBars * 2 - 1)) * i

      return `${
        i % 2 === 0
          ? `transparent ${step}%,#000 ${step}%`
          : `#000 ${step}%,transparent ${step}%`
      }`
    })
    .join(",")
  const mask = `linear-gradient(${linearGradient})`

  return (
    <div
      {...other}
      className={twMerge(
        "relative bg-slate-200 dark:bg-slate-700/90 h-full w-full",
        className
      )}
      style={{
        mask,
        WebkitMask: mask,
        ...style,
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
  )
}

export default function PokemonStatsMeter({
  totalBars = DEFAULT_TOTAL_BARS,
  value,
  label,
  className,
  barContainerClassName,
  ...other
}: PokemonStatsMeterProps) {
  return (
    <div
      {...other}
      className={twMerge(
        "flex flex-col items-center w-full h-full min-w-[50px]",
        className
      )}
    >
      <Tooltip content={value}>
        <div
          className={twMerge(
            "flex flex-col w-full h-full space-y-1.5 rounded focus-default",
            barContainerClassName
          )}
          tabIndex={0}
        >
          <StatsMeterBars
            totalBars={totalBars}
            value={value}
            className="rounded"
          />
        </div>
      </Tooltip>
      <span className="text-2xs font-semibold text-slate-500 text-center my-2">
        {label}
      </span>
    </div>
  )
}

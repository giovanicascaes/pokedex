import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { getForegroundStyleForColor } from "utils";
import { PokemonTypeBadgeProps } from "./pokemon-type-badge.types";

export default function PokemonTypeBadge({
  color,
  doubleDamage,
  children,
  className,
  ...other
}: PokemonTypeBadgeProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const showToolTip = () => {
    setTooltipVisible(true);
  };
  const hideToolTip = () => {
    setTooltipVisible(false);
  };

  let color1: string;
  let color2: string | undefined;

  if (!color) {
    color1 = "#3d3d3d";
  } else if (typeof color === "string") {
    color1 = color;
  } else {
    [color1, color2] = color;
  }

  const foregroundStyle = getForegroundStyleForColor(color1);
  const textColor = foregroundStyle === "light" ? "text-white" : "text-black";

  const transition = useTransition(tooltipVisible, {
    config: { duration: 100 },
    from: { opacity: 0, transform: "translate(-50%,-30%)" },
    enter: { opacity: 1, transform: "translate(-50%,-50%)" },
    leave: { opacity: 0, transform: "translate(-50%,-30%)" },
  });

  return (
    <div
      {...other}
      className={twMerge(
        "flex items-center justify-center relative w-[180px] py-2.5 rounded-lg text-center text-sm uppercase font-semibold",
        textColor,
        className
      )}
      style={{
        background: color2
          ? `linear-gradient(180deg, ${color1} 50%, ${color2} 50%)`
          : color1,
      }}
    >
      {children}
      {doubleDamage && (
        <span
          className={twMerge(
            "absolute right-2.5 rounded-full cursor-help text-[12px] w-5 h-5 bg-white/50 normal-case font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50",
            textColor,
            foregroundStyle === "light" && "bg-black/50"
          )}
          tabIndex={0}
          onFocus={showToolTip}
          onMouseOver={showToolTip}
          onBlur={hideToolTip}
          onMouseLeave={hideToolTip}
        >
          {transition(
            (styles, visible) =>
              visible && (
                <animated.div
                  className="absolute z-10 -top-full left-1/2 min-w-[150px] px-2 py-1 text-sm normal-case font-normal rounded-md border shadow-md bg-slate-600 border-slate-700/70 text-slate-100 dark:bg-slate-700 dark:border-slate-500/40 dark:text-slate-200 dark:shadow-black/20"
                  style={{ ...styles }}
                >
                  <div className="absolute w-0 h-0 border-8 border-transparent border-t-slate-600 dark:border-t-slate-700 left-1/2 -translate-x-1/2 -translate-y-1/2 -bottom-6 before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent before:border-t-slate-700/70 dark:before:border-t-slate-500/40 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:top-0 after:absolute after:w-0 after:h-0 after:border-[7px] after:border-transparent after:border-t-slate-600 dark:after:border-t-slate-700 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:-top-[1.5px]" />
                  Double Damage
                </animated.div>
              )
          )}
          x2
        </span>
      )}
    </div>
  );
}

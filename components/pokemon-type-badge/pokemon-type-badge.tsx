import { Tooltip } from "components";
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
          <Tooltip
            visible={tooltipVisible}
            className="absolute z-10 -top-full min-w-max max-w-[300px] left-1/2"
          >
            Double Damage
          </Tooltip>
          x2
        </span>
      )}
    </div>
  );
}

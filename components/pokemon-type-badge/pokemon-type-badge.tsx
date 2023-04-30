import { Tooltip } from "components"
import { twMerge } from "tailwind-merge"
import { getForegroundStyleForColor } from "utils"
import { PokemonTypeBadgeProps } from "./pokemon-type-badge.types"

export default function PokemonTypeBadge({
  color,
  doubleDamage,
  children,
  className,
  ...other
}: PokemonTypeBadgeProps) {
  let color1: string
  let color2: string | undefined

  if (!color) {
    color1 = "#3d3d3d"
  } else if (typeof color === "string") {
    color1 = color
  } else {
    ;[color1, color2] = color
  }

  const foregroundStyle = getForegroundStyleForColor(color1)
  const textColor = foregroundStyle === "light" ? "text-white" : "text-black"

  return (
    <div
      {...other}
      className={twMerge(
        "flex items-center justify-center relative w-full py-2.5 rounded-lg text-center text-sm uppercase font-semibold",
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
        <Tooltip content="Double Damage">
          <span
            className={twMerge(
              "absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full cursor-help text-[12px] w-5 h-5 bg-white/50 normal-case font-semibold focus-default",
              textColor,
              foregroundStyle === "light" && "bg-black/50"
            )}
            tabIndex={0}
          >
            x2
          </span>
        </Tooltip>
      )}
    </div>
  )
}

import { twMerge } from "tailwind-merge";
import { match } from "utils";
import { BadgeProps } from "./badge.types";

export default function Badge({
  color = "red",
  className,
  ...other
}: BadgeProps) {
  return (
    <div
      {...other}
      className={twMerge(
        "flex h-min px-2 py-1 rounded text-xs font-semibold uppercase",
        color &&
          match(
            {
              red: "bg-red-50 text-red-700",
              black: "bg-gray-300 text-black",
              blue: "bg-indigo-50 text-indigo-700",
              cyan: "bg-cyan-50 text-cyan-700",
              gray: "bg-slate-200 text-slate-700",
              green: "bg-emerald-50 text-emerald-700",
              orange: "bg-orange-50 text-orange-700",
              pink: "bg-pink-50 text-pink-700",
              purple: "bg-purple-50 text-purple-700",
              white: "bg-white text-gray-700",
              yellow: "bg-amber-50 text-amber-700",
            },
            color
          ),
        className
      )}
    />
  );
}

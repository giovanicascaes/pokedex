import { twMerge } from "tailwind-merge";
import { match } from "utils";
import { BadgeProps } from "./badge.types";

export default function Badge({
  color = "red",
  variant = "default",
  className,
  ...other
}: BadgeProps) {
  return (
    <div
      {...other}
      className={twMerge(
        "flex items-center justify-center h-min text-xs font-semibold uppercase px-2 py-1 rounded",
        variant === "rounded" && "rounded-full px-1.5 py-0.5",
        match(
          {
            red: "bg-red-100/70 dark:bg-red-500/20 text-red-700 dark:text-red-400",
            black: "bg-gray-300 dark:bg-gray-500 text-black",
            blue: "bg-indigo-100/70 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
            cyan: "bg-cyan-100/70 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400",
            gray: "bg-slate-200 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400",
            green:
              "bg-emerald-100/70 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
            orange:
              "bg-orange-100/70 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400",
            pink: "bg-pink-100/70 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400",
            purple:
              "bg-purple-100/70 dark:bg-purple-500/20 text-purple-800 dark:text-purple-400",
            white: "dark:bg-gray-100/20 dark:text-white",
            yellow:
              "bg-amber-100/70 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
          },
          color
        ),
        className
      )}
    />
  );
}

import { animated, useTransition } from "@react-spring/web";
import { twMerge } from "tailwind-merge";
import { TooltipProps } from "./tooltip.types";

const TRANSITION_DURATION = 100;

export default function Tooltip({
  visible = true,
  children,
  className,
  ...other
}: TooltipProps) {
  const transition = useTransition(visible, {
    config: { duration: TRANSITION_DURATION },
    from: { opacity: 0, transform: "translate(-50%,-30%)" },
    enter: { opacity: 1, transform: "translate(-50%,-50%)" },
    leave: { opacity: 0, transform: "translate(-50%,-30%)" },
  });

  return (
    <>
      {transition(
        (styles, visible) =>
          visible && (
            <animated.div
              {...other}
              className={twMerge(
                "px-2 py-1 text-sm normal-case font-normal rounded-md border shadow-md bg-slate-600 border-slate-700/70 text-slate-100 dark:bg-slate-700 dark:border-slate-500/40 dark:text-slate-200 dark:shadow-black/20",
                className
              )}
              style={{ ...styles }}
            >
              <div className="absolute w-0 h-0 border-8 border-transparent border-t-slate-600 dark:border-t-slate-700 left-1/2 -translate-x-1/2 -translate-y-1/2 -bottom-6 before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent before:border-t-slate-700/70 dark:before:border-t-slate-500/40 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:top-0 after:absolute after:w-0 after:h-0 after:border-[7px] after:border-transparent after:border-t-slate-600 dark:after:border-t-slate-700 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:-top-[1.5px]" />
              {children}
            </animated.div>
          )
      )}
    </>
  );
}

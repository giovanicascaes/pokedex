import { animated, useTransition } from "@react-spring/web"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import { Children, cloneElement, ReactElement } from "react"
import { createPortal } from "react-dom"
import { twMerge } from "tailwind-merge"
import { isIterable, mergeRefs } from "utils"
import { TooltipProps } from "./tooltip.types"
import useTooltip from "./use-tooltip"

const TRANSITION_DURATION = 100

export default function Tooltip({
  content,
  shouldWrapChildren,
  children,
  className,
  ...other
}: TooltipProps) {
  const { enabled, getTooltipProps, getTriggerProps } = useTooltip()

  const shouldWrap =
    typeof children !== "object" || isIterable(children) || shouldWrapChildren

  let trigger = children
  const triggerProps = getTriggerProps()

  if (shouldWrap) {
    trigger = (
      <span tabIndex={0} {...triggerProps}>
        {children}
      </span>
    )
  } else {
    const child = Children.only(children) as ReactElement

    trigger = cloneElement(child, {
      ...child.props,
      ...triggerProps,
      ref: mergeRefs(child.props.ref, triggerProps.ref),
    })
  }

  const tooltipProps = getTooltipProps()

  const transition = useTransition(enabled, {
    config: { duration: TRANSITION_DURATION },
    from: { opacity: 0, transform: "translateY(-50%)" },
    enter: { opacity: 1, transform: "translateY(0%)" },
    leave: { opacity: 0, transform: "translateY(-50%)" },
  })

  return (
    <>
      {trigger}
      {transition(
        (styles, show) =>
          show &&
          createPortal(
            <animated.div
              {...other}
              {...tooltipProps}
              className={twMerge(
                "absolute z-20 pointer-events-none px-2 py-1 text-sm normal-case font-normal rounded-md border shadow-md bg-slate-600 border-slate-700/70 text-slate-100 dark:bg-slate-700 dark:border-slate-500/40 dark:text-slate-200 dark:shadow-black/20",
                className
              )}
              style={{
                ...tooltipProps.style,
                ...styles,
              }}
            >
              <div className="absolute w-0 h-0 border-8 border-transparent border-t-slate-600 dark:border-t-slate-700 left-1/2 -translate-x-1/2 -translate-y-1/2 -bottom-6 before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent before:border-t-slate-700/70 dark:before:border-t-slate-500/40 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:top-0 after:absolute after:w-0 after:h-0 after:border-[7px] after:border-transparent after:border-t-slate-600 dark:after:border-t-slate-700 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:-top-[1.5px]" />
              {content}
            </animated.div>,
            document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
          )
      )}
    </>
  )
}

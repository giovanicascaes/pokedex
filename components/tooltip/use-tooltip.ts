import { useCallback, useRef, useState } from "react"

export default function useTooltip() {
  const [enabled, setEnabled] = useState(false)
  const triggerRef = useRef<HTMLElement>(null)
  const [tooltip, tooltipRef] = useState<HTMLElement | null>(null)

  const show = useCallback(() => {
    setEnabled(true)
  }, [])

  const hide = useCallback(() => {
    setEnabled(false)
  }, [])

  const getTriggerProps = useCallback(
    () => ({
      ref: triggerRef,
      onFocus: show,
      onMouseOver: show,
      onBlur: hide,
      onMouseLeave: hide,
    }),
    [hide, show]
  )

  const getTooltipProps = useCallback(() => {
    let top = 0
    let left = 0

    if (tooltip) {
      const { width: tooltipWidth, height: tooltipHeight } =
        tooltip.getBoundingClientRect()
      const {
        x: triggerX,
        y: triggerY,
        width: triggerWidth,
        height: triggerHeight,
      } = triggerRef.current!.getBoundingClientRect()

      top =
        triggerY -
        triggerHeight -
        // Arrow height
        18
      left = triggerX - tooltipWidth / 2 + triggerWidth / 2
    }

    return {
      ref: tooltipRef,
      style: {
        top,
        left,
      },
    }
  }, [tooltip])

  return {
    enabled,
    getTriggerProps,
    getTooltipProps,
  }
}

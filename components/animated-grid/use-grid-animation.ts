import { easings, useSpring } from "@react-spring/web"
import { useIsoMorphicEffect } from "hooks"
import { useState } from "react"
import { UseGridAnimationArgs } from "./animated-grid.types"

const CONTAINER_TRANSITION_DURATION = 300

export default function useGridAnimation({
  gridWidth,
  gridContainerWidth,
  immediate = false,
  onInitialDimensions,
}: UseGridAnimationArgs) {
  const [isInitialDimensionsSet, setIsInitialDimensionsSet] = useState(false)

  const [gridStyles, gridApi] = useSpring(() => ({
    config: {
      duration: CONTAINER_TRANSITION_DURATION,
      easing: easings.linear,
    },
    from: {
      x: 0,
    },
  }))

  useIsoMorphicEffect(() => {
    if (gridContainerWidth) {
      gridApi.start({
        to: {
          x: (gridContainerWidth - gridWidth) / 2,
        },
        immediate: immediate || !isInitialDimensionsSet,
        onRest: () => {
          if (!isInitialDimensionsSet) {
            onInitialDimensions?.()
            setIsInitialDimensionsSet(true)
          }
        },
      })
    }
  }, [
    gridApi,
    gridContainerWidth,
    gridWidth,
    immediate,
    isInitialDimensionsSet,
    onInitialDimensions,
  ])

  return gridStyles
}

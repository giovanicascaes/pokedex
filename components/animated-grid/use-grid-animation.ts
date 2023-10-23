import { easings, useSpring } from "@react-spring/web"
import { useIsoMorphicEffect } from "hooks"
import { useState } from "react"
import { UseGridAnimationArgs } from "./animated-grid.types"

const CONTAINER_TRANSITION_DURATION = 300

export default function useGridAnimation({
  gridWidth,
  containerWidth,
  immediate = false,
  onInitialPositionSet,
}: UseGridAnimationArgs) {
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false)

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
    if (containerWidth) {
      gridApi.start({
        to: {
          x: (containerWidth - gridWidth) / 2,
        },
        immediate: immediate || !isInitialPositionSet,
      })

      if (!isInitialPositionSet) {
        onInitialPositionSet?.()
        setIsInitialPositionSet(true)
      }
    }
  }, [
    gridApi,
    containerWidth,
    gridWidth,
    immediate,
    isInitialPositionSet,
    onInitialPositionSet,
  ])

  return gridStyles
}

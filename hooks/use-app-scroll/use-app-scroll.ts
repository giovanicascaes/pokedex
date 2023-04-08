import { useRouter } from "next/router"
import { UIEvent, useCallback, useEffect, useReducer, useState } from "react"
import { useIsoMorphicEffect } from "../use-iso-morphic-effect"
import usePrevious from "../use-previous"
import useScrollTop from "../use-scroll-top"
import {
  UseAppScrollActions,
  UseAppScrollActionTypes,
  UseAppScrollState,
} from "./use-app-scroll.types"

const reducers: {
  [P in UseAppScrollActionTypes]: (
    state: UseAppScrollState,
    action: Extract<UseAppScrollActions, { type: P }>
  ) => UseAppScrollState
} = {
  [UseAppScrollActionTypes.DirtyScroll](state) {
    return { ...state, isScrollDirty: true }
  },
  [UseAppScrollActionTypes.SetIsScrollReady](state, action) {
    return { ...state, isScrollReady: action.ready }
  },
  [UseAppScrollActionTypes.SetIsScrollTrackEnabled](state, action) {
    return { ...state, isScrollTrackEnabled: action.enabled }
  },
}

function matchReducer(
  state: UseAppScrollState,
  action: UseAppScrollActions
): UseAppScrollState {
  const reducer = reducers as Record<
    UseAppScrollActionTypes,
    (state: UseAppScrollState, action: UseAppScrollActions) => UseAppScrollState
  >
  return reducer[action.type](state, action)
}

const INITIAL_STATE: UseAppScrollState = {
  isScrollDirty: false,
  isScrollTrackEnabled: true,
  isScrollReady: true,
}

export default function useAppScroll(
  loadingPage: string | null,
  disableScrollRestore: boolean = false
) {
  const [scrollContainer, scrollContainerRef] = useState<Element | null>(null)
  const [{ isScrollDirty, isScrollReady, isScrollTrackEnabled }, dispatch] =
    useReducer(matchReducer, INITIAL_STATE)
  const { asPath: currentPath } = useRouter()
  const prevPath = usePrevious(currentPath)
  const [scrollTop, { onScroll }] = useScrollTop(!isScrollTrackEnabled)

  const handleOnScroll = useCallback(
    (event: UIEvent) => {
      const { scrollTop: nextScrollTop } = event.currentTarget

      requestAnimationFrame(() => {
        if (!isScrollReady && nextScrollTop === scrollTop) {
          dispatch({
            type: UseAppScrollActionTypes.SetIsScrollReady,
            ready: true,
          })
        }
      })

      onScroll(event)
    },
    [onScroll, scrollTop, isScrollReady]
  )

  useEffect(() => {
    if (scrollTop > 0) {
      dispatch({
        type: UseAppScrollActionTypes.DirtyScroll,
      })
    }
  }, [scrollTop])

  useEffect(() => {
    if (prevPath && prevPath !== currentPath) {
      dispatch({
        type: UseAppScrollActionTypes.SetIsScrollReady,
        ready: false,
      })
    }
  }, [currentPath, prevPath])

  useIsoMorphicEffect(() => {
    if (disableScrollRestore || isScrollReady) {
      return
    }

    if (currentPath === "/") {
      if (loadingPage) return

      scrollContainer!.scrollTo({
        top: scrollTop,
      })
      dispatch({
        type: UseAppScrollActionTypes.SetIsScrollTrackEnabled,
        enabled: true,
      })
    } else if (!isScrollTrackEnabled) {
      scrollContainer!.scrollTo({
        top: 0,
      })
      dispatch({
        type: UseAppScrollActionTypes.SetIsScrollReady,
        ready: true,
      })
    } else {
      dispatch({
        type: UseAppScrollActionTypes.SetIsScrollTrackEnabled,
        enabled: false,
      })
    }
  }, [
    currentPath,
    disableScrollRestore,
    isScrollTrackEnabled,
    loadingPage,
    scrollTop,
  ])

  return {
    ref: scrollContainerRef,
    onScroll: handleOnScroll,
    isScrollReady,
    isScrollDirty,
  }
}

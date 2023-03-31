import throttle from "lodash.throttle"
import { UIEvent, useCallback, useState } from "react"

export default function useScrollTop(disableScrollTrack: boolean = false) {
  const [scrollTop, setScrollTop] = useState(0)
  const onScroll = useCallback(
    (event: UIEvent) => {
      if (event.currentTarget && !disableScrollTrack)
        setScrollTop(event.currentTarget.scrollTop)
    },
    [disableScrollTrack]
  )

  return [scrollTop, { onScroll: throttle(onScroll, 100) }] as const
}

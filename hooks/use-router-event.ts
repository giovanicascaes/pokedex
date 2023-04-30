import { Router, RouterEvent } from "next/router"
import { useEffect } from "react"
import useEvent from "./use-event"

export default function useRouterEvent(event: RouterEvent, cb: () => void) {
  const eventCb = useEvent(cb)

  useEffect(() => {
    const handler = () => {
      eventCb()
    }

    Router.events.on(event, handler)

    return () => {
      Router.events.off(event, handler)
    }
  }, [event, eventCb])
}

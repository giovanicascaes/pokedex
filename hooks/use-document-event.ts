import { useEffect } from "react"

export default function useDocumentEvent<T extends keyof DocumentEventMap>(
  type: T,
  listener: (ev: DocumentEventMap[T]) => any,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    function handler(event: DocumentEventMap[T]) {
      listener(event)
    }

    document.addEventListener(type, handler, options)

    return () => document.removeEventListener(type, handler, options)
  }, [type, options, listener])
}

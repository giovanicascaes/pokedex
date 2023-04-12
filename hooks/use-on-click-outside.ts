import { useDocumentEvent } from "hooks"
import { MutableRefObject, useCallback } from "react"

export default function useOnClickOutside(
  el: MutableRefObject<HTMLElement | null> | HTMLElement | null,
  cb: (
    event: MouseEvent | PointerEvent | FocusEvent,
    target: HTMLElement
  ) => void
) {
  const listener = useCallback(
    <E extends MouseEvent | PointerEvent | FocusEvent>(event: E) => {
      const node = el instanceof HTMLElement ? el : el?.current
      const target = event.target as HTMLElement

      if (!node || node.contains(target)) {
        return
      }

      cb(event, target)
    },
    [cb, el]
  )

  useDocumentEvent("blur", listener)
  useDocumentEvent("click", listener)
}

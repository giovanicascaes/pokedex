import { animated, useSpring } from "@react-spring/web"
import { useEffect, useId, useRef, useState } from "react"
import { MdDone } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { setTimeout } from "timers"
import { useSelect } from "../context"
import { SelectPopupState } from "../select.types"
import { SelectOptionProps } from "./option.types"

const CLICK_TRANSITION_DURATION = 80

export default function Option({
  children,
  value,
  disabled = false,
  className,
  ...other
}: SelectOptionProps) {
  const [
    { isSelected, popupState, clickedOption },
    { registerOption, selectOption, closePopup },
  ] = useSelect()
  const ref = useRef<HTMLLIElement | null>(null)
  const id = useId()
  const [blink, setBlink] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    registerOption({
      id,
      value,
      ref,
    })
  }, [id, registerOption, value])

  const selected =
    clickedOption !== null ? clickedOption === id : isSelected(value)

  const styles = useSpring({
    config: { duration: CLICK_TRANSITION_DURATION },
    from: {
      opacity: 1,
    },
    to: {
      opacity: blink ? 0 : 1,
    },
    onRest: () => {
      setBlink(false)
      setTimeout(closePopup, 200)
    },
  })

  return (
    <li
      {...other}
      onClick={() => {
        if (!disabled) {
          selectOption(id)
          setClicked(true)
          setBlink(true)
        }
      }}
      className={twMerge(
        "w-full pl-11 pr-3 py-2 text-start text-sm text-slate-700 dark:text-slate-300 hover:text-red-800 dark:hover:text-red-400 flex items-center select-none cursor-pointer relative",
        clicked && "text-red-800 dark:text-red-400",
        popupState !== SelectPopupState.Open && "pointer-events-none",
        selected && "font-medium",
        disabled &&
          "cursor-default text-slate-800/50 hover:bg-transparent pointer-events-none",
        className
      )}
      ref={ref}
    >
      <animated.div
        className={twMerge(
          "absolute top-0 left-0 z-0 w-full h-full hover:bg-red-500/10 dark:hover:bg-red-500/[0.15]",
          clicked && "bg-red-500/10 dark:bg-red-500/20"
        )}
        style={{
          ...(clicked && { ...styles }),
        }}
      />

      {selected && (
        <MdDone
          className={twMerge(
            "text-red-600 dark:text-red-500 absolute left-3 pointer-events-none",
            disabled && "text-slate-600 dark:text-slate-400"
          )}
          size={22}
        />
      )}
      {typeof children === "function" ? (
        children({ disabled, selected, clicked })
      ) : (
        <span className="block truncate w-full">{children}</span>
      )}
    </li>
  )
}

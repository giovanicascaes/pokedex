import { animated, useTransition } from "@react-spring/web"
import { useScrollTop } from "hooks"
import { MdClose } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { PokemonAbilityOverlayProps } from "./pokemon-ability-overlay-types"

const TRANSITION_DURATION = 150

export default function PokemonAbilityDescriptionOverlay({
  ability,
  onClose,
  className,
  ...other
}: PokemonAbilityOverlayProps) {
  const [scrollTop, { onScroll }] = useScrollTop()

  const transition = useTransition(ability, {
    config: { duration: TRANSITION_DURATION },
    from: { opacity: 0, transform: "translateY(-20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
  })

  return transition(
    (styles, data) =>
      data && (
        <animated.div
          {...other}
          className={twMerge(
            className,
            "absolute z-10 top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-slate-700/70 border-slate-600/70 dark:bg-slate-600/70 border dark:border-slate-500/40 backdrop-blur-md rounded-md [color-scheme:dark]"
          )}
          style={{ ...styles }}
        >
          <div className="text-slate-300 dark:text-slate-400 text-sm flex flex-col h-full">
            <span
              className={twMerge(
                "text-2xl text-white dark:text-slate-200 p-3 transition-shadow shadow-none shadow-slate-700/40 dark:shadow-slate-900/40",
                scrollTop > 0 && "shadow"
              )}
            >
              {data?.name}
            </span>
            <button
              onClick={onClose}
              className="absolute z-10 top-3 right-3 text-slate-300 dark:text-slate-300/90 hover:text-slate-200 dark:hover:text-white p-0.5 rounded cursor-pointer bg-slate-600 dark:bg-slate-800/80 hover:bg-slate-700 dark:hover:bg-slate-900/90 transition-colors focus"
            >
              <MdClose size={20} />
            </button>
            <span onScroll={onScroll} className="overflow-auto p-4">
              {data?.description}
            </span>
          </div>
        </animated.div>
      )
  )
}

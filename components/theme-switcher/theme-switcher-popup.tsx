import { animated, easings, useTransition } from "@react-spring/web"
import { Select } from "components"
import { ThemeMode } from "contexts"
import { twMerge } from "tailwind-merge"
import ThemeSwitcherModeIcon from "./theme-switcher-mode-icon"
import { ThemeSwitcherOptionsPopupProps } from "./theme-switcher.types"

const POPUP_TRANSITION_DURATION = 220

export default function ThemeSwitcherPopup({
  show,
}: ThemeSwitcherOptionsPopupProps) {
  const transition = useTransition(show, {
    config: {
      tension: 28,
      friction: 0,
      duration: POPUP_TRANSITION_DURATION,
      easing: easings.easeOutBack,
    },
    from: { opacity: 0, scale: "95%" },
    enter: { opacity: 1, scale: "100%" },
    leave: { opacity: 0, scale: "95%" },
  })

  return transition(
    (styles, show) =>
      show && (
        <animated.ul
          className="absolute z-10 w-40 origin-top-right bg-white dark:bg-slate-700 flex flex-col right-6 top-[calc(100%-4px)] py-2.5 rounded-xl ring-1 ring-slate-900/10 dark:ring-slate-600 shadow-lg"
          style={{
            ...styles,
          }}
        >
          {[
            [ThemeMode.Light, "Light"],
            [ThemeMode.Dark, "Dark"],
            [ThemeMode.System, "System"],
          ].map(([theme, name]) => (
            <Select.Option key={theme} value={theme} className="group">
              {({ clicked }) => (
                <span className="flex space-x-2">
                  <span
                    className={twMerge(
                      "text-slate-400 group-hover:text-red-800 dark:text-slate-400 dark:group-hover:text-red-400",
                      clicked && "text-red-800 dark:text-red-400"
                    )}
                  >
                    <ThemeSwitcherModeIcon mode={theme as ThemeMode} />
                  </span>
                  <span>{name}</span>
                </span>
              )}
            </Select.Option>
          ))}
        </animated.ul>
      )
  )
}

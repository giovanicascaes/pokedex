import { animated, easings, useTransition } from "@react-spring/web"
import { Select } from "components"
import { ThemeMode, useThemeMode } from "contexts"
import { usePrevious } from "hooks"
import { useEffect, useState } from "react"
import {
  HiOutlineComputerDesktop,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2"
import { twMerge } from "tailwind-merge"
import { match } from "utils"
import {
  ThemeSwitcherOptionsPopupProps,
  ThemeSwitcherProps,
} from "./theme-switcher.types"

const POPUP_TRANSITION_DURATION = 220

const getThemeModeIcon = (mode: ThemeMode) => {
  const Icon = match(
    {
      [ThemeMode.Dark]: HiOutlineMoon,
      [ThemeMode.Light]: HiOutlineSun,
      [ThemeMode.System]: HiOutlineComputerDesktop,
    },
    mode
  )!

  return <Icon size={20} />
}

function OptionsPopup({ show }: ThemeSwitcherOptionsPopupProps) {
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
                    {getThemeModeIcon(theme as ThemeMode)}
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

export default function ThemeSwitcher({
  buttonClassName,
  ...other
}: ThemeSwitcherProps) {
  const [animate, setAnimate] = useState(false)
  const [{ themeMode }, { setThemeMode }] = useThemeMode()
  const prevThemeMode = usePrevious(themeMode)

  const transitions = useTransition(themeMode, {
    from: { opacity: 0, x: "-50%" },
    enter: { opacity: 1, x: "0%" },
    leave: { opacity: 0, x: "100%" },
    config: { duration: 150, easing: easings.linear },
    exitBeforeEnter: true,
  })

  useEffect(() => {
    // Should only animate when theme mode has changed
    if (prevThemeMode && prevThemeMode !== themeMode) {
      setAnimate(true)
    }
  }, [prevThemeMode, themeMode])

  return (
    <Select
      {...other}
      value={themeMode}
      onChange={setThemeMode}
      className="w-min"
    >
      <Select.Button variant="unstyled" className={buttonClassName}>
        {transitions((styles, theme) => (
          <animated.div style={{ ...(animate && styles) }}>
            {getThemeModeIcon(theme)}
          </animated.div>
        ))}
      </Select.Button>
      <Select.Options>
        {({ open }) => <OptionsPopup show={open} />}
      </Select.Options>
    </Select>
  )
}

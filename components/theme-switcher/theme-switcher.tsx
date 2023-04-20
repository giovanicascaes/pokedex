import { animated, easings, useTransition } from "@react-spring/web"
import { Select } from "components"
import { ThemeMode, useThemeMode } from "contexts"
import ThemeSwitcherModeIcon from "./theme-switcher-mode-icon"
import ThemeSwitcherPopup from "./theme-switcher-popup"
import { ThemeSwitcherProps } from "./theme-switcher.types"

export default function ThemeSwitcher({
  buttonClassName,
  ...other
}: ThemeSwitcherProps) {
  const [{ themeMode, isDark }, { setThemeMode }] = useThemeMode()

  const transitions = useTransition(isDark, {
    from: { opacity: 0, x: "-50%" },
    enter: { opacity: 1, x: "0%" },
    leave: { opacity: 0, x: "100%" },
    config: { duration: 150, easing: easings.linear },
    exitBeforeEnter: true,
    initial: null,
  })

  return (
    <Select
      {...other}
      value={themeMode}
      onChange={setThemeMode}
      className="w-min"
    >
      <Select.Button variant="unstyled" className={buttonClassName}>
        {transitions((styles, dark) => (
          <animated.div style={{ ...styles }}>
            <ThemeSwitcherModeIcon
              mode={dark ? ThemeMode.Dark : ThemeMode.Light}
            />
          </animated.div>
        ))}
      </Select.Button>
      <Select.Options>
        {({ open }) => <ThemeSwitcherPopup show={open} />}
      </Select.Options>
    </Select>
  )
}

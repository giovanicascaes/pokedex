import { ThemeMode } from "contexts"
import {
  HiOutlineComputerDesktop,
  HiOutlineMoon,
  HiOutlineSun,
} from "react-icons/hi2"
import { match } from "utils"
import { ThemeSwitcherModeIconProps } from "./theme-switcher.types"

export default function ThemeSwitcherModeIcon({
  mode,
}: ThemeSwitcherModeIconProps) {
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

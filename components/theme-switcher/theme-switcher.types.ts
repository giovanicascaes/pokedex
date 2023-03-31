import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface ThemeSwitcherProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  buttonClassName?: HTMLAttributes<HTMLDivElement>["className"]
}

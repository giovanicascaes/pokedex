import { Ability } from "lib"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface AbilityOverlayProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  ability?: Ability
  onClose: () => void
}

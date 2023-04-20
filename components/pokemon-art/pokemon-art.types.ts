import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonArtProps
  extends WithNonLegacyRef<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    HTMLDivElement
  > {
  artSrc: string | null
  name?: string
  width?: number
  height?: number
  fill?: boolean
  animate?: boolean
  artClassName?: string
}

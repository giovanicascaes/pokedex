import { PokemonArtProps } from "components"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export interface PokemonCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number
  resourceName: string
  name: string
  animateArt?: boolean
  isOnPokedex?: boolean
  onCatchReleaseFinish?: () => void
}

import { PokemonArtProps } from "components"
import { DetailedHTMLProps, HTMLAttributes } from "react"

export interface PokemonListItemProps
  extends DetailedHTMLProps<
      HTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    Pick<PokemonArtProps, "artSrc"> {
  identifier: number
  resourceName: string
  name: string
  animateArt?: boolean
  isOnPokedex?: boolean
  onCatchReleaseFinish?: () => void
}

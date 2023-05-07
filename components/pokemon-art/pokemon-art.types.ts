import { ImageProps } from "next/image"
import { DetailedHTMLProps, HTMLAttributes } from "react"
import { WithNonLegacyRef } from "types"

export interface PokemonArtProps
  extends WithNonLegacyRef<
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      HTMLDivElement
    >,
    Pick<ImageProps, "fill" | "sizes"> {
  artSrc: string | null
  name?: string
  width?: number
  height?: number
  animate?: boolean
  artClassName?: string
}

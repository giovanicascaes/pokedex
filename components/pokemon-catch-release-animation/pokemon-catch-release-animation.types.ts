import { DetailedHTMLProps, HTMLAttributes, ReactElement } from "react"

export interface PokemonCatchReleaseAnimationProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    "children" | "ref"
  > {
  isCaught?: boolean
  onAnimationFinished?: () => void
  children: ReactElement
}

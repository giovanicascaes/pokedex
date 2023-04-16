import { animated } from "@react-spring/web"
import Pokeball from "assets/img/pokeball.png"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import Image from "next/image"
import { useState } from "react"
import ReactDOM from "react-dom"
import { POKEBALL_SIZE_AT_CENTER } from "../constants"
import { PokemonCatchReleaseAnimationStateProps } from "../pokemon-catch-release-animation.types"
import { PokemonReleaseAnimationPhase } from "./pokemon-release-animation.types"
import useReleaseStyles from "./use-release-styles"

export default function PokemonReleaseAnimation({
  onAnimationFinish,
  pokemonRect,
  children,
  style,
  ...other
}: PokemonCatchReleaseAnimationStateProps) {
  const [backgroundEl, backgroundRef] = useState<HTMLDivElement | null>(null)

  const { backgroundColor, currentAnimationPhase, ...styles } =
    useReleaseStyles(
      pokemonRect,
      backgroundEl?.getBoundingClientRect(),
      onAnimationFinish
    )

  return ReactDOM.createPortal(
    <animated.div
      {...other}
      style={{ ...style, backgroundColor }}
      ref={backgroundRef}
    >
      <animated.div className="absolute origin-center" style={{ ...styles }}>
        {currentAnimationPhase === PokemonReleaseAnimationPhase.Fleeing ? (
          children
        ) : (
          <Image
            src={Pokeball}
            alt="Pokéball"
            width={POKEBALL_SIZE_AT_CENTER}
            height={POKEBALL_SIZE_AT_CENTER}
          />
        )}
      </animated.div>
    </animated.div>,
    document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
  )
}

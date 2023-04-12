import { animated } from "@react-spring/web"
import Pokeball from "assets/img/pokeball.png"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import Image from "next/image"
import { useState } from "react"
import ReactDOM from "react-dom"
import { POKEBALL_SIZE_AT_CENTER } from "../constants"
import {
  PokemonCatchAnimationPhase,
  PokemonCatchAnimationProps,
} from "./pokemon-catch-animation.types"
import useCatchStyles from "./use-catch-styles"

export default function PokemonCatchAnimation({
  onAnimationFinish,
  pokemonRect,
  children,
  style,
  ...other
}: PokemonCatchAnimationProps) {
  const [backgroundEl, backgroundRef] = useState<HTMLDivElement | null>(null)

  const { backgroundColor, currentAnimationPhase, ...styles } = useCatchStyles(
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
        {currentAnimationPhase ===
        PokemonCatchAnimationPhase.MovingToPokedex ? (
          <Image
            src={Pokeball}
            alt="Pokéball"
            width={POKEBALL_SIZE_AT_CENTER}
            height={POKEBALL_SIZE_AT_CENTER}
          />
        ) : (
          children
        )}
      </animated.div>
    </animated.div>,
    document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
  )
}

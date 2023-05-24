import { animated } from "@react-spring/web"
import Pokeball from "assets/img/pokeball.png"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import Image from "next/image"
import { useState } from "react"
import { createPortal } from "react-dom"
import { POKEBALL_SIZE_AT_CENTER } from "../constants"
import { PokemonCatchReleaseAnimationStateProps } from "../pokemon-catch-release-animation.types"
import { PokemonReleaseAnimationStep } from "./pokemon-release-animation.types"
import useReleaseStyles from "./use-release-styles"

export default function PokemonReleaseAnimation({
  onAnimationFinish,
  animatingElementRect,
  children,
  style,
  ...other
}: PokemonCatchReleaseAnimationStateProps) {
  const [backgroundEl, backgroundRef] = useState<HTMLDivElement | null>(null)

  const { backgroundColor, currentAnimationStep, ...styles } = useReleaseStyles(
    animatingElementRect,
    backgroundEl?.getBoundingClientRect(),
    onAnimationFinish
  )

  return createPortal(
    <animated.div
      {...other}
      style={{ ...style, backgroundColor }}
      ref={backgroundRef}
    >
      <animated.div className="absolute origin-center" style={{ ...styles }}>
        {currentAnimationStep === PokemonReleaseAnimationStep.Fleeing ? (
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

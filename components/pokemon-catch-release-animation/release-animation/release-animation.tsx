import { animated } from "@react-spring/web"
import Pokeball from "assets/img/pokeball.png"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import Image from "next/image"
import { useState } from "react"
import ReactDOM from "react-dom"
import { POKEBALL_SIZE_AT_CENTER } from "../contants"
import {
  ReleaseAnimationPhase,
  ReleaseAnimationProps,
} from "./release-animation.types"
import useReleaseStyles from "./use-release-styles"

export default function ReleaseAnimation({
  onAnimationFinished,
  pokemonRect,
  children,
  style,
  ...other
}: ReleaseAnimationProps) {
  const [backgroundEl, backgroundRef] = useState<HTMLDivElement | null>(null)

  const { backgroundColor, currentAnimationPhase, ...styles } =
    useReleaseStyles(
      pokemonRect,
      backgroundEl?.getBoundingClientRect(),
      onAnimationFinished
    )

  return ReactDOM.createPortal(
    <animated.div
      {...other}
      style={{ ...style, backgroundColor }}
      ref={backgroundRef}
    >
      <animated.div className="absolute origin-center" style={{ ...styles }}>
        {currentAnimationPhase === ReleaseAnimationPhase.Fleeing ? (
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

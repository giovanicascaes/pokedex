import { easings, to, useSpring } from "@react-spring/web"
import { useMemo, useState } from "react"
import {
  POKEBALL_SCALE,
  POKEBALL_SIZE_AT_CENTER,
  POKEMON_SIZE_AT_CENTER,
} from "../contants"
import { ReleaseAnimationPhase } from "./release-animation.types"

const MOVE_POKEBALL_TO_CENTER_ANIMATION_DURATION = 500

const RELEASE_POKEMON_ANIMATION_DURATION = 250

const POKEMON_FLEE_ANIMATION_DURATION = 700

export default function useReleaseStyles(
  pokemonRect: DOMRect,
  backgroundRect?: DOMRect,
  onAnimationFinished?: () => void
) {
  const { left, top, width, height } = pokemonRect

  const [currentAnimationPhase, setCurrentAnimationPhase] = useState(
    ReleaseAnimationPhase.MovingToCenter
  )

  const moveToCenterSpring = useSpring({
    config: {
      tension: 300,
      friction: 10,
      easing: easings.easeInOutExpo,
      duration: MOVE_POKEBALL_TO_CENTER_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: 1,
    },
    onRest: () => {
      setCurrentAnimationPhase(ReleaseAnimationPhase.Releasing)
    },
  })
  const releaseSpring = useSpring({
    config: {
      duration: RELEASE_POKEMON_ANIMATION_DURATION,
      tension: 300,
      friction: 10,
    },
    from: {
      x: 0,
    },
    to: {
      x: currentAnimationPhase === ReleaseAnimationPhase.Releasing ? 1 : 0,
    },
    onRest: () => {
      setCurrentAnimationPhase(ReleaseAnimationPhase.Fleeing)
    },
  })
  const fleeingSpring = useSpring({
    config: {
      duration: POKEMON_FLEE_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: currentAnimationPhase === ReleaseAnimationPhase.Fleeing ? 1 : 0,
    },
    delay: 100,
    onRest: () => {
      onAnimationFinished?.()
    },
  })

  const {
    pokeballStartLeft,
    pokeballStartTop,
    pokeballStartScale,
    pokeballEndLeft,
    pokeballEndTop,
    pokemonLeft,
    pokemonTop,
    pokemonEndScale,
  } = useMemo(() => {
    const pokeballStartSize = width * POKEBALL_SCALE
    const positions = {
      pokeballStartLeft: left + (width - POKEBALL_SIZE_AT_CENTER) / 2,
      pokeballStartTop: top + (height - POKEBALL_SIZE_AT_CENTER) / 2,
      pokeballStartScale: pokeballStartSize / POKEBALL_SIZE_AT_CENTER,
      pokeballEndLeft: 0,
      pokeballEndTop: 0,
      pokemonLeft: 0,
      pokemonTop: 0,
      pokemonEndScale: POKEMON_SIZE_AT_CENTER / width,
    }

    if (backgroundRect) {
      const { width: backgroundWidth, height: backgroundHeight } =
        backgroundRect

      positions.pokeballEndLeft =
        backgroundWidth / 2 - POKEBALL_SIZE_AT_CENTER / 2
      positions.pokeballEndTop =
        backgroundHeight / 2 - POKEBALL_SIZE_AT_CENTER / 2
      positions.pokemonLeft = backgroundWidth / 2 - width / 2
      positions.pokemonTop = backgroundHeight / 2 - height / 2
    }

    return positions
  }, [backgroundRect, height, left, top, width])

  const styles = useMemo(() => {
    switch (currentAnimationPhase) {
      case ReleaseAnimationPhase.MovingToCenter: {
        return {
          backgroundColor: undefined,
          opacity: moveToCenterSpring.x,
          scale: moveToCenterSpring.x.to([0, 1], [pokeballStartScale, 1]),
          x: moveToCenterSpring.x.to(
            [0, 1],
            [pokeballStartLeft, pokeballEndLeft]
          ),
          y: moveToCenterSpring.x.to(
            [0, 1],
            [pokeballStartTop, pokeballEndTop]
          ),
        }
      }
      case ReleaseAnimationPhase.Releasing: {
        return {
          backgroundColor: releaseSpring.x
            .to([0, 1], [0, 1])
            .to((value) => `rgba(255,255,255,${value})`),
          opacity: 1,
          scale: 1,
          filter: to(
            [
              releaseSpring.x.to([0, 1], [1, 0]),
              releaseSpring.x.to([0, 1], [0, 1]),
            ],
            (brightness, invert) =>
              `brightness(${brightness}) invert(${invert})`
          ),
          x: pokeballEndLeft,
          y: pokeballEndTop,
        }
      }
      default: {
        return {
          backgroundColor: fleeingSpring.x
            .to([0, 0.14, 1], [1, 0, 0])
            .to((value) => `rgba(255,255,255,${value})`),
          opacity: fleeingSpring.x.to([0, 0.8, 1], [1, 1, 0]),
          filter: to(
            [
              fleeingSpring.x.to([0, 0.14, 1], [0, 1, 1]),
              fleeingSpring.x.to([0, 0.14, 1], [1, 0, 0]),
            ],
            (brightness, invert) =>
              `brightness(${brightness}) invert(${invert})`
          ),
          scale: pokemonEndScale,
          left: pokemonLeft,
          top: pokemonTop,
        }
      }
    }
  }, [
    currentAnimationPhase,
    fleeingSpring.x,
    moveToCenterSpring.x,
    pokeballEndLeft,
    pokeballEndTop,
    pokeballStartLeft,
    pokeballStartScale,
    pokeballStartTop,
    pokemonEndScale,
    pokemonLeft,
    pokemonTop,
    releaseSpring.x,
  ])

  return {
    ...styles,
    currentAnimationPhase,
  }
}

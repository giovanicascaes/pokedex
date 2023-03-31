import { easings, to, useSpring } from "@react-spring/web"
import { POKEDEX_LINK_ELEMENT_ID } from "lib"
import { useMemo, useState } from "react"
import { POKEBALL_SIZE_AT_CENTER, POKEMON_SIZE_AT_CENTER } from "../contants"
import { CatchAnimationPhase } from "./catch-animation.types"

const MOVE_POKEMON_TO_CENTER_ANIMATION_DURATION = 500

const CATCH_POKEMON_ANIMATION_DURATION = 250

const MOVE_POKEBALL_TO_POKEDEX_ANIMATION_DURATION = 1200

export default function useCatchStyles(
  pokemonRect: DOMRect,
  backgroundRect?: DOMRect,
  onAnimationFinished?: () => void
) {
  const { left, top, width, height } = pokemonRect

  const [currentAnimationPhase, setCurrentAnimationPhase] = useState(
    CatchAnimationPhase.MovingToCenter
  )

  const {
    left: pokedexLeft,
    top: pokedexTop,
    width: pokedexWidth,
    height: pokedexHeight,
  } = document.getElementById(POKEDEX_LINK_ELEMENT_ID)!.getBoundingClientRect()

  const moveToCenterSpring = useSpring({
    config: {
      tension: 300,
      friction: 10,
      easing: easings.easeInOutExpo,
      duration: MOVE_POKEMON_TO_CENTER_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: 1,
    },
    onRest: () => {
      setCurrentAnimationPhase(CatchAnimationPhase.Catching)
    },
  })
  const catchSpring = useSpring({
    config: {
      duration: CATCH_POKEMON_ANIMATION_DURATION,
      tension: 300,
      friction: 10,
    },
    from: {
      x: 0,
    },
    to: {
      x: currentAnimationPhase === CatchAnimationPhase.Catching ? 1 : 0,
    },
    onRest: () => {
      setCurrentAnimationPhase(CatchAnimationPhase.MovingToPokedex)
    },
  })
  const moveToPokedexSpring = useSpring({
    config: {
      duration: MOVE_POKEBALL_TO_POKEDEX_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: currentAnimationPhase === CatchAnimationPhase.MovingToPokedex ? 1 : 0,
    },
    delay: 100,
    onRest: () => {
      onAnimationFinished?.()
    },
  })

  const {
    pokemonStartLeft,
    pokemonStartTop,
    pokemonEndLeft,
    pokemonEndTop,
    pokeballStartLeft,
    pokeballStartTop,
    pokeballEndLeft,
    pokeballEndTop,
    pokemonEndScale,
  } = useMemo(() => {
    const pokemonEndScale = POKEMON_SIZE_AT_CENTER / width
    const positions = {
      pokemonStartLeft: left,
      pokemonStartTop: top,
      pokemonEndLeft: 0,
      pokemonEndTop: 0,
      pokeballStartLeft: 0,
      pokeballStartTop: 0,
      pokeballEndLeft:
        pokedexLeft - POKEBALL_SIZE_AT_CENTER / 2 + pokedexWidth / 2,
      pokeballEndTop:
        pokedexTop - POKEBALL_SIZE_AT_CENTER / 2 + pokedexHeight / 2,
      pokemonEndScale,
    }

    if (backgroundRect) {
      const { width: backgroundWidth, height: backgroundHeight } =
        backgroundRect

      positions.pokemonEndLeft = backgroundWidth / 2 - width / 2
      positions.pokemonEndTop = backgroundHeight / 2 - height / 2
      positions.pokeballStartLeft =
        backgroundWidth / 2 - POKEBALL_SIZE_AT_CENTER / 2
      positions.pokeballStartTop =
        backgroundHeight / 2 - POKEBALL_SIZE_AT_CENTER / 2
    }

    return positions
  }, [
    backgroundRect,
    height,
    left,
    pokedexHeight,
    pokedexLeft,
    pokedexTop,
    pokedexWidth,
    top,
    width,
  ])

  const styles = useMemo(() => {
    switch (currentAnimationPhase) {
      case CatchAnimationPhase.MovingToCenter: {
        return {
          backgroundColor: undefined,
          opacity: moveToCenterSpring.x,
          scale: moveToCenterSpring.x.to([0, 1], [1, pokemonEndScale]),
          x: moveToCenterSpring.x.to(
            [0, 1],
            [pokemonStartLeft, pokemonEndLeft]
          ),
          y: moveToCenterSpring.x.to([0, 1], [pokemonStartTop, pokemonEndTop]),
        }
      }
      case CatchAnimationPhase.Catching: {
        return {
          backgroundColor: catchSpring.x
            .to([0, 1], [0, 1])
            .to((value) => `rgba(255,255,255,${value})`),
          scale: pokemonEndScale,
          filter: to(
            [
              catchSpring.x.to([0, 1], [1, 0]),
              catchSpring.x.to([0, 1], [0, 1]),
            ],
            (brightness, invert) =>
              `brightness(${brightness}) invert(${invert})`
          ),
          x: pokemonEndLeft,
          y: pokemonEndTop,
        }
      }
      default: {
        return {
          backgroundColor: moveToPokedexSpring.x
            .to([0, 0.084, 1], [1, 0, 0])
            .to((value) => `rgba(255,255,255,${value})`),
          filter: to(
            [
              moveToPokedexSpring.x.to([0, 0.084, 1], [0, 1, 1]),
              moveToPokedexSpring.x.to([0, 0.084, 1], [1, 0, 0]),
            ],
            (brightness, invert) =>
              `brightness(${brightness}) invert(${invert})`
          ),
          scale: moveToPokedexSpring.x.to(
            [0, 0.3, 0.5, 0.8, 1],
            [1, 1, 0.2, 0, 0]
          ),
          transform: moveToPokedexSpring.x
            .to([0, 0.3, 0.5, 0.8, 1], [0, 0, 400, 0, 0])
            .to((value) => `translateY(${value}px)`),
          left: moveToPokedexSpring.x.to(
            [0, 0.3, 0.8, 1],
            [
              pokeballStartLeft,
              pokeballStartLeft,
              pokeballEndLeft,
              pokeballEndLeft,
            ]
          ),
          top: moveToPokedexSpring.x.to(
            [0, 0.3, 0.8, 1],
            [pokeballStartTop, pokeballStartTop, pokeballEndTop, pokeballEndTop]
          ),
        }
      }
    }
  }, [
    catchSpring.x,
    currentAnimationPhase,
    moveToCenterSpring.x,
    moveToPokedexSpring.x,
    pokeballEndLeft,
    pokeballEndTop,
    pokeballStartLeft,
    pokeballStartTop,
    pokemonEndLeft,
    pokemonEndScale,
    pokemonEndTop,
    pokemonStartLeft,
    pokemonStartTop,
  ])

  return {
    ...styles,
    currentAnimationPhase,
  }
}

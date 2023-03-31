import { animated, to, useSpring } from "@react-spring/web"
import Pokeball from "assets/img/pokeball.png"
import { POKEDEX_LINK_ELEMENT_ID, SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib"
import Image from "next/image"
import { useMemo, useState } from "react"
import ReactDOM from "react-dom"
import { PokemonArt } from "../pokemon-art"
import { PokemonCatchAnimationProps } from "./pokemon-action-animation.types"

const CATCH_ANIMATION_DURATION = 100

const MOVE_ANIMATION_DURATION = 1200

export default function PokemonCatchAnimation({
  artPosition: { left, top, width, height },
  pokemonRef,
  artSrc,
  onFinish,
  size,
}: PokemonCatchAnimationProps) {
  const [isCaught, setIsCaught] = useState(false)

  const {
    left: pokedexLeft,
    top: pokedexTop,
    width: pokedexWidth,
    height: pokedexHeight,
  } = document.getElementById(POKEDEX_LINK_ELEMENT_ID)!.getBoundingClientRect()

  const catchStyles = useSpring({
    config: {
      duration: CATCH_ANIMATION_DURATION,
    },
    from: {
      backgroundColor: "rgba(255,255,255,0)",
      filter: "brightness(1) invert(0)",
    },
    to: {
      backgroundColor: "rgba(255,255,255,1)",
      filter: "brightness(0) invert(1)",
    },
    onRest: () => {
      setIsCaught(true)
    },
  })
  const moveStyles = useSpring({
    config: {
      duration: MOVE_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: isCaught ? 1 : 0,
    },
    delay: 100,
    onRest: () => {
      onFinish?.()
    },
  })

  const pokeballStartLeft = useMemo(
    () => left + (width - size) / 2,
    [left, size, width]
  )
  const pokeballEndLeft = useMemo(
    () => pokedexLeft - size / 2 + pokedexWidth / 2,
    [pokedexLeft, pokedexWidth, size]
  )
  const pokeballStartTop = useMemo(
    () => top + (height - size) / 2,
    [height, size, top]
  )
  const pokeballEndTop = useMemo(
    () => pokedexTop - size / 2 + pokedexHeight / 2,
    [pokedexHeight, pokedexTop, size]
  )

  const { backgroundColor, ...styles } = useMemo(
    () =>
      isCaught
        ? {
            backgroundColor: moveStyles.x
              .to([0, 0.084, 1], [1, 0, 0])
              .to((value) => `rgba(255,255,255,${value})`),
            filter: to(
              [
                moveStyles.x.to([0, 0.084, 1], [0, 1, 1]),
                moveStyles.x.to([0, 0.084, 1], [1, 0, 0]),
              ],
              (brightness, invert) =>
                `brightness(${brightness}) invert(${invert})`
            ),
            scale: moveStyles.x.to([0, 0.3, 0.5, 0.8, 1], [1, 1, 0.2, 0, 0]),
            transform: moveStyles.x
              .to([0, 0.3, 0.5, 0.8, 1], [0, 0, 400, 0, 0])
              .to((value) => `translateY(${value}px)`),
            left: moveStyles.x.to(
              [0, 0.3, 0.8, 1],
              [
                pokeballStartLeft,
                pokeballStartLeft,
                pokeballEndLeft,
                pokeballEndLeft,
              ]
            ),
            top: moveStyles.x.to(
              [0, 0.3, 0.8, 1],
              [
                pokeballStartTop,
                pokeballStartTop,
                pokeballEndTop,
                pokeballEndTop,
              ]
            ),
          }
        : {
            ...catchStyles,
            x: left,
            y: top,
          },
    [
      pokeballEndLeft,
      pokeballStartLeft,
      pokeballEndTop,
      pokeballStartTop,
      catchStyles,
      isCaught,
      left,
      moveStyles.x,
      top,
    ]
  )

  return (
    <>
      {ReactDOM.createPortal(
        <animated.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
          style={{ backgroundColor }}
        />,
        pokemonRef.current!
      )}
      {ReactDOM.createPortal(
        <animated.div
          className="absolute top-0 left-0 origin-center z-50"
          style={{ ...styles }}
        >
          {isCaught ? (
            <Image src={Pokeball} alt="Pokéball" width={size} height={size} />
          ) : (
            <PokemonArt
              artSrc={artSrc}
              width={width}
              height={height}
              animate={false}
            />
          )}
        </animated.div>,
        document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
      )}
    </>
  )
}

import { animated, to, useSpring } from "@react-spring/web";
import Pokeball from "assets/img/pokeball.png";
import {
  POKEDEX_LINK_ELEMENT_ID,
  SHELL_LAYOUT_CONTAINER_ELEMENT_ID,
} from "lib";
import Image from "next/image";
import { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { range } from "utils";
import { PokemonArt } from "../pokemon-art";
import { PokemonCatchAnimationProps } from "./pokemon-catch-animation.types";

const CATCHING_POKEMON_SIZE = 220;

const POKEBALL_SIZE = 110;

const CATCH_ANIMATION_DURATION = 400;

const MOVE_ANIMATION_DURATION = 1300;

export default function PokemonCatchAnimation({
  pokemonArtPosition: { left, top, width, height },
  artSrc,
  onAddedToPokedex,
}: PokemonCatchAnimationProps) {
  const [isCaught, setIsCatchd] = useState(false);

  const {
    left: pokedexLeft,
    top: pokedexTop,
    width: pokedexWidth,
    height: pokedexHeight,
  } = document.getElementById(POKEDEX_LINK_ELEMENT_ID)!.getBoundingClientRect();

  const catchStyles = useSpring({
    config: {
      duration: CATCH_ANIMATION_DURATION,
    },
    from: {
      x: 0,
    },
    to: {
      x: 1,
    },
    onRest: () => {
      setIsCatchd(true);
    },
  });
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
      onAddedToPokedex?.();
    },
  });

  const animationLeftStart = useMemo(
    () => left + (width - POKEBALL_SIZE) / 2,
    [left, width]
  );
  const animationLeftEnd = useMemo(
    () => pokedexLeft - POKEBALL_SIZE / 2 + pokedexWidth / 2,
    [pokedexLeft, pokedexWidth]
  );
  const animationTopStart = useMemo(
    () => top + (height - POKEBALL_SIZE) / 2,
    [height, top]
  );
  const animationTopEnd = useMemo(
    () => pokedexTop - POKEBALL_SIZE / 2 + pokedexHeight / 2,
    [pokedexHeight, pokedexTop]
  );

  const { backgroundColor, ...styles } = useMemo(
    () =>
      isCaught
        ? {
            backgroundColor: moveStyles.x.to(
              [0, 0.15, 1],
              [
                "rgba(255,255,255,1)",
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0)",
              ]
            ),
            filter: moveStyles.x.to(
              [0, 0.15, 1],
              [
                "brightness(0) invert(1)",
                "brightness(1) invert(0)",
                "brightness(1) invert(0)",
              ]
            ),
            left: moveStyles.x.to(
              [0, 0.3, 0.8, 1],
              [
                animationLeftStart,
                animationLeftStart,
                animationLeftEnd,
                animationLeftEnd,
              ]
            ),
            top: moveStyles.x.to(
              [0, 0.3, 0.8, 1],
              [
                animationTopStart,
                animationTopStart,
                animationTopEnd,
                animationTopEnd,
              ]
            ),
            transform: to(
              [
                moveStyles.x.to([0, 0.3, 0.5, 0.8, 1], [1.2, 1.2, 0.2, 0, 0]),
                moveStyles.x.to([0, 0.3, 0.5, 0.8, 1], [0, 0, 400, 0, 0]),
              ],
              (scale, y) => `scale(${scale}) translateY(${y}px)`
            ),
          }
        : {
            backgroundColor: catchStyles.x.to(
              [0, 1],
              ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]
            ),
            filter: catchStyles.x.to(
              [0, 1],
              ["brightness(1) invert(0)", "brightness(0) invert(1)"]
            ),
            scale: catchStyles.x.to([0, 1], [1, 1.2]),
            x: catchStyles.x.to(
              range(0, 10).map((i) => i * 0.1),
              range(0, 10)
                .map((i) => ++i)
                .map((i) => left + (i % 2 !== 0 ? (i + 1) * -1 : i))
            ),
            y: catchStyles.x.to(
              range(0, 10).map((i) => i * 0.1),
              range(0, 10)
                .map((i) => (i % 2 !== 0 ? i + 1 : i))
                .map((i) => top + ((i / 2) % 2 !== 0 ? i * -1 : i))
            ),
          },
    [
      animationLeftEnd,
      animationLeftStart,
      animationTopEnd,
      animationTopStart,
      catchStyles.x,
      isCaught,
      left,
      moveStyles.x,
      top,
    ]
  );

  return ReactDOM.createPortal(
    <>
      <animated.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
        style={{ backgroundColor }}
      />
      <animated.div
        className="absolute top-0 left-0 origin-[center] z-50"
        style={{ ...styles }}
      >
        {isCaught ? (
          <Image src={Pokeball} alt="Pokéball" height={POKEBALL_SIZE} />
        ) : (
          <PokemonArt
            artSrc={artSrc}
            width={CATCHING_POKEMON_SIZE}
            height={CATCHING_POKEMON_SIZE}
            animate={false}
          />
        )}
      </animated.div>
    </>,
    document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
  );
}

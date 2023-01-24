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
import { POKEBALL_SIZE } from "./constants";
import { PokemonCatchAnimationProps } from "./pokemon-change-animation.types";

const CATCH_ANIMATION_DURATION = 300;

const MOVE_ANIMATION_DURATION = 1300;

export default function PokemonCatchAnimation({
  artPosition: { left, top, width, height },
  artSrc,
  onFinish,
}: PokemonCatchAnimationProps) {
  const [isCaught, setIsCaught] = useState(false);

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
      backgroundColor: "rgba(255,255,255,0)",
      filter: "brightness(1) invert(0)",
      scale: 1,
      x: 0,
    },
    to: {
      backgroundColor: "rgba(255,255,255,1)",
      filter: "brightness(0) invert(1)",
      scale: 1.3,
      x: 1,
    },
    onRest: () => {
      setIsCaught(true);
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
      onFinish?.();
    },
  });

  const pokeballStartLeft = useMemo(
    () => left + (width - POKEBALL_SIZE) / 2,
    [left, width]
  );
  const pokeballEndLeft = useMemo(
    () => pokedexLeft - POKEBALL_SIZE / 2 + pokedexWidth / 2,
    [pokedexLeft, pokedexWidth]
  );
  const pokeballStartTop = useMemo(
    () => top + (height - POKEBALL_SIZE) / 2,
    [height, top]
  );
  const pokeballEndTop = useMemo(
    () => pokedexTop - POKEBALL_SIZE / 2 + pokedexHeight / 2,
    [pokedexHeight, pokedexTop]
  );

  const { backgroundColor, ...styles } = useMemo(
    () =>
      isCaught
        ? {
            backgroundColor: moveStyles.x
              .to([0, 0.15, 1], [1, 0, 0])
              .to((value) => `rgba(255,255,255,${value})`),
            filter: to(
              [
                moveStyles.x.to([0, 0.15, 1], [0, 1, 1]),
                moveStyles.x.to([0, 0.15, 1], [1, 0, 0]),
              ],
              (brightness, invert) =>
                `brightness(${brightness}) invert(${invert})`
            ),
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
            transform: to(
              [
                moveStyles.x.to([0, 0.3, 0.5, 0.8, 1], [1.2, 1.2, 0.2, 0, 0]),
                moveStyles.x.to([0, 0.3, 0.5, 0.8, 1], [0, 0, 400, 0, 0]),
              ],
              (scale, y) => `scale(${scale}) translateY(${y}px)`
            ),
          }
        : {
            ...catchStyles,
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
  );

  return ReactDOM.createPortal(
    <>
      <animated.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
        style={{ backgroundColor }}
      />
      <animated.div
        className="absolute top-0 left-0 origin-center z-50"
        style={{ ...styles }}
      >
        {isCaught ? (
          <Image src={Pokeball} alt="Pokéball" height={POKEBALL_SIZE} />
        ) : (
          <PokemonArt
            artSrc={artSrc}
            width={width}
            height={height}
            animate={false}
          />
        )}
      </animated.div>
    </>,
    document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
  );
}

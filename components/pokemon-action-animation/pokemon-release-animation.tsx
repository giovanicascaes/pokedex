import { animated, to, useSpring } from "@react-spring/web";
import Pokeball from "assets/img/pokeball.png";
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID } from "lib";
import Image from "next/image";
import { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { PokemonArt } from "../pokemon-art";
import { POKEBALL_SIZE } from "./constants";
import { PokemonReleaseAnimationProps } from "./pokemon-action-animation.types";

const POKEBALL_ANIMATION_DURATION = 400;

const RELEASE_ANIMATION_DURATION = 480;

export default function PokemonReleaseAnimation({
  artPosition: { left, top, width, height },
  artSrc,
  onFinish,
}: PokemonReleaseAnimationProps) {
  const [isReleased, setIsReleased] = useState(false);

  const pokeballStyles = useSpring({
    from: {
      x: 0,
    },
    to: {
      x: 1,
    },
    config: {
      duration: POKEBALL_ANIMATION_DURATION,
    },
    onRest: () => {
      setIsReleased(true);
    },
  });
  const releaseStyles = useSpring({
    from: {
      x: 0,
    },
    to: {
      x: isReleased ? 1 : 0,
    },
    config: {
      duration: RELEASE_ANIMATION_DURATION,
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
  const pokeballStartTop = useMemo(
    () => top + (height - POKEBALL_SIZE) / 2,
    [height, top]
  );

  const { backgroundColor, ...styles } = useMemo(
    () =>
      isReleased
        ? {
            left,
            top,
            filter: to(
              [
                releaseStyles.x.to([0, 0.21, 1], [0, 1, 1]),
                releaseStyles.x.to([0, 0.21, 1], [1, 0, 0]),
              ],
              (brightness, invert) =>
                `brightness(${brightness}) invert(${invert})`
            ),
            backgroundColor: releaseStyles.x
              .to([0, 0.21, 1], [1, 0, 0])
              .to((value) => `rgba(255,255,255,${value})`),
            scale: releaseStyles.x.to([0, 0.75, 1], [1, 1, 0]),
          }
        : {
            left: pokeballStartLeft,
            top: pokeballStartTop,
            scale: pokeballStyles.x.to([0, 0.2, 1], [0, 1, 1]),
            filter: to(
              [
                pokeballStyles.x.to([0, 0.75, 1], [1, 1, 0]),
                pokeballStyles.x.to([0, 0.75, 1], [0, 0, 1]),
              ],
              (brightness, invert) =>
                `brightness(${brightness}) invert(${invert})`
            ),
            backgroundColor: pokeballStyles.x
              .to([0, 0.75, 1], [0, 0, 1])
              .to((value) => `rgba(255,255,255,${value})`),
          },
    [
      isReleased,
      left,
      pokeballStartLeft,
      pokeballStartTop,
      pokeballStyles.x,
      releaseStyles.x,
      top,
    ]
  );

  return ReactDOM.createPortal(
    <>
      <animated.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-40"
        style={{
          backgroundColor,
        }}
      />
      <animated.div
        className="absolute top-0 left-0 origin-center z-50"
        style={{
          ...styles,
        }}
      >
        {isReleased ? (
          <PokemonArt
            artSrc={artSrc}
            width={width}
            height={height}
            animate={false}
          />
        ) : (
          <Image src={Pokeball} alt="Pokéball" height={POKEBALL_SIZE} />
        )}
      </animated.div>
    </>,
    document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!
  );
}

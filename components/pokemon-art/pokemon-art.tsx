import { animated, useTransition } from "@react-spring/web";
import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { PokemonArtProps } from "./pokemon-art.types";

const DEFAULT_DURATION = 150;

export default function PokemonArt({
  artSrc,
  name,
  width,
  height,
  transitionDuration = DEFAULT_DURATION,
  className,
  ...other
}: PokemonArtProps) {
  const [error, setError] = useState(false);

  const transition = useTransition(artSrc, {
    key: artSrc,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: { duration: transitionDuration },
    exitBeforeEnter: true,
  });

  return transition((style) =>
    artSrc && !error ? (
      <animated.div
        {...other}
        className={twMerge(className, "flex items-center justify-center")}
        style={{ minWidth: width, minHeight: height, ...style }}
      >
        <Image
          src={artSrc}
          alt={`${name}'s art`}
          width={width}
          height={width}
          onError={() => setError(true)}
        />
      </animated.div>
    ) : (
      <animated.div
        {...other}
        className={twMerge(className, "text-center text-slate-800")}
        style={{ width, height, fontSize: height, lineHeight: `${height}px` }}
      >
        ?
      </animated.div>
    )
  );
}

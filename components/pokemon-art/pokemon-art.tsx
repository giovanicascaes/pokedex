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

  return artSrc && !error ? (
    <div
      {...other}
      className={twMerge(
        "flex items-center justify-center",
        className
      )}
      style={{
        minWidth: width,
        minHeight: height,
      }}
    >
      <Image
        src={artSrc}
        alt={`${name}'s art`}
        width={width}
        height={width}
        onError={() => setError(true)}
      />
    </div>
  ) : (
    <div
      {...other}
      className={twMerge(
        "text-center text-black/50 dark:text-white/50",
        className
      )}
      style={{ width, height, fontSize: height, lineHeight: `${height}px` }}
    >
      ?
    </div>
  );
}

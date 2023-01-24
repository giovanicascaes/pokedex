import { animated, easings, useSpring } from "@react-spring/web";
import Image from "next/image";
import { forwardRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { PokemonArtProps } from "./pokemon-art.types";

export default forwardRef<HTMLDivElement, PokemonArtProps>(function PokemonArt(
  {
    artSrc,
    name,
    width,
    height,
    animate = true,
    className,
    artClassName,
    ...other
  },
  ref
) {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const styles = useSpring({
    config: {
      easing: easings.linear,
    },
    opacity: 0,
    to: {
      opacity: isLoaded || isError || !animate ? 1 : 0,
    },
    immediate: !animate,
  });

  return (
    <div
      {...other}
      className={twMerge(
        "flex items-center justify-center text-center text-black/50 dark:text-white/50",
        className
      )}
      style={{
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        fontSize: height,
        lineHeight: `${height}px`,
      }}
      ref={ref}
    >
      {isError || !artSrc ? (
        <span>?</span>
      ) : (
        <animated.div style={{ ...styles }}>
          <Image
            src={artSrc}
            alt={name ? `${name}'s art` : "Unknown art for this pokémon"}
            width={width}
            height={width}
            onLoadingComplete={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
            priority
            className={artClassName}
          />
        </animated.div>
      )}
    </div>
  );
});

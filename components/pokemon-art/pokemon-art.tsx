import { animated, easings, useSpring } from "@react-spring/web"
import Image from "next/image"
import { forwardRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { PokemonArtProps } from "./pokemon-art.types"

export default forwardRef<HTMLDivElement, PokemonArtProps>(function PokemonArt(
  {
    artSrc,
    name,
    width,
    height,
    fill = false,
    animate = true,
    className,
    artClassName,
    ...other
  },
  ref
) {
  const [isError, setIsError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const styles = useSpring({
    config: {
      easing: easings.linear,
    },
    opacity: 0,
    to: {
      opacity: isLoaded || isError || !animate ? 1 : 0,
    },
    immediate: !animate,
  })

  const computedWidth = fill ? undefined : width
  const computedHeight = fill ? undefined : width

  return (
    <div
      {...other}
      className={twMerge(
        "w-full aspect-square flex items-center justify-center text-center text-black/50 dark:text-white/50",
        className
      )}
      style={{
        width: computedWidth,
        height: computedHeight,
        minWidth: computedWidth,
        minHeight: computedHeight,
        fontSize: computedHeight,
        lineHeight: computedHeight ? `${computedHeight}px` : undefined,
      }}
      ref={ref}
    >
      {isError || !artSrc ? (
        <span>?</span>
      ) : (
        <animated.div
          className="relative w-full aspect-square"
          style={{ ...styles }}
        >
          <Image
            src={artSrc}
            alt={name ? `${name}'s art` : "Unknown art for this pokémon"}
            width={computedWidth}
            height={computedHeight}
            fill={fill}
            onLoadingComplete={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
            priority
            className={artClassName}
          />
        </animated.div>
      )}
    </div>
  )
})

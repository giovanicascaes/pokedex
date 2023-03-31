import { animated, useTransition } from "@react-spring/web"
import { PokemonArt, PokemonCatchReleaseAnimation, Tooltip } from "components"
import { POKEMON_CAUGHT_RELEASE_FLAG_TRANSITION_DURATION } from "lib"
import Link from "next/link"
import { forwardRef, useCallback, useState } from "react"
import { MdCatchingPokemon } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { PokemonListItemProps } from "./pokemon-list-item.types"

export default forwardRef<HTMLAnchorElement, PokemonListItemProps>(
  function PokemonListItem(
    {
      identifier: id,
      resourceName,
      artSrc,
      name,
      onClick,
      animateArt = true,
      isOnPokedex = false,
      onCatchReleaseFinish,
      className,
      ...otherProps
    },
    ref
  ) {
    const [isCatchingOrReleasing, setIsCatchingOrReleasing] = useState(false)

    const handleCatchReleaseFinish = useCallback(() => {
      setIsCatchingOrReleasing(false)
      onCatchReleaseFinish?.()
    }, [onCatchReleaseFinish])

    const transition = useTransition(isOnPokedex, {
      config: {
        duration: POKEMON_CAUGHT_RELEASE_FLAG_TRANSITION_DURATION,
      },
      from: {
        scale: 0,
      },
      enter: [
        {
          scale: 1.3,
        },
        {
          scale: 1,
        },
      ],
      leave: {
        scale: 0,
      },
      exitBeforeEnter: true,
    })

    return (
      <Link
        {...otherProps}
        className={twMerge(
          "group/list-item shadow dark:shadow-md relative rounded-2xl flex p-2 space-x-4 bg-white hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-900 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 hover:focus-visible:ring-red-400 dark:focus-visible:ring-red-400 dark:hover:focus-visible:ring-red-500 focus-visible:ring-opacity-50",
          className
        )}
        href={`/pokemon/${resourceName}`}
        ref={ref}
      >
        <PokemonCatchReleaseAnimation
          isCaught={isCatchingOrReleasing !== isOnPokedex}
          onAnimationFinished={handleCatchReleaseFinish}
        >
          <PokemonArt
            artSrc={artSrc}
            name={name}
            width={80}
            height={80}
            animate={animateArt}
          />
        </PokemonCatchReleaseAnimation>
        <div className="flex flex-col my-auto">
          <span className="text-slate-400 group-hover/list-item:text-black dark:text-slate-100 dark:group-hover/list-item:text-white text-xs transition-colors">
            #{id}
          </span>
          <div className="flex space-x-2 items-center">
            <span className="text-slate-600 group-hover/list-item:text-black dark:text-slate-400 dark:group-hover/list-item:text-white text-xl font-light truncate transition-colors">
              {name}
            </span>
            {transition(
              (styles, show) =>
                show && (
                  <animated.div className="z-10" style={{ ...styles }}>
                    <Tooltip content="In Pokédex">
                      <div
                        className="cursor-help rounded-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 before:absolute before:content-[''] before:-z-10 before:top-0.5 before:left-0.5 before:bg-white before:h-[calc(100%-4px)] before:w-[calc(100%-4px)] before:rounded-full"
                        tabIndex={0}
                        onClick={(e) => e.preventDefault()}
                      >
                        <MdCatchingPokemon
                          size={22}
                          className="text-red-500 dark:text-red-500/90"
                        />
                      </div>
                    </Tooltip>
                  </animated.div>
                )
            )}
          </div>
        </div>
        {!isCatchingOrReleasing && (
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsCatchingOrReleasing(true)
            }}
            className="z-10 flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 right-4 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/list-item:opacity-100 group-hover/list-item:visible transition-all text-xs font-semibold bg-slate-300 hover:bg-red-500/90 active:bg-red-600/90 text-black dark:bg-slate-700/60 dark:hover:bg-red-400 dark:hover:active:bg-red-500 dark:text-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 group/catch-button"
          >
            <MdCatchingPokemon size={22} />
            <span>{isOnPokedex ? "Release" : "Catch"}</span>
          </button>
        )}
      </Link>
    )
  }
)

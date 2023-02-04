import { animated, useTransition } from "@react-spring/web";
import { POKEDEX_BADGE_TRANSITION, PokemonArt, Tooltip } from "components";
import { useThemeMode } from "contexts";
import Link from "next/link";
import { forwardRef, useRef, useState } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { join } from "utils";
import { PokemonListItemProps } from "./pokemon-list-item.types";

export default forwardRef<HTMLAnchorElement, PokemonListItemProps>(
  function PokemonListItem(
    {
      identifier: id,
      resourceName,
      artSrc,
      name,
      onClick,
      animateArt = true,
      onPokemonAction,
      actionAllowed = true,
      isCaught = false,
      ...otherProps
    },
    ref
  ) {
    const artRef = useRef<HTMLDivElement | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [{ isDark }] = useThemeMode();

    const showToolTip = () => {
      setTooltipVisible(true);
    };
    const hideToolTip = () => {
      setTooltipVisible(false);
    };

    const transition = useTransition(isCaught, {
      config: {
        duration: POKEDEX_BADGE_TRANSITION,
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
    });

    return (
      <Link
        {...otherProps}
        className="group/list-item relative rounded-2xl flex px-2 py-2 space-x-4 bg-white hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-white cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 hover:focus-visible:ring-red-400 dark:focus-visible:ring-red-400 dark:hover:focus-visible:ring-red-500 focus-visible:ring-opacity-50"
        href={`/pokemon/${resourceName}`}
        ref={ref}
      >
        <PokemonArt
          artSrc={artSrc}
          name={name}
          width={80}
          height={80}
          animate={animateArt}
          className="rounded-xl bg-slate-100 group-hover/list-item:bg-slate-600 dark:bg-slate-600 dark:group-hover/list-item:bg-white transition-colors"
          ref={artRef}
        />
        <div className="flex flex-col my-auto">
          <span className="text-slate-400 group-hover/list-item:text-white dark:text-slate-100 dark:group-hover/list-item:text-black text-xs">
            #{id}
          </span>
          <div className="flex space-x-4">
            <span className="text-slate-600 group-hover/list-item:text-white dark:text-slate-400 dark:group-hover/list-item:text-black text-xl font-light truncate">
              {name}
            </span>
            {transition(
              (styles, show) =>
                show && (
                  <animated.div
                    className="flex justify-center items-center relative z-20"
                    style={{ ...styles }}
                  >
                    <span
                      className="cursor-help rounded-full absolute z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 group-hover/list-item:focus-visible:ring-red-400 dark:focus-visible:ring-red-400 dark:group-hover/list-item:focus-visible:ring-red-400 focus-visible:ring-opacity-50 before:absolute before:content-[''] before:-z-10 before:top-0.5 before:left-0.5 before:bg-white before:h-[calc(100%-4px)] before:w-[calc(100%-4px)] before:rounded-full"
                      tabIndex={0}
                      onFocus={showToolTip}
                      onMouseOver={showToolTip}
                      onBlur={hideToolTip}
                      onMouseLeave={hideToolTip}
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className={join(!isDark && "dark")}>
                        <Tooltip
                          visible={tooltipVisible}
                          className="absolute -top-6 min-w-max max-w-[300px] left-1/2"
                        >
                          In Pokédex
                        </Tooltip>
                      </div>
                      <MdCatchingPokemon
                        size={22}
                        className="text-red-500 group-hover/list-item:text-red-500/90 dark:text-red-500/90 dark:group-hover/list-item:text-red-500"
                      />
                    </span>
                  </animated.div>
                )
            )}
          </div>
        </div>
        {actionAllowed && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onPokemonAction?.(artRef);
            }}
            className="z-10 flex items-center space-x-1 absolute top-1/2 -translate-y-1/2 right-4 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/list-item:opacity-100 group-hover/list-item:visible transition-all text-xs font-semibold bg-white hover:bg-red-400 active:bg-red-500 text-slate-800 dark:bg-slate-600 dark:hover:bg-red-500 dark:hover:active:bg-red-600 dark:text-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 group/catch-button"
          >
            <MdCatchingPokemon size={22} />
            <span>{isCaught ? "Release" : "Catch"}</span>
          </button>
        )}
      </Link>
    );
  }
);

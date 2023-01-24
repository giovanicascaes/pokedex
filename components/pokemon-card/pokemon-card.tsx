import { animated, useTransition } from "@react-spring/web";
import { PokemonArt, Tooltip } from "components";
import Link from "next/link";
import { forwardRef, useRef, useState } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { PokemonCardProps } from "./pokemon-card.types";

const TRANSITION_DURATION = 130;

export default forwardRef<HTMLDivElement, PokemonCardProps>(
  function PokemonCard(
    {
      identifier: id,
      resourceName,
      artSrc,
      name,
      onClick,
      animateArt = true,
      onPokemonChanged,
      canChange = true,
      isCaught = false,
      className,
      ...otherProps
    },
    ref
  ) {
    const artRef = useRef<HTMLDivElement | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const showToolTip = () => {
      setTooltipVisible(true);
    };
    const hideToolTip = () => {
      setTooltipVisible(false);
    };

    const transition = useTransition(isCaught, {
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
      config: {
        duration: TRANSITION_DURATION,
      },
    });

    return (
      <div
        {...otherProps}
        className={twMerge("flex flex-col items-center", className)}
        ref={ref}
      >
        <div className="[perspective:1000px] group/card">
          <Link
            className="flex px-4 py-10 shadow-md dark:shadow-black/50 rounded-lg bg-white dark:bg-slate-700 cursor-pointer hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] active:translate-y-2 hover:shadow-2xl peer-hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] peer-active:translate-y-2 peer-hover:shadow-2xl hover:dark:shadow-black/50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50"
            href={`/pokemon/${resourceName}`}
          >
            <PokemonArt
              artSrc={artSrc}
              name={name}
              width={220}
              height={220}
              animate={animateArt}
              ref={artRef}
            />
          </Link>
          {canChange && (
            <button
              onClick={() => onPokemonChanged?.(artRef)}
              className="flex items-center space-x-1 absolute -top-3.5 -right-3.5 z-10 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all text-xs font-semibold bg-slate-600 hover:bg-red-500 hover:active:bg-red-600 text-white dark:bg-white dark:hover:bg-red-400 dark:active:bg-red-500 dark:text-slate-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 group/catch-button"
            >
              <MdCatchingPokemon
                size={22}
                className="text-white dark:text-slate-800 dark:group-hover/catch-button:text-white transition-all"
              />
              <span>{isCaught ? "Release" : "Catch"}</span>
            </button>
          )}
        </div>
        <span className="text-slate-400 dark:text-slate-100 text-sm mt-2">
          #{id}
        </span>
        <div className="flex relative">
          <span className="text-slate-600 dark:text-slate-400 text-2xl font-light truncate transition-all">
            {name}
          </span>
          {transition(
            (styles, show) =>
              show && (
                <animated.div
                  className="absolute -left-7 h-full flex items-center"
                  style={{ ...styles }}
                >
                  <span
                    className="cursor-help rounded-full relative focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50 before:absolute before:content-[''] before:-z-10 before:top-0.5 before:left-0.5 before:bg-white dark:before:bg-slate-300 before:h-[calc(100%-4px)] before:w-[calc(100%-4px)] before:rounded-full"
                    tabIndex={0}
                    onFocus={showToolTip}
                    onMouseOver={showToolTip}
                    onBlur={hideToolTip}
                    onMouseLeave={hideToolTip}
                  >
                    <Tooltip
                      visible={tooltipVisible}
                      className="absolute z-10 -top-6 min-w-max max-w-[300px] left-1/2"
                    >
                      In Pokédex
                    </Tooltip>
                    <MdCatchingPokemon
                      size={22}
                      className="text-red-500 dark:text-red-500/90"
                    />
                  </span>
                </animated.div>
              )
          )}
        </div>
      </div>
    );
  }
);

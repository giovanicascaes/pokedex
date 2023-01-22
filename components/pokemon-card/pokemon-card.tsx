import { PokemonArt } from "components";
import Link from "next/link";
import { forwardRef, useRef } from "react";
import { TbPokeball } from "react-icons/tb";
import { twMerge } from "tailwind-merge";
import { PokemonCardProps } from "./pokemon-card.types";

export default forwardRef<HTMLDivElement, PokemonCardProps>(
  function PokemonCard(
    {
      identifier: id,
      resourceName,
      artSrc,
      name,
      onClick,
      animateArt = true,
      onCatchPokemon,
      className,
      ...otherProps
    },
    ref
  ) {
    const artRef = useRef<HTMLDivElement | null>(null);

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
          <button
            onClick={() =>
              onCatchPokemon?.(artRef.current!.getBoundingClientRect().toJSON())
            }
            className="flex items-center space-x-1 absolute -top-3.5 -right-3.5 z-10 rounded-full py-1.5 pl-1.5 pr-2.5 opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all text-xs font-semibold bg-slate-600 hover:bg-red-500 hover:active:bg-red-600 text-white dark:bg-white dark:hover:bg-red-400 dark:active:bg-red-500 dark:text-slate-800 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 group/catch-button"
          >
            <TbPokeball
              size={22}
              className="text-white dark:text-slate-800 dark:group-hover/catch-button:text-white transition-all"
            />
            <span>Catch</span>
          </button>
        </div>
        <span className="text-slate-400 dark:text-slate-100 text-sm font-semibol mt-2">
          #{id}
        </span>
        <span className="text-slate-600 dark:text-slate-400 text-2xl font-light truncate">
          {name}
        </span>
      </div>
    );
  }
);

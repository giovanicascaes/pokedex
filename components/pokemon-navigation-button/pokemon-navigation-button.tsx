import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { join } from "utils";
import {
  PokemonNavigationButtonArrowProps,
  PokemonNavigationButtonProps,
} from "./pokemon-navigation-button.types";

function PokemonNavigationArrow({
  forwards = false,
}: PokemonNavigationButtonArrowProps) {
  return (
    <span
      className={twMerge(
        "text-red-500 group-hover:text-black dark:text-red-400 dark:group-hover:text-white transition-transform group-hover:-translate-x-2",
        forwards && "group-hover:translate-x-2"
      )}
    >
      <MdArrowBackIos size={22} className={join(forwards && "rotate-180")} />
    </span>
  );
}

export default function PokemonNavigationButton({
  toPokemon: { id, name, artSrc, resourceName },
  forwards = false,
  className,
  ...other
}: PokemonNavigationButtonProps) {
  return (
    <Link
      {...other}
      href={`/pokemon/${resourceName}`}
      className={twMerge(
        "flex items-center w-96 rounded-xl p-5 space-x-2 ring-1 ring-slate-300/30 dark:ring-slate-500/20 hover:ring-slate-300/30 hover:bg-slate-300/30 active:ring-slate-300/50 active:bg-slate-300/50 dark:hover:ring-slate-500/20 dark:hover:bg-slate-500/20 dark:active:ring-slate-500/[0.35] dark:active:bg-slate-500/[0.35] group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:focus-visible:ring-red-400 focus-visible:ring-opacity-50",
        forwards ? "pr-9 justify-end" : "pl-9",
        className
      )}
    >
      {!forwards && <PokemonNavigationArrow />}
      <span
        className={twMerge(
          "flex flex-col text-xl",
          forwards ? "items-end" : "items-start"
        )}
      >
        <span className="text-slate-500 group-hover:text-black dark:text-slate-400 dark:group-hover:text-white text-base">
          #{id}
        </span>
        <span className="text-slate-600 group-hover:text-black dark:text-slate-200 dark:group-hover:text-white ml-1 font-semibold">
          {name}
        </span>
      </span>
      {forwards && <PokemonNavigationArrow forwards />}
    </Link>
  );
}

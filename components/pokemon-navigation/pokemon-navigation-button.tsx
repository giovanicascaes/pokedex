import Link from "next/link"
import { MdArrowBackIos } from "react-icons/md"
import { twMerge } from "tailwind-merge"
import { join } from "utils"
import {
  PokemonNavigationButtonArrowProps,
  PokemonNavigationButtonProps,
} from "./pokemon-navigation.types"

function PokemonNavigationArrow({
  backwards: forwards = false,
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
  )
}

export default function PokemonNavigationButton({
  to: { id, name, resourceName },
  backwards = true,
  className,
  ...other
}: PokemonNavigationButtonProps) {
  return (
    <Link
      {...other}
      href={`/pokemon/${resourceName}`}
      className={twMerge(
        "flex items-center w-96 rounded-xl p-5 space-x-2 border hover:border-transparent dark:hover:border-transparent border-slate-300/30 dark:border-slate-500/20 hover:bg-slate-300/30 active:bg-slate-300/50 dark:hover:bg-slate-500/20 dark:active:bg-slate-500/[0.35] group transition-colors focus-highlight",
        backwards ? "pl-9" : "pr-9 justify-end",
        className
      )}
    >
      {backwards && <PokemonNavigationArrow />}
      <span
        className={twMerge(
          "flex flex-col text-xl",
          backwards ? "items-start" : "items-end"
        )}
      >
        <span className="text-slate-500 group-hover:text-black dark:text-slate-400 dark:group-hover:text-white text-base">
          #{id}
        </span>
        <span className="text-slate-600 group-hover:text-black dark:text-slate-200 dark:group-hover:text-white ml-1 font-semibold">
          {name}
        </span>
      </span>
      {!backwards && <PokemonNavigationArrow backwards />}
    </Link>
  )
}

import { PokemonArt } from "components";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { PokemonCardProps } from "./pokemon-card.types";

export default function PokemonSimpleCard({
  identifier: id,
  resourceName,
  artSrc,
  name,
  onClick,
  className,
  ...otherProps
}: PokemonCardProps) {
  return (
    <div
      {...otherProps}
      className={twMerge(
        "flex flex-col items-center [perspective:1000px]",
        className
      )}
    >
      <Link
        className="flex px-4 py-10 shadow-md dark:shadow-black/50 rounded-lg bg-white dark:bg-slate-700 cursor-pointer hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] active:translate-y-2 hover:shadow-2xl hover:dark:shadow-black/50 transition-all"
        href={`/pokemon/${resourceName}`}
      >
        <PokemonArt artSrc={artSrc} name={name} width={220} height={220} />
      </Link>
      <span className="text-slate-400 dark:text-slate-100 text-sm font-semibol mt-2">
        #{id}
      </span>
      <span className="text-slate-600 dark:text-slate-400 text-2xl font-light truncate">
        {name}
      </span>
    </div>
  );
}

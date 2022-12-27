import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { PokemonCardProps } from "./pokemon-card.types";

export default function PokemonSimpleCard({
  identifier: id,
  artSrc,
  name,
  onClick,
  className,
  ...other
}: PokemonCardProps) {
  return (
    <div
      className={twMerge(
        className,
        "flex flex-col items-center space-y-2 [perspective:1000px]"
      )}
      {...other}
    >
      <div
        className="flex items-center justify-center px-4 py-10 shadow-md rounded-lg bg-white cursor-pointer hover:[transform:rotateX(8deg)_rotateY(-2deg)_rotateZ(-2deg)] active:translate-y-2 hover:shadow-2xl transition-all"
        onClick={onClick}
      >
        <Image src={artSrc} alt={`${name}'s art`} width={220} height={220} />
      </div>
      <span className="text-slate-400 text-sm font-semibold">#{id}</span>
      <span className="text-slate-600 text-2xl font-light truncate">
        {name}
      </span>
    </div>
  );
}

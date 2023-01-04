import { twMerge } from "tailwind-merge";
import { PokemonDetailsSectionProps } from "./pokemon-section.types";

export default function PokemonDetailsSection({
  label,
  children,
  className,
  ...other
}: PokemonDetailsSectionProps) {
  return (
    <section
      {...other}
      className={twMerge("flex flex-col space-y-4", className)}
    >
      <span className="text-lg text-slate-800 font-semibold">{label}</span>
      {children}
    </section>
  );
}

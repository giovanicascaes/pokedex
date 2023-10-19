import { AbilityOverlay } from "components"
import { Ability } from "lib"
import { ReactNode, useMemo, useState } from "react"
import { IoFemaleOutline, IoMaleOutline } from "react-icons/io5"
import { twMerge } from "tailwind-merge"
import { match } from "utils"
import { PokemonProfileProps } from "./pokemon-profile.types"

function Data({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="max-sm:grid max-sm:grid-cols-2 sm:space-y-3">
      <span className="max-sm:text-sm sm:text-xs uppercase font-medium text-slate-400 dark:text-slate-400/90">
        {title}
      </span>
      <div className="text-md text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </div>
  )
}

function Unit({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm font-light text-slate-500 dark:text-slate-300">
      {children}
    </span>
  )
}

export default function PokemonProfile({
  abilities,
  gender,
  height,
  shape,
  weight,
  className,
  ...other
}: PokemonProfileProps) {
  const [displayingAbility, setDisplayingAbility] = useState<Ability>()

  const genderIcons = useMemo(() => {
    const maleIcon = <IoMaleOutline size={28} />
    const femaleIcon = <IoFemaleOutline size={28} />

    return match(
      {
        male: maleIcon,
        female: femaleIcon,
        both: (
          <div className="flex space-x-1.5">
            {maleIcon}
            {femaleIcon}
          </div>
        ),
        unknown: "Unknown",
      },
      gender
    )
  }, [gender])

  return (
    <div
      {...other}
      className={twMerge(
        "sm:grid sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-sm:space-y-4 sm:gap-4 relative",
        className
      )}
    >
      <Data title="Height">
        {height / 10} <Unit>m</Unit>
      </Data>
      <Data title="Category">{shape}</Data>
      <Data title="Weight">
        {weight / 10} <Unit>kg</Unit>
      </Data>
      <Data title="Abilities">
        <div className="flex flex-col">
          {abilities
            .sort(({ slot: slot1 }, { slot: slot2 }) =>
              slot1 < slot2 ? -1 : 1
            )
            .map((ability) => {
              const { name } = ability

              return (
                <div key={name} className="flex items-center">
                  {name}
                  {ability.description && (
                    <button
                      onClick={() => setDisplayingAbility(ability)}
                      className="bg-gray-200 dark:bg-gray-600 text-slate-700 dark:text-slate-300/90 rounded-full cursor-pointer w-5 h-5 flex items-center justify-center text-base ml-1.5 focus-default"
                    >
                      ?
                    </button>
                  )}
                </div>
              )
            })}
        </div>
      </Data>
      <Data title="Gender">{genderIcons}</Data>
      <AbilityOverlay
        ability={displayingAbility}
        onClose={() => setDisplayingAbility(undefined)}
        className="mt-0"
      />
    </div>
  )
}

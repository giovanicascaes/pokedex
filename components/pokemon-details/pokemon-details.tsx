import {
  Badge,
  FadeOnChange,
  PokemonArt,
  PokemonEvolutionChain,
  PokemonNavigation,
  PokemonProfile,
  PokemonSection,
  PokemonStats,
  PokemonTypes,
  Select,
} from "components"
import { useMedia } from "hooks"
import { Children, isValidElement, useEffect, useState } from "react"
import theme from "styles/theme"
import { twMerge } from "tailwind-merge"
import {
  PokemonDetailsBadges,
  PokemonDetailsProps,
} from "./pokemon-details.types"

const { sm, md, lg } = theme!.screens as { [k: string]: string }

const lgQuery = `(min-width: ${lg})`

function BadgesContainer({
  children,
  className,
  ...other
}: PokemonDetailsBadges) {
  return Children.toArray(children).filter(isValidElement).length > 0 ? (
    <div {...other} className={twMerge("flex space-x-2", className)}>
      {children}
    </div>
  ) : null
}

export default function PokemonDetails({
  pokemon: {
    color,
    evolutionChain,
    gender,
    id,
    isBaby,
    isLegendary,
    isMythical,
    name,
    nextPokemon,
    previousPokemon,
    shape,
    varieties,
  },
}: PokemonDetailsProps) {
  const [selectedForm, setSelectedForm] = useState(varieties[0])
  const displayedFormName = selectedForm.name ?? name

  const [isLgScreen] = useMedia([lgQuery], {
    fallback: false,
  })

  useEffect(() => {
    setSelectedForm(varieties[0])
  }, [varieties])

  return (
    <div className="space-y-12">
      <PokemonNavigation
        previousPokemon={previousPokemon}
        nextPokemon={nextPokemon}
      />
      <div className="flex flex-col items-center">
        <span className="space-x-2 text-center text-4xl">
          <span className="text-slate-600 dark:text-slate-400 font-light">
            #{id}
          </span>
          <span className="text-slate-800 dark:text-slate-100 font-medium">
            {name}
          </span>
        </span>
        <BadgesContainer className="mt-4">
          {isBaby && <Badge color="red">Baby</Badge>}
          {isLegendary && <Badge color="pink">Legendary</Badge>}
          {isMythical && <Badge color="yellow">Mythical</Badge>}
        </BadgesContainer>
        {varieties.length > 1 && (
          <Select
            value={selectedForm}
            onChange={setSelectedForm}
            by="id"
            className="max-w-[320px] mt-8 relative"
          >
            <Select.Button>
              <div className="flex items-baseline w-full">
                {displayedFormName}
                {selectedForm.isMega && (
                  <Badge
                    color="purple"
                    variant="rounded"
                    className="w-min ml-2.5"
                  >
                    Mega
                  </Badge>
                )}
              </div>
            </Select.Button>
            <Select.Options className="max-h-[350px] overflow-y-auto">
              {varieties.map((variety) => (
                <Select.Option key={variety.id} value={variety}>
                  <div className="flex items-baseline">
                    {variety.name ?? name}
                    {variety.isMega && (
                      <Badge
                        color="purple"
                        variant="rounded"
                        className="w-min ml-2.5"
                      >
                        Mega
                      </Badge>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
        )}
        <FadeOnChange
          watch={selectedForm}
          className="w-full relative flex justify-center"
        >
          {({ abilities, artSrc, height, stats, types, weight }) => (
            <div className="flex flex-1 max-lg:flex-col max-lg:space-y-16 lg:space-x-16 mt-28 max-lg:items-center">
              <div className="flex flex-col space-y-8 md:max-lg:flex-row md:max-lg:space-x-8 md:max-lg:space-y-0 max-lg:w-full max-md:max-w-[500px] md:max-lg:max-w-[800px]">
                <div
                  className="max-lg:flex-1 md:max-lg:max-w-[400px] rounded-md"
                  style={{ backgroundColor: color }}
                >
                  <PokemonArt
                    artSrc={artSrc}
                    width={450}
                    height={450}
                    fill={!isLgScreen}
                    sizes={`
                      (max-width: ${sm}) 100vw,
                      (max-width: ${md}) 50vw,
                      33vw`}
                    name={displayedFormName}
                    className="rounded-md bg-white/75 dark:bg-slate-400/70 outline outline-1 -outline-offset-1 outline-black/[0.14] dark:outline-white/[0.28]"
                  />
                </div>
                <PokemonSection label="Stats" className="mt-8 flex-1">
                  <PokemonStats>
                    {stats.map(({ name: statName, value }) => (
                      <PokemonStats.Meter
                        key={statName}
                        label={statName}
                        totalBars={15}
                        value={value}
                        barContainerClassName="h-[220px]"
                      />
                    ))}
                  </PokemonStats>
                </PokemonSection>
              </div>
              <div className="space-y-8 w-full">
                <PokemonSection label="Profile">
                  <PokemonProfile
                    height={height}
                    weight={weight}
                    shape={shape}
                    abilities={abilities}
                    gender={gender}
                  />
                </PokemonSection>
                <PokemonTypes types={types} />
              </div>
            </div>
          )}
        </FadeOnChange>
        <div className="w-full">
          <PokemonSection label="Evolution Chain" className="mt-12">
            <PokemonEvolutionChain evolutionChain={evolutionChain} />
          </PokemonSection>
        </div>
      </div>
    </div>
  )
}

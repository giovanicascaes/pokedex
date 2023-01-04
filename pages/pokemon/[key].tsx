import {
  AnimateOnChange,
  Badge,
  PokemonArt,
  PokemonProfile,
  PokemonSection,
  PokemonStatMeter,
  PokemonTypes,
  Select,
} from "components";
import { getPokemon } from "lib";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import {
  Children,
  DetailedHTMLProps,
  HTMLAttributes,
  isValidElement,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function SpeciesBadgeContainer({
  children,
  className,
  ...other
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return Children.toArray(children).filter(isValidElement).length > 0 ? (
    <div {...other} className={twMerge("flex space-x-2", className)}>
      {children}
    </div>
  ) : null;
}

export default function Pokemon({
  pokemon: {
    evolutionChain,
    gender,
    id,
    isBaby,
    isLegendary,
    isMythical,
    name,
    varieties,
    color,
    shape,
  },
}: PokemonProps) {
  const [selectedForm, setSelectedForm] = useState(varieties[0]);
  const {
    abilities,
    artSrc,
    height,
    isMega,
    name: formName,
    stats,
    types,
    weight,
  } = selectedForm;
  const displayedFormName = formName ?? name;

  return (
    <>
      <Head>
        <title>{name} | A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-24 pb-12 pt-24 flex flex-col items-center h-full overflow-y-auto">
        <span className="space-x-2 text-center text-4xl">
          <span className="text-slate-600 font-light">#{id}</span>
          <span className="text-slate-800 font-medium">{name}</span>
        </span>
        <SpeciesBadgeContainer className="mt-4">
          {isBaby && <Badge color="red">Mythical</Badge>}
          {isLegendary && <Badge color="pink">Legendary</Badge>}
          {isMythical && <Badge color="yellow">Mythical</Badge>}
        </SpeciesBadgeContainer>
        {varieties.length > 1 && (
          <Select
            value={selectedForm}
            onChange={setSelectedForm}
            by={(a, b) => a.id === b.id}
            className="max-w-[300px] mt-8"
          >
            <Select.Button>{displayedFormName}</Select.Button>
            <Select.Options className="max-h-[350px] overflow-y-scroll">
              {varieties.map((variety) => (
                <Select.Option key={variety.id} value={variety}>
                  {variety.name ?? name}
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
        )}
        <AnimateOnChange animationKey={selectedForm}>
          {selectedForm.isMega && (
            <Badge color="purple" className="w-min mx-auto mt-4">
              Mega
            </Badge>
          )}
          <div className="flex space-x-16 mt-28">
            <div className="space-y-8">
              <div
                className="h-min rounded-lg"
                style={{ backgroundColor: color }}
              >
                <PokemonArt
                  artSrc={artSrc}
                  width={450}
                  height={450}
                  name={displayedFormName}
                  className="bg-white/75 pb-8 pt-4"
                />
              </div>
              <PokemonSection label="Stats" className="mt-8">
                <PokemonStats>
                  {stats.map(({ name: statName, value }) => (
                    <PokemonStatMeter
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
            <div className="space-y-8">
              <PokemonSection label="Profile">
                <PokemonProfile
                  {...{ height, weight, shape, abilities, gender }}
                />
              </PokemonSection>
              <PokemonTypes types={types} />
            </div>
          </div>
        </AnimateOnChange>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ key: string }>) {
  const pokemon = await getPokemon(params!.key);

  return {
    props: {
      pokemon,
    },
  };
}

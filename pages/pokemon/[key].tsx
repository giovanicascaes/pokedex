import { PokemonArt, Select } from "components";
import { getPokemon } from "lib";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useState } from "react";

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>;

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
  },
}: PokemonProps) {
  const [selectedVariety, setSelectedVariety] = useState(varieties[0]);

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-24 pt-24 pb-12 flex flex-col items-center">
        <span className="space-x-2 text-center ">
          <span className="text-[2rem] leading-[2.25rem] font-light text-slate-600">
            #{id}
          </span>
          <span className="text-4xl text-slate-800 font-medium">{name}</span>
        </span>
        {varieties.length > 1 && (
          <Select
            value={selectedVariety}
            onChange={setSelectedVariety}
            by={(a, b) => a.id === b.id}
            className="max-w-[300px] mt-8"
          >
            <Select.Button>{selectedVariety.name}</Select.Button>
            <Select.Options>
              {varieties.map((variety) => (
                <Select.Option key={variety.id} value={variety}>
                  {variety.name}
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
        )}
        <PokemonArt
          artSrc={selectedVariety.artSrc}
          width={350}
          height={350}
          name={selectedVariety.name ?? name}
          className="mt-8"
        />
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

import { FadeOnChange, PokemonDetails } from "components";
import { usePokemonView } from "contexts";
import { getPokemon } from "lib";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useEffect } from "react";

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Pokemon({ pokemon }: PokemonProps) {
  const [, { setViewingPokemon, clearViewingPokemon }] = usePokemonView();

  useEffect(() => {
    setViewingPokemon(pokemon);

    return () => {
      clearViewingPokemon();
    };
  }, [clearViewingPokemon, pokemon, setViewingPokemon]);

  return (
    <>
      <Head>
        <title>{`${name} | A Pokédex`}</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-32 pb-12 pt-8 h-full overflow-x-hidden">
        <FadeOnChange watchChangesOn={pokemon} className="space-y-12">
          {(pokemon) => <PokemonDetails pokemon={pokemon} />}
        </FadeOnChange>
      </div>
    </>
  );
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ key: string }>) {
  const pokemon = await getPokemon(params!.key);

  if (!pokemon) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pokemon,
    },
  };
}

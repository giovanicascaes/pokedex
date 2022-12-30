import { getPokemon } from "lib";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Pokemon({ pokemon }: PokemonProps) {
  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 py-4 bg-slate-50/50"></div>
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

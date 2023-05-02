import {
  AppShellControlledScroll,
  FadeOnChange,
  PokemonDetails,
} from "components"
import { usePage, usePokemon } from "contexts"
import { useIsoMorphicEffect, useLastList } from "hooks"
import { getPokemon } from "lib"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { ReactNode, useEffect } from "react"

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Pokemon({ pokemon }: PokemonProps) {
  const [, { setViewingPokemon, clearViewingPokemon }] = usePokemon()
  const [, { setUpBreadcrumb }] = usePage()
  const lastList = useLastList()

  useEffect(() => {
    setViewingPokemon(pokemon)

    return () => {
      clearViewingPokemon()
    }
  }, [clearViewingPokemon, pokemon, setViewingPokemon])

  useIsoMorphicEffect(() => {
    const previousPath =
      !lastList || lastList === "/"
        ? { label: "Pokémon", href: "/" }
        : { label: "Pokedéx", href: "/pokedex" }

    return setUpBreadcrumb([previousPath, { label: pokemon.name }])
  }, [lastList, pokemon.name, setUpBreadcrumb])

  return (
    <>
      <Head>
        <title>{`${pokemon.name} | A Pokédex`}</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-6 sm:px-16 md:px-32 pb-12 pt-8 h-full overflow-x-hidden">
        <FadeOnChange watch={pokemon}>
          {(pokemon) => <PokemonDetails pokemon={pokemon} />}
        </FadeOnChange>
      </div>
    </>
  )
}

Pokemon.getLayout = function getLayout(page: ReactNode) {
  return (
    <AppShellControlledScroll enableScrollControl={false}>
      {page}
    </AppShellControlledScroll>
  )
}

export async function getServerSideProps({
  params,
}: GetServerSidePropsContext<{ key: string }>) {
  const pokemon = await getPokemon(params!.key)

  // TODO: remove after centralizing the tree
  // pokemon!.evolutionChain.evolvesTo[0].evolvesTo[1] =
  //   pokemon!.evolutionChain.evolvesTo[0].evolvesTo[0]
  // pokemon!.evolutionChain.evolvesTo[1].evolvesTo[1] =
  //   pokemon!.evolutionChain.evolvesTo[1].evolvesTo[0]
  // pokemon!.evolutionChain.evolvesTo[0].evolvesTo[1].evolvesTo[0] =
  //   pokemon!.evolutionChain.evolvesTo[1].evolvesTo[0]
  // pokemon!.evolutionChain.evolvesTo[0].evolvesTo[1].evolvesTo[1] =
  //   pokemon!.evolutionChain.evolvesTo[1].evolvesTo[0]

  if (!pokemon) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      pokemon,
    },
  }
}

import { PokemonDetails, Transition } from "components"
import { usePage, usePokemon } from "contexts"
import { useIsoMorphicEffect } from "hooks"
import { getPokemon } from "lib"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { useEffect } from "react"
import { NextPageWithConfig } from "types"

type PokemonProps = InferGetServerSidePropsType<typeof getServerSideProps>

const Pokemon: NextPageWithConfig<PokemonProps> = ({
  pokemon,
}: PokemonProps) => {
  const [, { setViewingPokemon }] = usePokemon()
  const [{ history }, { updateBreadcrumb }] = usePage()

  useEffect(() => {
    return setViewingPokemon(pokemon)
  }, [pokemon, setViewingPokemon])

  useIsoMorphicEffect(() => {
    const [prevPath] = history.slice(-2)

    const firstBreadcrumb =
      prevPath === "/pokedex"
        ? { label: "Pokedéx", href: "/pokedex" }
        : { label: "Pokémon", href: "/" }

    return updateBreadcrumb([firstBreadcrumb, { label: pokemon.name }])
  }, [history, pokemon.name, updateBreadcrumb])

  return (
    <>
      <Head>
        <title>{`${pokemon.name} | A Pokédex`}</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col px-6 sm:px-16 md:px-32 pb-12 pt-8">
        <Transition watch={pokemon}>
          {(pokemonInTransition) => (
            <PokemonDetails pokemon={pokemonInTransition} />
          )}
        </Transition>
      </div>
    </>
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

export default Pokemon

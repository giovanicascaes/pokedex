import { PokemonList } from "components"
import { POKEMONS_PER_PAGE, usePokemon, useScrollControl } from "contexts"
import { useIntersectionObserver } from "hooks"
import { SHELL_LAYOUT_CONTAINER_ELEMENT_ID, getPokemons } from "lib"
import { InferGetStaticPropsType } from "next"
import Head from "next/head"
import { useCallback, useEffect, useState } from "react"
import { NextPageWithConfig } from "types"
import { env } from "utils"

type PokemonsProps = InferGetStaticPropsType<typeof getStaticProps>

const Pokemons: NextPageWithConfig<PokemonsProps> = ({
  serverLoadedPokemons,
}) => {
  const [isPokemonLoad, setIsPokemonLoad] = useState(false)
  const [
    { visible, preload, hasFetchedAll },
    { loadMore, addPokemonToPokedex, removeFromPokedex },
  ] = usePokemon(serverLoadedPokemons)
  const [{ isRestoringScroll }, { onPageLoadComplete }] = useScrollControl()
  const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
    root: env.isServer
      ? null
      : document.getElementById(SHELL_LAYOUT_CONTAINER_ELEMENT_ID)!,
    rootMargin: "50%",
  })

  const onPokemonLoad = useCallback(() => {
    setIsPokemonLoad(true)
    onPageLoadComplete()
  }, [onPageLoadComplete])

  useEffect(() => {
    if (isIntersecting && !hasFetchedAll) loadMore()
  }, [isIntersecting, loadMore, hasFetchedAll])

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col px-14 pt-4 pb-8">
        <PokemonList
          pokemons={visible}
          immediateAnimations={isRestoringScroll}
          onCatch={addPokemonToPokedex}
          onRelease={removeFromPokedex}
          onLoad={onPokemonLoad}
          className="mx-auto"
        />
        {isPokemonLoad && (
          <div
            className="w-full text-center font-light text-slate-400 mt-10"
            ref={intersectionObserverRef}
          >
            {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
          </div>
        )}
      </div>
    </>
  )
}

Pokemons.controlledScroll = {
  enabled: true,
  childrenPaths: ["/pokemon/[key]"],
  waitForPageToLoad: true,
}

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(POKEMONS_PER_PAGE),
    },
  }
}

export default Pokemons

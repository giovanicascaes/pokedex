import { PokemonList } from "components"
import { POKEMONS_PER_PAGE, usePageState, usePokemonView } from "contexts"
import { useIntersectionObserver } from "hooks"
import { getPokemons } from "lib"
import { InferGetStaticPropsType } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect, useLayoutEffect } from "react"

type HomeProps = InferGetStaticPropsType<typeof getStaticProps>

export default function Home({ serverLoadedPokemons }: HomeProps) {
  const { asPath: currentPath } = useRouter()
  const [
    { visiblePokemons, preloadPokemons, hasFetchedAll, isScrollDirty },
    { loadMore, addPokemonToPokedex, removePokemonFromPokedex },
  ] = usePokemonView(serverLoadedPokemons)
  const [{ isSettingUpPage }, { setIsSettingUpPage }] = usePageState()

  const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
    rootMargin: "20%",
  })

  const onViewReady = useCallback(() => {
    setIsSettingUpPage(null)
  }, [setIsSettingUpPage])

  useEffect(() => {
    if (isIntersecting && !hasFetchedAll) loadMore()
  }, [isIntersecting, loadMore, hasFetchedAll])

  useLayoutEffect(() => {
    setIsSettingUpPage(currentPath)
  }, [currentPath, setIsSettingUpPage])

  return (
    <>
      <Head>
        <title>A Pokédex</title>
        <meta name="description" content="A Pokédex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="px-14 pt-4 h-full pb-8">
        <PokemonList
          pokemons={visiblePokemons}
          preloadPokemons={preloadPokemons}
          skipInitialAnimation={isScrollDirty}
          onAddToPokedex={addPokemonToPokedex}
          onRemoveFromPokedex={removePokemonFromPokedex}
          onReady={onViewReady}
          className="mx-auto"
        />
        {!isSettingUpPage && (
          <div
            className="w-full text-center font-light text-slate-400"
            ref={intersectionObserverRef}
          >
            {hasFetchedAll ? "These are all the Pokémons" : "Loading..."}
          </div>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      serverLoadedPokemons: await getPokemons(POKEMONS_PER_PAGE),
    },
  }
}

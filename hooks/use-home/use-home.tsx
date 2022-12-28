import { fetchAsJson, PokemonSimple } from "lib";
import { useCallback, useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { UseHomeArgs, UseHomeReturn } from "./use-home.types";

export default function useHome(pokemonsPerLoad: UseHomeArgs): UseHomeReturn {
  const { data, error, size, setSize } = useSWRInfinite<{
    result: PokemonSimple[];
  }>(
    (pageIndex) =>
      `/api/pokemon?limit=${pokemonsPerLoad}&offset=${
        (pageIndex + 1) * pokemonsPerLoad
      }`,
    fetchAsJson,
    {
      revalidateFirstPage: false,
    }
  );

  const loadNext = useCallback(() => {
    setSize((current) => current + 1);
  }, [setSize]);

  return useMemo(() => {
    const isLoadingMore = data ? size > 0 && !data[size - 1] : !error;
    const isEmpty = data?.[0]?.result.length === 0;
    const hasReachedEnd =
      isEmpty ||
      (!!data && data[data.length - 1]?.result.length < pokemonsPerLoad);
    const pages = data?.map(({ result }) => result) ?? [];
    const hiddenPage = hasReachedEnd ? [] : pages.pop() ?? [];
    const oldPages = pages.flat();

    return {
      pages: isLoadingMore
        ? [oldPages.concat(...hiddenPage), []]
        : [oldPages, hiddenPage],
      isLoadingMore,
      hasReachedEnd,
      error,
      loadNext,
    };
  }, [data, error, loadNext, pokemonsPerLoad, size]);
}

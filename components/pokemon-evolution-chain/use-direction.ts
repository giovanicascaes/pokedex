import { useIsoMorphicEffect, useResizeObserver } from "hooks"
import { EvolutionChainLink } from "lib"
import { useMemo, useRef, useState } from "react"

function evolutionChainToLevelCount(
  { evolvesTo }: EvolutionChainLink,
  chainLevel = 1
): number[] {
  const nextChainLevels = evolvesTo
    .map((evolution) => evolutionChainToLevelCount(evolution, chainLevel + 1))
    .flat()

  return [chainLevel, ...nextChainLevels]
}

function computeDirection(evolution: EvolutionChainLink) {
  const levelCount = evolutionChainToLevelCount(evolution).reduce<{
    [K in number]: number
  }>((prev, acc) => ({ ...prev, [acc]: (prev[acc] ?? 0) + 1 }), {})
  const numberOfChainLevels = Object.keys(levelCount).length
  const maxEvolutionsInOneLevel = Math.max(...Object.values(levelCount))

  return numberOfChainLevels >= maxEvolutionsInOneLevel
    ? "horizontal"
    : "vertical"
}

export default function useDirection(evolutionChain: EvolutionChainLink) {
  const [chainWidth, setChainWidth] = useState(0)
  const chainRef = useRef<HTMLDivElement | null>(null)
  const [containerRef, containerRect] = useResizeObserver()

  useIsoMorphicEffect(() => {
    const { width } = chainRef.current!.getBoundingClientRect()
    setChainWidth(width)
  }, [])

  const direction = useMemo(() => {
    if ((containerRect?.width ?? 0) < chainWidth) {
      return "vertical"
    }

    return computeDirection(evolutionChain)
  }, [evolutionChain, containerRect?.width, chainWidth])

  return [{ containerRef, chainRef }, direction] as const
}

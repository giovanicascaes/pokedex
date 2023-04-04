import { useIntersectionObserver, usePrevious } from "hooks"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { PokemonCard } from "../pokemon-list-item/pokemon-list-item-card/pokemon-list-item-card"
import { ViewportAwarePokemonCardProps } from "./viewport-aware-pokemon-card.types"

export default forwardRef<HTMLDivElement, ViewportAwarePokemonCardProps>(
  function ViewportAwarePokemonCard(
    { onIntersectionChange, identifier, ...other },
    forwardedRef
  ) {
    const [cardEl, setCardEl] = useState<HTMLDivElement | null>(null)
    const [intersectionObserverRef, isIntersecting] = useIntersectionObserver({
      threshold: [0.1, 0.9],
      disconnectOnceNotVisibleThenNotVisible: true,
    })
    const prevIsIntersecting = usePrevious(isIntersecting)

    useEffect(() => {
      if (
        prevIsIntersecting !== undefined &&
        prevIsIntersecting !== isIntersecting
      ) {
        onIntersectionChange?.(isIntersecting)
      }
    }, [identifier, isIntersecting, onIntersectionChange, prevIsIntersecting])

    useImperativeHandle(forwardedRef, () => cardEl!, [cardEl])

    return (
      <PokemonCard
        key={identifier}
        {...other}
        identifier={identifier}
        ref={(el) => {
          setCardEl(el)
          intersectionObserverRef(el)
        }}
      />
    )
  }
)

type CardsRefs = {
  [key: number]: HTMLElement | null;
};

export default function PokemonGrid() {
  const cardsRefs = useRef<CardsRefs>({});

  return (
    <animated.li
      key={id}
      className="flex items-center justify-center"
      style={{
        ...renderAnimationsController.springs,
      }}
    >
      <animated.div
        style={{
          ...backToListTransition,
        }}
        ref={(el) => {
          cardsRefs.current[id] = el;
        }}
      >
        <ViewportAwarePokemonCard
          {...pokemon}
          onIntersectionChange={handleIntersectionChange}
          animateArt={isBackToListAnimationsDone}
          onPokemonChanged={(artRef) => {
            setPokemonsBeingChanged((current) => [
              ...current,
              {
                id,
                artPosition: artRef.current?.getBoundingClientRect().toJSON(),
              },
            ]);
          }}
          canChange={!isBeingChanged}
          isCaught={isCaught}
        />
      </animated.div>
      {isBeingChanged && (
        <PokemonChangeAnimation
          artPosition={changingData.artPosition}
          artSrc={artSrc}
          onFinish={() => handleOnPokemonChanged(pokemon)}
          isBeingCaught={!isCaught}
        />
      )}
    </animated.li>
  );
}

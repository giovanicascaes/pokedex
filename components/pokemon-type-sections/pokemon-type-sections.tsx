import { PokemonSection } from "components/pokemon-section";
import { PokemonTypeBadge } from "components/pokemon-type-badge";
import { TypeRelation } from "lib";
import { ReactNode } from "react";
import { PokemonTypeSectionsProps } from "./pokemon-type-sections.types";

function toTypeBadge({ color, name, isDouble }: TypeRelation) {
  return (
    <PokemonTypeBadge key={name} color={color} doubleDamage={isDouble}>
      {name}
    </PokemonTypeBadge>
  );
}

function toTypeRelationBadge(types: TypeRelation[]) {
  return types
    .filter(
      (value, index, self) =>
        self.findIndex(
          (value2) => value2.resourceName === value.resourceName
        ) === index
    )
    .sort(({ name: name1 }, { name: name2 }) =>
      name2 > name1 ? -1 : name1 > name2 ? 1 : 0
    )
    .map(toTypeBadge);
}

function TypeListContainer({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(3,minmax(min-content,max-content))] gap-2">
      {children}
    </div>
  );
}

export default function PokemonTypeSections({
  types,
}: PokemonTypeSectionsProps) {
  return (
    <>
      <PokemonSection label="Type">
        <TypeListContainer>
          {types
            .sort(({ slot: slot1 }, { slot: slot2 }) =>
              slot1 < slot2 ? -1 : slot1 > slot2 ? 1 : 0
            )
            .map((type) => toTypeBadge(type))}
        </TypeListContainer>
      </PokemonSection>
      <PokemonSection label="Weaknesses">
        <TypeListContainer>
          {toTypeRelationBadge(
            types.flatMap(
              ({ damageRelations: { takeDamageFrom } }) => takeDamageFrom
            )
          )}
        </TypeListContainer>
      </PokemonSection>
      <PokemonSection label="Strengths">
        <TypeListContainer>
          {toTypeRelationBadge(
            types.flatMap(
              ({ damageRelations: { causeDamageTo } }) => causeDamageTo
            )
          )}
        </TypeListContainer>
      </PokemonSection>
    </>
  );
}

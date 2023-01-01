import { PokemonSection } from "components/pokemon-section";
import { PokemonTypeBadge } from "components/pokemon-type-badge";
import { TypeRelation } from "lib";
import { ReactNode } from "react";
import {
  PokemonTypesProps,
  PokemonTypesTypeListProps,
  PokemonTypesTypeRelationListProps,
} from "./pokemon-types.types";

function mapToTypeBadge({ color, name, isDouble }: TypeRelation) {
  return (
    <PokemonTypeBadge key={name} color={color} doubleDamage={isDouble}>
      {name}
    </PokemonTypeBadge>
  );
}

function TypeListContainer({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-2">{children}</div>;
}

function TypeList({ types }: PokemonTypesTypeListProps) {
  const sortedTypes = types.sort(({ slot: slot1 }, { slot: slot2 }) =>
    slot1 < slot2 ? -1 : slot1 > slot2 ? 1 : 0
  );

  return (
    <TypeListContainer>
      {sortedTypes.map((type) => mapToTypeBadge(type))}
    </TypeListContainer>
  );
}

function TypeRelationList({ types }: PokemonTypesTypeRelationListProps) {
  return (
    <TypeListContainer>
      {types
        .filter(
          (value, index, self) =>
            self.findIndex((value2) => value2.value === value.value) === index
        )
        .sort(({ name: name1 }, { name: name2 }) =>
          name2 > name1 ? -1 : name1 > name2 ? 1 : 0
        )
        .map(mapToTypeBadge)}
    </TypeListContainer>
  );
}

export default function PokemonTypes({ types }: PokemonTypesProps) {
  return (
    <>
      <PokemonSection label="Type">
        <TypeList types={types} />
      </PokemonSection>
      <PokemonSection label="Weaknesses">
        <TypeRelationList
          types={types.flatMap(
            ({ damageRelations: { takeDamageFrom } }) => takeDamageFrom
          )}
        />
      </PokemonSection>
      <PokemonSection label="Strengths">
        <TypeRelationList
          types={types.flatMap(
            ({ damageRelations: { causeDamageTo } }) => causeDamageTo
          )}
        />
      </PokemonSection>
    </>
  );
}

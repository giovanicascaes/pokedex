import { PokemonsView } from "components";
import { usePokemonView } from "contexts";
import { InferGetStaticPropsType } from "next";

type PokedexProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function Pokedex(props: PokedexProps) {
  const [{ pokedex }] = usePokemonView();

  return (
    <ul className="flex flex-col">
      {pokedex.map((pokemon) => (
        <li></li>
      ))}
    </ul>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

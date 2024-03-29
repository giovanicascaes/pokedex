import ConfusedPokemon from "assets/img/confused.png"
import { Link } from "components"
import Image from "next/image"
import { NextPageWithConfig } from "types"

const Custom404: NextPageWithConfig = () => {
  return (
    <div className="flex flex-col items-center p-10">
      <span className="text-9xl font-medium text-slate-600 dark:text-slate-300 mb-4">
        404
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 mb-12">
        Nothing here
      </span>
      <div className="flex items-center justify-center p-4 rounded-full border bg-slate-200 border-black/10 dark:bg-slate-600 dark:border-white/20 mb-12">
        <Image
          alt="Confused pokémon"
          src={ConfusedPokemon}
          height={250}
          className="rounded-full"
        />
      </div>
      <Link href="/">Back to List</Link>
    </div>
  )
}

export default Custom404

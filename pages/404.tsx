import ConfusedPokemon from "assets/img/confused.png"
import Image from "next/image"
import Link from "next/link"

export default function Custom404() {
  return (
    <div className="flex flex-col items-center p-10 min-h-full">
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
      <Link
        href="/"
        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:underline focus:outline-none focus-visible:border-b-2 focus-visible:border-red-500 dark:focus-visible:border-red-400 focus-visible:border-opacity-50 text-sm font-medium"
      >
        Back to List
      </Link>
    </div>
  )
}

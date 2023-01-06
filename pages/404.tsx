import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center p-20 min-h-full">
      <span className="text-9xl font-thin text-slate-300 dark:text-slate-600 mb-4">
        404
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 mb-16">
        Pokemon not found
      </span>
      <Link
        href="/"
        className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:underline focus:outline-none focus-visible:border-b-2 focus-visible:border-red-500 dark:focus-visible:border-red-400 focus-visible:border-opacity-50 text-sm font-medium"
      >
        Back to List
      </Link>
    </div>
  );
}

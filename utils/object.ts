export function pick<
  T extends { [k: string]: any },
  A extends readonly (keyof T)[]
>(object: T, ...attrs: A) {
  return Object.entries(object)
    .filter(([attr]) => attrs.includes(attr))
    .reduce(
      (obj, [k, v]) => ({
        ...obj,
        [k]: v,
      }),
      {}
    ) as { [K in A[number]]: T[K] };
}

export function match<K extends PropertyKey = string, V = any>(
  lookup: { [P in K]?: V },
  key: K,
  fallback?: V
): V | undefined {
  return lookup[key] ?? fallback;
}

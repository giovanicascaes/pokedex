export function filter<T extends { [k: string]: any }, R extends T>(
  object: T,
  predicateFn: (attr: keyof T) => boolean
) {
  return Object.entries(object)
    .filter(([attr]) => predicateFn(attr))
    .reduce(
      (obj, [k, v]) => ({
        ...obj,
        [k]: v,
      }),
      {}
    ) as R
}

export function pick<
  T extends { [k: string]: any },
  U extends readonly (keyof T)[]
>(object: T, ...attrs: U): Pick<T, typeof attrs[number]> {
  return filter(object, (attr) => attrs.includes(attr))
}

export function omit<
  T extends { [k: string]: any },
  U extends readonly (keyof T)[]
>(object: T, ...attrs: U): Omit<T, typeof attrs[number]> {
  return filter(object, (attr) => !attrs.includes(attr))
}

export function match<K extends PropertyKey = string, V = any>(
  lookup: { [P in K]?: V },
  key: K,
  fallback?: V
): V | undefined {
  return lookup[key] ?? fallback
}

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

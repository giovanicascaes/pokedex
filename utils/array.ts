export function range(start: number, end: number) {
  const length = end - start + 1

  return Array.from({ length }, (_, i) => start + i)
}

export function uniqueSequential<T>(arr: T[]) {
  return arr.filter((item, index, array) => item !== array[index - 1])
}

export function mergeUniqueBy<T>(
  arr1: T[],
  arr2: T[],
  uniqueFn: (item: T) => any = (item) => item
) {
  return [
    ...arr1,
    ...arr2.filter((item2) =>
      arr1.every((item1) => uniqueFn(item1) !== uniqueFn(item2))
    ),
  ]
}

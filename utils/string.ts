type Value = string | number | null | undefined | false

export function join(...values: Value[]) {
  return values.filter(Boolean).join("")
}

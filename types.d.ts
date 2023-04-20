import { Ref } from "react"

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

export type WithNonLegacyRef<T, R> = Omit<T, "ref"> & {
  ref?: Ref<R>
}

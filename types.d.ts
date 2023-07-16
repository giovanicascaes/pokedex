import { NextPage } from "next"
import { Ref } from "react"

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>

export type WithNonLegacyRef<T, R> = Omit<T, "ref"> & {
  ref?: Ref<R>
}

export type PageScrollControlConfig =
  | {
      enabled: false
    }
  | {
      enabled: true
      childrenPaths: string[]
      waitForPageToLoad?: boolean
    }

export type NextPageWithConfig<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactNode) => ReactNode
  enableScrollControl?: PageScrollControlConfig
}

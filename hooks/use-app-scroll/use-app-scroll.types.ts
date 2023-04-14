export enum UseAppScrollActionTypes {
  SetIsScrollTrackEnabled,
  SetIsScrollReady,
}

export interface UseAppScrollState {
  isScrollTrackEnabled: boolean
  isScrollReady: boolean
}

export interface UseAppScrollPageState {
  [k: string]: UseAppScrollState
}

export type UseAppScrollPageActions =
  | {
      type: UseAppScrollActionTypes.SetIsScrollTrackEnabled
      enabled: boolean
      page: string
    }
  | {
      type: UseAppScrollActionTypes.SetIsScrollReady
      ready: boolean
      page: string
    }

export interface UseAppScrollActions {
  setScrollTop: (scrollTop: number) => void
  setIsScrollTrackEnabled: (enabled: boolean) => void
  setIsScrollReady: (ready: boolean) => void
}

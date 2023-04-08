export enum UseAppScrollActionTypes {
  DirtyScroll,
  SetIsScrollTrackEnabled,
  SetIsScrollReady,
}

export interface UseAppScrollState {
  isScrollDirty: boolean
  isScrollTrackEnabled: boolean
  isScrollReady: boolean
}

export type UseAppScrollActions =
  | {
      type: UseAppScrollActionTypes.DirtyScroll
    }
  | {
      type: UseAppScrollActionTypes.SetIsScrollTrackEnabled
      enabled: boolean
    }
  | {
      type: UseAppScrollActionTypes.SetIsScrollReady
      ready: boolean
    }

import { RefCallback } from "react";

export interface UseIntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
  disconnectOnceVisible?: boolean;
  disconnectOnceNotVisibleThenNotVisible?: boolean;
}

export type UseIntersectionObserverReturn = [RefCallback<Element>, boolean];

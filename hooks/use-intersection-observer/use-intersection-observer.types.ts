import { RefCallback } from "react";

export interface UseIntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverReturn {
  isIntersecting: boolean;
  ref: RefCallback<Element>;
}

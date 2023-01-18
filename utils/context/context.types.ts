import { Context, ReactNode } from "react";

export interface CreateContextOptions<T> {
  hookName?: string;
  providerName?: string;
  initialValue?: T;
  required?: boolean;
}

export type CreateContextReturn<T> = readonly [
  (props: CreateContextProviderProps<T>) => JSX.Element,
  () => T,
  Context<T>
];

export interface CreateContextProviderProps<T> {
  value: T;
  children: ReactNode;
}

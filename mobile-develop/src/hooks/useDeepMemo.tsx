import { useRef } from "react";
import isEqual from "react-fast-compare";

export function useDeepMemo<T>(factory: () => T, dependencies: any[]): T {
  const previousDependencies = useRef<any[]>([]);
  const previousValue = useRef<T>();

  if (!isEqual(previousDependencies.current, dependencies)) {
    previousDependencies.current = dependencies;
    previousValue.current = factory();
  }

  return previousValue.current as T;
}

import { useCallback, useRef } from "react";
import isEqual from "react-fast-compare";

export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  const previousDependencies = useRef<any[]>([]);
  const callbackRef = useRef<T>(callback);

  if (!isEqual(previousDependencies.current, dependencies)) {
    previousDependencies.current = dependencies;
    callbackRef.current = callback;
  }

  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}
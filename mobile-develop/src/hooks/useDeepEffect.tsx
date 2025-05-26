import { useEffect, useRef } from "react";
import isEqual from "react-fast-compare";

export function useDeepEffect(callback: () => void, dependencies: any[]) {
  const previousDependencies = useRef<any>();

  if (!isEqual(previousDependencies.current, dependencies)) {
    previousDependencies.current = dependencies;
  }

  useEffect(callback, [previousDependencies.current]);
}
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

export function useLocalStorageState<T>(
  initialState: T,
  key: string,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(function () {
    const storedValue = localStorage.getItem(key);
    // localStorage has no runtime schema; this preserves the existing JSON
    // persistence contract while keeping the generic state tuple precise.
    return storedValue ? (JSON.parse(storedValue) as T) : initialState;
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key],
  );

  return [value, setValue];
}

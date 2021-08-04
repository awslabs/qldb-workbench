import { useEffect, useState } from "react";

export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) return defaultValue;

    const parsedValue = JSON.parse(storedValue);

    if (typeof parsedValue === "string") return parsedValue;

    return { ...defaultValue, ...parsedValue };
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

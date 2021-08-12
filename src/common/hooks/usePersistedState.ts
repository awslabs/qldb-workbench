import { useEffect, useState } from "react";

export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  persistKeys?: (keyof T)[]
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) return defaultValue;

    const parsedValue = JSON.parse(storedValue);

    if (typeof parsedValue !== "object") return parsedValue;

    return { ...defaultValue, ...parsedValue };
  });

  useEffect(() => {
    if (typeof value !== "object") {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }

    const objToPersist: { [key: string]: any } = {};

    for (const key in value) {
      if (!persistKeys || persistKeys.includes(key as keyof T)) {
        objToPersist[key] = value[key];
      }
    }

    localStorage.setItem(key, JSON.stringify(objToPersist));
  }, [key, persistKeys, value]);

  return [value, setValue];
}

import { useState } from "react";

export function useToggle(
  initial: boolean
): [boolean, () => void, (newValue: boolean) => () => void] {
  const [value, setValue] = useState(initial);
  return [
    value,
    () => {
      setValue((current) => !current);
    },
    (newValue: boolean) => () => {
      setValue(newValue);
    },
  ];
}

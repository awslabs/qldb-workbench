import { useEffect } from "react";

export function useKeyboard(
  filter: (e: KeyboardEvent) => boolean,
  effect: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (filter(e)) {
        e.preventDefault();
        effect(e);
      }
    };
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [filter, effect]);
}

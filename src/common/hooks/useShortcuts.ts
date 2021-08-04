import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { useKeyboard } from "./useKeyboard";

export function useShortcuts(): void {
  const [_, toggleTheme] = useContext(ThemeContext);
  useKeyboard((e) => e.metaKey && e.code === "Semicolon", toggleTheme);
}

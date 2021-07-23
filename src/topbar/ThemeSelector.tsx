import Toggle from "@awsui/components-react/toggle";
import * as React from "react";
import { useContext, useEffect } from "react";
import { useKeyboard } from "../common/useKeyboard";
import { ThemeContext } from "../core/ThemeProvider";

export function ThemeSelector() {
  const [theme, toggleTheme] = useContext(ThemeContext);
  useKeyboard((e) => e.metaKey && e.code === "Semicolon", toggleTheme);

  return (
    <div className="theme-toggle">
      <Toggle
        className="toggle"
        checked={theme === "dark"}
        onChange={toggleTheme}
      >
        Dark Mode
      </Toggle>
    </div>
  );
}

import Toggle from "@awsui/components-react/toggle";
import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";

export function ThemeSelector(): JSX.Element {
  const [theme, toggleTheme] = useContext(ThemeContext);

  return (
    <div className="theme-toggle">
      <Toggle
        className="toggle"
        checked={theme === "dark"}
        onChange={toggleTheme}
      >
        Dark Mode <span className="shortcut">(cmd + ;)</span>
      </Toggle>
    </div>
  );
}

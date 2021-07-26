import { Spinner } from "@awsui/components-react";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useToggle } from "../common/useToggle";

type Theme = "light" | "dark";

type ThemeContextReturn = [Theme, () => void];

export const ThemeContext = React.createContext<ThemeContextReturn>([
  "light",
  () => {},
]);

interface Props {
  className?: string;
}

async function getOSTheme(): Promise<Theme> {
  // Getting OS Theme from Electron:
  // https://www.electronjs.org/docs/tutorial/dark-mode
  let timeout = 3; // seconds

  while (!window.darkMode) {
    if (timeout === 0) return "light";

    await new Promise((resolve) => setTimeout(resolve, 1000));
    timeout--;
  }

  const darkMode = await window.darkMode();

  return darkMode ? "dark" : "light";
}

export default function ThemeProvider(props: React.PropsWithChildren<Props>) {
  const { children, className } = props;
  const [initialTheme, setInitialTheme] = useState<Theme | null>(null);
  const otherTheme = initialTheme === "light" ? "dark" : "light";

  const [isInitial, toggle] = useToggle(true);

  useEffect(() => {
    const fetchDarkMode = async () => {
      const OSTheme = await getOSTheme();
      setInitialTheme(OSTheme);
    };

    fetchDarkMode();
  }, [setInitialTheme, window.darkMode]);

  if (initialTheme === null) {
    return (
      <div className="spinner">
        <Spinner size="large" />
      </div>
    );
  }

  const theme = isInitial ? initialTheme : otherTheme;

  return (
    <ThemeContext.Provider value={[theme, toggle]}>
      <div className={`${className} ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
}

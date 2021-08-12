import { Spinner } from "@awsui/components-react";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { usePersistedState } from "../common/hooks/usePersistedState";

type Theme = "light" | "dark";

type ThemeContextReturn = [Theme, () => void];

export const ThemeContext = React.createContext<ThemeContextReturn>([
  "light",
  () => {
    throw new Error();
  },
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

const WORKBENCH_THEME_STORAGE_KEY = "aws-qldb-workbench-theme";

export default function ThemeProvider(
  props: React.PropsWithChildren<Props>
): JSX.Element {
  const { children, className } = props;
  const [theme, setTheme] = usePersistedState<Theme | null>(
    WORKBENCH_THEME_STORAGE_KEY,
    null
  );

  const toggle = useCallback(() => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }, [setTheme]);

  useEffect(() => {
    if (theme !== null) return;

    const fetchDarkMode = async () => {
      const OSTheme = await getOSTheme();
      setTheme(OSTheme);
    };

    fetchDarkMode();
  }, [setTheme, theme]);

  if (theme === null) {
    return (
      <div className="spinner">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={[theme, toggle]}>
      <div className={`${className} awsui-${theme}-mode`}>{children}</div>
    </ThemeContext.Provider>
  );
}

import { QldbDriver } from "amazon-qldb-driver-js";
import * as React from "react";
import { usePersistedState } from "../common/hooks/usePersistedState";
import ThemeProvider from "./ThemeProvider";

interface Props {
  className?: string;
}

interface AppState {
  credentials: { accessKeyId?: string; secretAccessKey?: string };
  ledger?: string;
  region: string;
  drivers: { [ledger: string]: QldbDriver };
}

const initialState: AppState = {
  credentials: {},
  region: "us-east-1",
  drivers: {},
};

const APP_STATE_STORAGE_KEY = "aws-qldb-workbench-app-state";

export const AppStateContext = React.createContext<
  [AppState, React.Dispatch<React.SetStateAction<AppState>>]
>([
  initialState,
  () => {
    throw new Error();
  },
]);

export default function AppStateProvider(
  props: React.PropsWithChildren<Props>
): JSX.Element {
  const { children, className } = props;
  const [state, setState] = usePersistedState<AppState>(
    APP_STATE_STORAGE_KEY,
    initialState,
    ["credentials", "region", "ledger"]
  );

  return (
    <ThemeProvider className={className}>
      <AppStateContext.Provider value={[state, setState]}>
        {children}
      </AppStateContext.Provider>
    </ThemeProvider>
  );
}

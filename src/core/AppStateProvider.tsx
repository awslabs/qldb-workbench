import { QldbDriver } from "amazon-qldb-driver-js";
import * as React from "react";
import { PageName } from "../common/hooks/usePage";
import { usePersistedState } from "../common/hooks/usePersistedState";
import { TabState } from "../common/hooks/useTabs";
import { RecentQuery } from "../features/recent/Recent";
import { SavedQuery } from "../features/saved/Saved";
import ThemeProvider from "./ThemeProvider";

interface Props {
  className?: string;
}

interface AppState {
  credentials: { accessKeyId?: string; secretAccessKey?: string };
  ledger?: string;
  region: string;
  drivers: { [ledger: string]: QldbDriver };
  tabs: TabState;
  currentPage: PageName;
  queries: {
    recent: RecentQuery[];
    saved: SavedQuery[];
  };
}

const initialState: AppState = {
  credentials: {},
  region: "us-east-1",
  drivers: {},
  tabs: {
    activeTab: "query1",
    allTabs: {
      query1: {
        id: "query1",
        label: "Query 1",
      },
    },
  },
  currentPage: "editor",
  queries: {
    recent: [],
    saved: [],
  },
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
    ["credentials", "region", "ledger", "tabs", "queries"]
  );

  return (
    <ThemeProvider className={className}>
      <AppStateContext.Provider value={[state, setState]}>
        {children}
      </AppStateContext.Provider>
    </ThemeProvider>
  );
}

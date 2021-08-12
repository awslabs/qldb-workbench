import * as React from "react";
import { useCallback, useContext } from "react";
import { PageName } from "../../common/hooks/usePage";
import { AppStateContext } from "../../core/AppStateProvider";
import { NavButton } from "./NavButton";

import "./styles.scss";

export function Navigation(): React.ReactElement {
  const [{ currentPage: page }, setAppState] = useContext(AppStateContext);

  const changePage = useCallback(
    (page: PageName) => () =>
      setAppState((state) => ({ ...state, currentPage: page })),
    [setAppState]
  );

  return (
    <nav className="navigation">
      <NavButton
        name="edit"
        selected={page === "editor"}
        onClick={changePage("editor")}
      >
        Editor
      </NavButton>
      <NavButton
        name="status-in-progress"
        selected={page === "recent"}
        onClick={changePage("recent")}
      >
        Recent
      </NavButton>
      <NavButton
        name="folder"
        selected={page === "saved"}
        onClick={changePage("saved")}
      >
        Saved
      </NavButton>
      <NavButton
        name="key"
        selected={page === "verification"}
        onClick={changePage("verification")}
      >
        Verification
      </NavButton>
      <NavButton
        name="settings"
        selected={page === "settings"}
        onClick={changePage("settings")}
      >
        Settings
      </NavButton>
      <NavButton
        name="envelope"
        selected={page === "feedback"}
        onClick={changePage("feedback")}
      >
        Feedback
      </NavButton>
    </nav>
  );
}

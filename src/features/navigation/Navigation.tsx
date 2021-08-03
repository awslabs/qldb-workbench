import * as React from "react";
import { useContext } from "react";
import { PageContext } from "../../common/components/Pages";
import { NavButton } from "./NavButton";

import "./styles.scss";

export function Navigation(): React.ReactElement {
  const [page, onPageChange] = useContext(PageContext);

  return (
    <nav className="navigation">
      <NavButton
        name="edit"
        selected={page === "editor"}
        onClick={() => onPageChange("editor")}
      >
        Editor
      </NavButton>
      <NavButton
        name="status-in-progress"
        selected={page === "recent"}
        onClick={() => onPageChange("recent")}
      >
        Recent
      </NavButton>
      <NavButton
        name="folder"
        selected={page === "saved"}
        onClick={() => onPageChange("saved")}
      >
        Saved
      </NavButton>
      <NavButton
        name="key"
        selected={page === "verification"}
        onClick={() => onPageChange("verification")}
      >
        Verification
      </NavButton>
      <NavButton
        name="settings"
        selected={page === "settings"}
        onClick={() => onPageChange("settings")}
      >
        Settings
      </NavButton>
      <NavButton
        name="envelope"
        selected={page === "feedback"}
        onClick={() => onPageChange("feedback")}
      >
        Feedback
      </NavButton>
    </nav>
  );
}

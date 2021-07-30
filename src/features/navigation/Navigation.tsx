import * as React from "react";
import { Page } from "../../common/hooks/usePage";
import { NavButton } from "./NavButton";

import "./styles.scss";

interface Props {
  page: Page;
  onPageChange: React.Dispatch<React.SetStateAction<Page>>;
}

export function Navigation(props: Props): React.ReactElement {
  const { page, onPageChange } = props;

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

import * as React from "react";
import { useContext } from "react";
import { PropsWithChildren } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import { PageName } from "../hooks/usePage";

interface Props {
  name: PageName;
  persistent?: boolean;
}

export function Page(props: PropsWithChildren<Props>): JSX.Element {
  const { name, persistent, children } = props;
  const [{ currentPage }] = useContext(AppStateContext);
  const isActive = currentPage === name;

  return (
    <div style={{ display: isActive ? "initial" : "none" }}>
      {(persistent || isActive) && children}
    </div>
  );
}

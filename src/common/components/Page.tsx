import * as React from "react";
import { useContext } from "react";
import { PropsWithChildren } from "react";
import { PageName } from "../hooks/usePage";
import { PageContext } from "./Pages";

interface Props {
  name: PageName;
  persistent?: boolean;
}

export function Page(props: PropsWithChildren<Props>): JSX.Element {
  const { name, persistent, children } = props;
  const [currentPage] = useContext(PageContext);
  const isActive = currentPage === name;

  return (
    <div style={{ display: isActive ? "initial" : "none" }}>
      {(persistent || isActive) && children}
    </div>
  );
}

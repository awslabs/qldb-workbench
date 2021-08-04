import * as React from "react";
import { useContext } from "react";
import { PropsWithChildren } from "react";
import { PageName } from "../hooks/usePage";
import { PageContext } from "./Pages";

interface Props {
  name: PageName;
}

export function Page(props: PropsWithChildren<Props>): JSX.Element {
  const { name, children } = props;
  const [currentPage] = useContext(PageContext);

  return (
    <div style={{ display: currentPage === name ? "initial" : "none" }}>
      {children}
    </div>
  );
}

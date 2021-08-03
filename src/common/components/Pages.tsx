import * as React from "react";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { PageName, usePage } from "../hooks/usePage";

interface Props {
  defaultPage: PageName;
}

export const PageContext = React.createContext<
  [PageName, Dispatch<SetStateAction<PageName>>]
>(["editor", () => {}]);

export function Pages(props: PropsWithChildren<Props>) {
  const { defaultPage, children } = props;
  const pageState = usePage(defaultPage);

  return (
    <PageContext.Provider value={pageState}>{children}</PageContext.Provider>
  );
}

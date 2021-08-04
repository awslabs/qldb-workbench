import * as React from "react";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { PageName, usePage } from "../hooks/usePage";

interface Props {
  defaultPage: PageName;
}

export const PageContext = React.createContext<
  [PageName, Dispatch<SetStateAction<PageName>>]
>([
  "editor",
  () => {
    throw new Error();
  },
]);

export function Pages(props: PropsWithChildren<Props>): JSX.Element {
  const { defaultPage, children } = props;
  const pageState = usePage(defaultPage);

  return (
    <PageContext.Provider value={pageState}>{children}</PageContext.Provider>
  );
}

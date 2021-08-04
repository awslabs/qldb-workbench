import { BreadcrumbGroup } from "@awsui/components-react";
import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { FlexContainer } from "../../../common/components/FlexContainer";
import { useBreadcrumbs } from "../../../common/hooks/useBreadcrumbs";
import { AppStateContext } from "../../../core/AppStateProvider";
import { LedgersList } from "./LedgersList";

import "./styles.scss";
import { TablesList } from "./TablesList";

export function EditorPannel(): JSX.Element {
  const [showTables, setShowTables] = useState(false);
  const { breadcrumbs, addBreadcrumb, removeBreadcrumbs } = useBreadcrumbs(
    "Ledgers",
    (item) => item.level === 0 && setShowTables(false)
  );
  const [{ ledger }] = useContext(AppStateContext);

  useEffect(() => {
    if (!showTables || !ledger) {
      removeBreadcrumbs(0);
    }
    if (!ledger) setShowTables(false);
  }, [ledger, removeBreadcrumbs, showTables]);

  return (
    <FlexContainer
      header={
        <BreadcrumbGroup
          items={breadcrumbs}
          onClick={({ detail }) => detail.item.onClick(detail.item)}
        />
      }
      handle={{ direction: "vertical", position: "end" }}
      containerProps={{ disableContentPaddings: true }}
    >
      {showTables ? (
        <TablesList />
      ) : (
        <>
          <LedgersList
            onClick={(ledger) => {
              setShowTables(true);
              addBreadcrumb(ledger);
            }}
          />
        </>
      )}
    </FlexContainer>
  );
}

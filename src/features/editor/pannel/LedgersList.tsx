import { Link } from "@awsui/components-react";
import * as React from "react";
import { useCallback } from "react";
import {
  ColumnRendererProps,
  ItemsList,
} from "../../../common/components/ItemsList";
import { useLedgers } from "../../../common/hooks/useLedgers";
import { LedgerDetails } from "./LedgerDetails";

import "./styles.scss";

interface Props {
  onClick: (ledger: string) => void;
}

export function LedgersList(props: Props): JSX.Element {
  const { loading, loadingDetails, selectedLedger, ledgers, selectLedger } =
    useLedgers();
  const { onClick } = props;

  const handleClick = useCallback(
    (ledger: string) => {
      selectLedger(ledger);
      onClick(ledger);
    },
    [onClick, selectLedger]
  );
  const NameColumn = useCallback(
    ({ value }: ColumnRendererProps) => (
      <Link onFollow={() => handleClick(value)}>{value}</Link>
    ),
    [handleClick]
  );

  return (
    <>
      <ItemsList
        header="ledger"
        loading={loading}
        items={ledgers.map((l) => ({ name: l }))}
        columns={[
          {
            fieldName: "name",
            renderer: NameColumn,
          },
        ]}
        selectedItem={{ name: selectedLedger?.Name ?? "" }}
        selectItem={(item) => selectLedger(item?.name ?? "")}
      />
      {(selectedLedger || loadingDetails) && (
        <LedgerDetails
          loading={loadingDetails ?? false}
          ledger={selectedLedger}
        />
      )}
    </>
  );
}

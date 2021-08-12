import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { ItemsList } from "../../../common/components/ItemsList";
import { useQLDB } from "../../../common/hooks/useQLDB";
import { AppStateContext } from "../../../core/AppStateProvider";

import "./styles.scss";
import { TableDetails } from "./TableDetails";

export function TablesList(): JSX.Element {
  const [{ ledger }] = useContext(AppStateContext);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { query } = useQLDB(ledger ?? "");

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);

      try {
        const result = await query((driver) => driver.getTableNames());

        if (result.error) return;

        setTables(result.results);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [query]);

  return (
    <>
      <ItemsList
        header="tables"
        selectedItem={{ name: selectedTable ?? "" }}
        loading={loading}
        items={tables.map((t) => ({ name: t }))}
        columns={["name"]}
        selectItem={(item) => setSelectedTable(item?.name)}
      />
      {ledger && selectedTable && (
        <TableDetails ledger={ledger} table={selectedTable} />
      )}
    </>
  );
}

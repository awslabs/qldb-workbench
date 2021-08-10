import * as React from "react";

import "./styles.scss";
import { ItemsList } from "../../common/components/ItemsList";
import { StatusIcon } from "../../common/components/StatusIcon";
import { useState } from "react";

interface RecentQuery {
  query: string;
  status: string;
  ledger: string;
  createdAt: string;
}

export function Recent(): JSX.Element {
  const recents: RecentQuery[] = [
    {
      query: "Select * from Cars;",
      status: "SUCCESS",
      ledger: "TestLedger",
      createdAt: new Date().toDateString(),
    },
    {
      query: "Select * from Person;",
      status: "SUCCESS",
      ledger: "TestLedger",
      createdAt: new Date().toDateString(),
    },
  ];
  const [selected, setSelected] = useState<RecentQuery[]>([]);

  return (
    <div className="recent-container">
      <ItemsList
        header="recent"
        headerPlural="recent"
        loading={false}
        items={recents}
        selectedItem={selected}
        selectItem={(items) => setSelected(items ?? [])}
        columns={[
          "query",
          { fieldName: "status", renderer: StatusIcon },
          "ledger",
          {
            fieldName: "createdAt",
            header: "Creation Time",
          },
        ]}
      />
    </div>
  );
}

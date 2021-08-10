import * as React from "react";

import "./styles.scss";
import { ItemsList } from "../../common/components/ItemsList";
import { StatusIcon } from "../../common/components/StatusIcon";
import { useState, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import { useRecentQueries } from "../../common/hooks/useRecentQueries";

export interface RecentQuery {
  query: string;
  status: string;
  ledger: string;
  createdAt: string;
}

export function Recent(): JSX.Element {
  const { recentQueries } = useRecentQueries();
  const [selected, setSelected] = useState<RecentQuery[]>([]);

  return (
    <div className="recent-container">
      <ItemsList
        header="recent queries"
        loading={false}
        items={recentQueries}
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

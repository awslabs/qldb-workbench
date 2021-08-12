import * as React from "react";

import "./styles.scss";
import {
  ColumnRendererProps,
  ItemsList,
} from "../../common/components/ItemsList";
import { StatusIcon } from "../../common/components/StatusIcon";
import { useCallback, useContext, useState } from "react";
import { useRecentQueries } from "../../common/hooks/useRecentQueries";
import { Button, SpaceBetween } from "@awsui/components-react";
import { useTabs } from "../../common/hooks/useTabs";
import { AppStateContext } from "../../core/AppStateProvider";

export interface RecentQuery {
  id: string;
  query: string;
  status: string;
  ledger: string;
  createdAt: string;
}

const QueryColumn: React.FC<ColumnRendererProps> = ({
  value,
}: ColumnRendererProps) => <>{value.split("\n")[0].slice(0, 50)}</>;

export function Recent(): JSX.Element {
  const { recentQueries, removeRecentQueries } = useRecentQueries();
  const [selected, setSelected] = useState<RecentQuery[]>([]);
  const { createNewTab } = useTabs();
  const [_, setAppState] = useContext(AppStateContext);

  const handleDelete = useCallback(() => {
    removeRecentQueries(selected.map((q) => q.id));
  }, [removeRecentQueries, selected]);

  const handleRunQuery = useCallback(() => {
    setAppState((state) => ({ ...state, currentPage: "editor" }));
    createNewTab({
      content: selected.map((s) => s.query.replace(/;+$/, "")).join(";\n"),
    });
  }, [createNewTab, selected, setAppState]);

  return (
    <div className="recent-container">
      <ItemsList
        header="recent queries"
        loading={false}
        items={recentQueries}
        selectedItem={selected}
        selectItem={(items) => setSelected(items ?? [])}
        trackBy="id"
        columns={[
          { fieldName: "query", renderer: QueryColumn },
          { fieldName: "status", renderer: StatusIcon },
          "ledger",
          { fieldName: "createdAt", header: "Creation Time" },
        ]}
        actions={
          <SpaceBetween size="s" direction="horizontal">
            <Button disabled={selected.length === 0} onClick={handleDelete}>
              Delete
            </Button>
            <Button
              disabled={selected.length === 0}
              variant="primary"
              onClick={handleRunQuery}
            >
              Run query
            </Button>
          </SpaceBetween>
        }
      />
    </div>
  );
}

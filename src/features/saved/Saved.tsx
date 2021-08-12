import * as React from "react";

import "./styles.scss";
import {
  ColumnRendererProps,
  ItemsList,
} from "../../common/components/ItemsList";
import { useCallback, useContext, useState } from "react";
import { useSavedQueries } from "../../common/hooks/useSavedQueries";
import {
  Button,
  Input,
  NonCancelableCustomEvent,
  SpaceBetween,
} from "@awsui/components-react";
import { useTabs } from "../../common/hooks/useTabs";
import { AppStateContext } from "../../core/AppStateProvider";
import { BaseChangeDetail } from "@awsui/components-react/input/interfaces";

export interface SavedQuery {
  id: string;
  query: string;
  description: string | undefined;
  ledger: string;
  createdAt: string;
}

const InputColumn: React.FC<ColumnRendererProps<SavedQuery>> = ({
  value,
  item,
}: ColumnRendererProps<SavedQuery>) => {
  const { editSavedQuery } = useSavedQueries();
  const handleDescriptionChange = useCallback(
    (id: string) => (e: NonCancelableCustomEvent<BaseChangeDetail>) => {
      editSavedQuery(id, { description: e.detail.value });
    },
    [editSavedQuery]
  );
  const [editable, setEditable] = useState(!value);

  if (!editable) {
    return <span onClick={() => setEditable(true)}>{value}</span>;
  }

  return (
    <Input
      autoFocus={true}
      value={value}
      onChange={handleDescriptionChange(item.id)}
      onBlur={() => {
        editSavedQuery(item.id, { description: value || "-" });
        setEditable(false);
      }}
    />
  );
};

export function Saved(): JSX.Element {
  const { savedQueries, removeSavedQueries } = useSavedQueries();
  const [selected, setSelected] = useState<SavedQuery[]>([]);
  const { createNewTab } = useTabs();
  const [_, setAppState] = useContext(AppStateContext);

  const handleDelete = useCallback(() => {
    removeSavedQueries(selected.map((q) => q.id));
  }, [removeSavedQueries, selected]);

  const handleRunQuery = useCallback(() => {
    setAppState((state) => ({ ...state, currentPage: "editor" }));
    createNewTab({
      content: selected.map((s) => s.query.replace(/;+$/, "")).join(";\n"),
    });
  }, [createNewTab, selected, setAppState]);

  return (
    <div className="saved-container">
      <ItemsList
        header="saved queries"
        loading={false}
        items={savedQueries}
        selectedItem={selected}
        selectItem={(items) => setSelected(items ?? [])}
        trackBy="id"
        resizableColumns
        columns={[
          "query",
          {
            fieldName: "description",
            renderer: InputColumn,
          },
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

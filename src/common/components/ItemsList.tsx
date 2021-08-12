import {
  Box,
  Header,
  Pagination,
  Table,
  TextFilter,
} from "@awsui/components-react";
import * as React from "react";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/stringUtils";

import "./styles.scss";

export interface ColumnRendererProps<T = never> {
  item: T;
  value: string;
}

type SimpleColumn<T> = keyof T;
type ComplexColumn<T> = {
  fieldName: keyof T;
  header?: string;
  renderer?: React.FC<ColumnRendererProps<T>>;
};
type Column<T> = SimpleColumn<T> | ComplexColumn<T>;

interface Props<T, I extends T | T[]> {
  header: string;
  loading: boolean;
  items: T[];
  selectedItem?: I;
  trackBy?: keyof T;
  resizableColumns?: boolean;
  /**
   * Columns can be either an array of string, where the string represents the
   * fields of the object to be displayed as a column;
   * Or an array of ComplexColumn object containing different values for
   * the fieldName, header and a renderer component used to render the value of
   * the column.
   */
  columns: Column<T>[];
  actions?: React.ReactElement;
  selectItem?: (item?: I) => void;
}

/**
 * @param col A column definition in the format of a string (SimpleColumn) where
 * the value of the string represents both the name of the field and the header
 * of the column.
 * Or a ComplexColumn object with header and renderer optional.
 * @returns A ComplexColumn with all fields guaranteed to be not undefined.
 */
function toComplexColumn<T>(col: Column<T>): Required<ComplexColumn<T>> {
  return {
    fieldName: typeof col !== "object" ? col : col.fieldName,
    header: capitalizeFirstLetter(
      String(typeof col !== "object" ? col : col.fieldName)
    ),
    renderer: function Column({ value }: ColumnRendererProps<T>) {
      return <>{value}</>;
    },
    ...(typeof col !== "object" ? {} : col),
  };
}

export function ItemsList<
  T extends Record<keyof T, string | undefined>,
  I extends T | T[]
>(props: Props<T, I>): JSX.Element {
  const {
    header,
    loading,
    selectedItem,
    items,
    actions,
    trackBy,
    selectItem,
    resizableColumns,
  } = props;
  const [filter, setFilter] = useState("");
  const filteredItems = items.filter((item) =>
    Object.values(item).some((field: string) =>
      field.toLowerCase().includes(filter.toLowerCase())
    )
  );
  const capitalizedHeader = capitalizeFirstLetter(header);
  const columns = props.columns.map(toComplexColumn);

  return (
    <Table
      trackBy={String(trackBy ?? columns[0].fieldName)}
      ariaLabels={{
        selectionGroupLabel: `${capitalizedHeader} selection`,
        itemSelectionLabel: ({ selectedItems }, item) => {
          const isItemSelected = selectedItems.includes(item);

          return `${item} is ${isItemSelected ? "" : "not"} selected`;
        },
      }}
      columnDefinitions={columns.map((col) => ({
        id: String(col.fieldName),
        header: col.header,
        cell: function Cell(item: T) {
          return <col.renderer item={item} value={item[col.fieldName] ?? ""} />;
        },
        sortingField: String(col.fieldName),
      }))}
      items={filteredItems}
      loading={loading}
      loadingText={`Loading ${header}`}
      selectedItems={
        Array.isArray(selectedItem)
          ? selectedItem
          : selectedItem && [selectedItem]
      }
      selectionType={
        selectedItem && Array.isArray(selectedItem) ? "multi" : "single"
      }
      empty={
        <Box textAlign="center" color="inherit">
          <b>No {header}</b>
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No {header} to display.
          </Box>
        </Box>
      }
      filter={
        <TextFilter
          filteringText={filter}
          onChange={({ detail }) => setFilter(detail.filteringText)}
          filteringPlaceholder={`Find ${header}`}
        />
      }
      header={
        <div className="split-2">
          <Header counter={`(${items.length})`}>{capitalizedHeader}</Header>
          {actions}
        </div>
      }
      pagination={
        <Pagination
          currentPageIndex={1}
          pagesCount={1}
          ariaLabels={{
            nextPageLabel: "Next page",
            previousPageLabel: "Previous page",
            pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
          }}
        />
      }
      onSelectionChange={({ detail }) =>
        selectItem?.(
          Array.isArray(selectedItem)
            ? (detail.selectedItems as T[])
            : detail.selectedItems[0]
        )
      }
      resizableColumns={resizableColumns}
    />
  );
}

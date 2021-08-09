import {
  Box,
  Header,
  Link,
  Pagination,
  Table,
  TextFilter,
} from "@awsui/components-react";
import * as React from "react";
import { useState } from "react";
import { capitalizeFirstLetter } from "../utils/stringUtils";

import "./styles.scss";

interface Props<T> {
  header?: string;
  headerPlural?: string;
  loading: boolean;
  items: T[];
  selectedItem?: T;
  /**
   * Columns can be either an array of string, where the string represents the
   * fields of the object to be displayed as a column;
   * Or an array of pairs, where the left side of the pair is the name of the
   * object's property and the right side is a string to be shown as the header of that field
   */
  columns: (keyof T | [keyof T, string])[];
  selectItem?: (item?: T) => void;
  onClick?: (item: T) => void;
}

/**
 * @param col A column definition in the format of a string representing both
 * the name of the property and the header of the column, or a pair representing
 * the name of the property and a different string header to be displayed
 * @returns A pair of [propertyName, header] - if a pair was not passed in, then
 * one will be created where the left is the property name and the right is the
 * property name with first letter capitalized
 */
function toColumnPair<T>(col: keyof T | [keyof T, string]): [keyof T, string] {
  if (typeof col !== "object") {
    return [col, capitalizeFirstLetter(String(col))];
  }
  return col;
}

export function ItemsList<T extends Record<keyof T, string>>(
  props: Props<T>
): JSX.Element {
  const {
    header,
    headerPlural = `${header}s`,
    loading,
    selectedItem,
    items,
    selectItem,
    onClick,
  } = props;
  const [filter, setFilter] = useState("");
  const filteredItems = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(filter.toLowerCase())
  );
  const capitalizedHeader = capitalizeFirstLetter(header);
  const columns = props.columns.map(toColumnPair);

  return (
    <Table
      trackBy={String(columns[0][0])}
      ariaLabels={{
        selectionGroupLabel: `${capitalizedHeader} selection`,
        itemSelectionLabel: ({ selectedItems }, item) => {
          const isItemSelected = selectedItems[0] === item;

          return `${item} is ${isItemSelected ? "" : "not"} selected`;
        },
      }}
      columnDefinitions={columns.map((col, i) => ({
        id: String(col[0]),
        header: String(col[1]),
        // eslint-disable-next-line react/display-name
        cell: (item: T) =>
          onClick && i === 0 ? (
            <Link onFollow={() => onClick(item)}>{item[col[0]]}</Link>
          ) : (
            item[col[0]]
          ),
        sortingField: String(col[0]),
      }))}
      items={filteredItems}
      loading={loading}
      loadingText={`Loading ${headerPlural}`}
      selectedItems={selectedItem && [selectedItem]}
      selectionType={selectItem && "single"}
      empty={
        <Box textAlign="center" color="inherit">
          <b>No {headerPlural}</b>
          <Box padding={{ bottom: "s" }} variant="p" color="inherit">
            No {headerPlural} to display.
          </Box>
        </Box>
      }
      filter={
        <TextFilter
          filteringText={filter}
          onChange={({ detail }) => setFilter(detail.filteringText)}
          filteringPlaceholder={`Find ${headerPlural}`}
        />
      }
      header={
        <Header counter={`(${items.length})`}>{capitalizedHeader}</Header>
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
      onSelectionChange={({ detail }) => selectItem?.(detail.selectedItems[0])}
    />
  );
}

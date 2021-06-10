import * as React from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  withStyles,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  QueryHistoryEntry,
  replaceHistory,
  SetHistoryFn,
} from "./query-history";

type Props = {
  historyEntry: QueryHistoryEntry;
  historyEntrySelected: (entry: QueryHistoryEntry) => void;
  deleteEntry: (entry: QueryHistoryEntry) => void;
};
const HistoryEntry = ({
  historyEntry,
  historyEntrySelected,
  deleteEntry,
}: Props) => (
  <ListItem button onClick={() => historyEntrySelected(historyEntry)}>
    <ListItemText
      primary={historyEntry.text}
      secondary={
        JSON.stringify(historyEntry.result) +
        `R${historyEntry.queryStats.consumedIOs.readIOs};${historyEntry.queryStats.timingInformation.processingTimeMilliseconds}ms`
      }
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" onClick={() => deleteEntry(historyEntry)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

type HistoryProps = {
  history: QueryHistoryEntry[];
  historyEntrySelected: (entry: QueryHistoryEntry) => void;
  setHistory: SetHistoryFn;
};
export default withStyles({ root: { fontFamily: "Courier New" } })(
  ({ history, setHistory, historyEntrySelected }: HistoryProps) => {
    return (
      <List dense={true}>
        {[...history].reverse().map((h, index) => {
          return (
            <HistoryEntry
              key={index}
              historyEntry={h}
              historyEntrySelected={historyEntrySelected}
              deleteEntry={(entry) => {
                setHistory((history) => {
                  const newHistory = history.filter((h, i) => i != index);
                  replaceHistory(newHistory);
                  return newHistory;
                });
              }}
            />
          );
        })}
      </List>
    );
  }
);

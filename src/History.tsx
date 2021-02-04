import * as React from "react";
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, withStyles} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {EDITOR_STYLE} from "./App";
import {QueryHistoryEntry} from "./query-history";

const HistoryEntry = ({ historyEntry }: { historyEntry: QueryHistoryEntry}) => <ListItem>
    <ListItemText
        primary={historyEntry.text}
        secondary={JSON.stringify(historyEntry.result) + `R${historyEntry.queryStats.consumedIOs.readIOs};${historyEntry.queryStats.timingInformation.processingTimeMilliseconds}ms`}
    />
    <ListItemSecondaryAction>
        <IconButton edge="end">
            <DeleteIcon fontSize="small" />
        </IconButton>
    </ListItemSecondaryAction>
</ListItem>;

export default withStyles({ root: { fontFamily: "Courier New" }})(({ history }: { history: QueryHistoryEntry[]}) => {
    return <div style={EDITOR_STYLE} className="query-history">
        <List dense={true}>
            {history.map((h, index) => {
                return <HistoryEntry key={index} historyEntry={h}/>
            })}
        </List>
    </div>;
});

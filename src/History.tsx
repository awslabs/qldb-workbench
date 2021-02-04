import * as React from "react";
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, withStyles} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {EDITOR_STYLE} from "./App";

export default withStyles({ root: { fontFamily: "Courier New" }})(() => {
    return <div style={EDITOR_STYLE} className="query-history">
        <List dense={true}>
            <ListItem>
                <ListItemText
                    primary="Single-line item"
                    secondary="stuff"
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    </div>;
});

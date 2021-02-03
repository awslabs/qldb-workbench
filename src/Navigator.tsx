import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 400,
    },
});

export default ({ ledgers } : { ledgers: string[] }) => {
    const classes = useStyles();

        return (
          <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            { ledgers.map((ledger) => {
                return <TreeItem key={"ledger-" + ledger} nodeId={"ledger-" + ledger} label={ledger}>
                    <TreeItem key={"ledger-" + ledger + "-tables"} nodeId={"ledger-" + ledger + "-tables"} label="Tables" />
                </TreeItem>
            })}
          </TreeView>
        );
      };

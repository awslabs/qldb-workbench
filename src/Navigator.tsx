import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { getLedgerMetaData, TableInfo, LedgerInfo } from "./ledger";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import TreeItem from '@material-ui/lab/TreeItem';
import { Box, IconButton, Tooltip } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";



const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export default ({ ledgerNames }: { ledgerNames: string[] }) => {
    const [ledgers, setLedgers] = React.useState<LedgerInfo[]>([])
    const classes = useStyles();
    const [forceRefresh, setForceRefresh] = React.useState(false)
    const [showInactive, setShowInactive] = React.useState(false)

    React.useEffect(() => {
        setForceRefresh(false)
        console.log("Ledger names:", ledgerNames)
        Promise.all(ledgerNames.map(async (ledger) => {
            const m = await getLedgerMetaData(ledger)
            console.log("Loaded metadata", m)
            return m
        }))
            .then(l => {
                console.log(l)
                setLedgers(l);
            })
    }, [ledgerNames, forceRefresh, showInactive])

    return (
        <Box>
            <Tooltip title="Refresh">
                <IconButton onClick={() => setForceRefresh(true)}>
                    <RefreshIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Show inactive items">
                <ToggleButton
                    value="showInactive"
                    selected={showInactive}
                    onChange={() => {
                        setShowInactive(!showInactive);
                    }}
                >
                    <DeleteOutlineIcon />
                </ToggleButton>
            </Tooltip>

            <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {ledgers.map((ledger) => ledgerTreeItem(ledger, showInactive))}
            </TreeView>
        </Box>
    );
};

function ledgerTreeItem(ledger: LedgerInfo, showInactive: boolean): JSX.Element {
    const key = ledger.Name;
    return (<TreeItem key={key} nodeId={key} label={ledger.Name}>{
        ledger
            .tables
            .filter(t => showInactive || t.status == "ACTIVE")
            .map(t => tableTreeItem(t))
    }
    </TreeItem>
    );
}

function tableTreeItem(t: TableInfo): JSX.Element {
    return <TreeItem key={t.tableId} nodeId={t.tableId} label={t.name + (t.status == "INACTIVE" ? " (INACTIVE)" : "")} />
}


import * as React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { getLedgerMetaData, TableInfo } from "./ledger";
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RefreshIcon from '@material-ui/icons/Refresh';
import TreeItem from '@material-ui/lab/TreeItem';
import { Box, Button } from "@material-ui/core";


const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export default ({ ledgerNames }: { ledgerNames: string[] }) => {
    const [ledgers, setLedgers] = React.useState([])
    const classes = useStyles();
    const [forceRefresh, setForceRefresh] = React.useState(false)

    React.useEffect(() => {
        console.log("Ledger names:", ledgerNames)
        setForceRefresh(false)
        Promise.all(ledgerNames.map(async (ledger) => {
            const m = await getLedgerMetaData(ledger)
            console.log("Loaded metadata", m)
            return m
        }))
            .then(l => {
                console.log(l)
                setLedgers(l);
            })
    }, [ledgerNames, forceRefresh])

    return (
        <Box>
        <Button onClick={() => setForceRefresh(true)}>
            <RefreshIcon />
        </Button>
            <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                { ledgers.map((ledger, index) => {
                    const key = index.toString() + ledger.name
                    return (<TreeItem key={key} nodeId={key} label={ledger.name}>
                        <TreeItem key={"t" + key} nodeId={"t" + key} label="Tables">
                            { ledger.tables.map( (t: TableInfo) => {
                                return  <TreeItem key={t.tableId} nodeId={t.tableId} label={t.name}/>
                            }) }
                            </TreeItem>
                    </TreeItem>
                )})}
            </TreeView>
        </Box>
    );
};

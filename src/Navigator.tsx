import * as React from "react";
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { getLedgerMetaData, LedgerInfo, TableInfo } from "./ledger";
import TreeView from '@material-ui/lab/TreeView';
import RefreshIcon from '@material-ui/icons/Refresh';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import { AppBar, Box, IconButton, InputLabel, MenuItem, Select, Toolbar, Tooltip, Typography } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { addCompleterForUserTables } from "./Composer";

const useStyles = makeStyles((theme) => ({
    treeView: {
        height: "100%",
        paddingTop: "5px",
        flexGrow: 1,
        maxWidth: 400,
        marginLeft: 5,
        color: theme.palette.text.secondary,
    },
    panelBox: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.grey[300],
    },
    strikeThrough: {
        textDecoration: "line-through"
    },
    noStrikeThrough: {
        textDecoration: "none"
    }
}));

const qldbRegions = [
    "us-east-2",
    "us-east-1",
    "us-west-2",
    "ap-northeast-2",
    "ap-southeast-1",
    "ap-southeast-2",
    "ap-northeast-1",
    "eu-central-1",
    "eu-west-1"
]

export default ({ ledgerNames, setActiveLedger, setRegion }: { ledgerNames: string[], setActiveLedger: (ledger: string) => void, setRegion: (region: string) => void }) => {
    const [ledgers, setLedgers] = React.useState<LedgerInfo[]>([])
    const classes = useStyles();
    const [forceRefresh, setForceRefresh] = React.useState(false)
    const [refreshActive, setRefreshActive] = React.useState(false)
    const [showInactive, setShowInactive] = React.useState(false)
    const [localActiveLedger, setLocalActiveLedger] = React.useState("") // Keeping local copy to update table name completers on refresh.
    const [localRegion, setLocalRegion] = React.useState("us-east-1")


    function ledgerTreeItem(ledger: LedgerInfo): JSX.Element {
        const key = "ledger-" + ledger.Name;
        return (<StyledTreeItem key={key} nodeId={key} label={ledger.Name}>{
            ledger
                .tables
                .filter(t => showInactive || t.status == "ACTIVE")
                .map(t => tableTreeItem(t))
        }
        </StyledTreeItem>
        );
    }

    function tableTreeItem(t: TableInfo): JSX.Element {
        const isActive = t.status == "ACTIVE"
        return <StyledTreeItem
            key={t.tableId}
            nodeId={t.tableId}
            label={t.name}
            className={isActive ? classes.noStrikeThrough : classes.strikeThrough}
            icon={<ListAltIcon color={isActive ? "inherit" : "disabled"} />}
        />
    }

    const handleRegionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setLocalRegion(event.target.value as string);
    };

    React.useEffect(() => {
        setForceRefresh(false)
        console.log("Ledger names:", ledgerNames)
        Promise.all(ledgerNames.map(async (ledger) => {
            return await getLedgerMetaData(ledger)
        }))
            .then(l => {
                console.log(l)
                setLedgers(l);
                setRefreshActive(true)
            })
    }, [ledgerNames, forceRefresh, showInactive])

    React.useEffect(() => {
        setRefreshActive(false)

        // This loop will be executed 1 or 0 times.
        ledgerNames.filter(n => n == localActiveLedger).forEach(
            ledger => {
                setActiveLedger(ledger)
                getLedgerMetaData(ledger)
                    .then(l => addCompleterForUserTables(l.tables.filter(t => t.status == "ACTIVE").map(t => t.name)));
            }
        )

    }, [localActiveLedger, refreshActive])

    React.useEffect(() => {
        setRegion(localRegion)
        setActiveLedger("")
    }, [localRegion])

    return (
        <Box className={classes.panelBox}>
            <AppBar position="relative">
                <Toolbar variant="dense" style={{ paddingRight: "0px", paddingLeft: "5px" }}>
                    <img src="../assets/amazon-qldb.png" alt="QLDB" height="50" width="50" style={{ paddingRight: "2px" }} />
                    <Typography variant="h6">
                        QLDB
                    </Typography>
                    <Select
                        labelId="region-select-label"
                        id="region-select"
                        value={localRegion}
                        onChange={handleRegionChange}
                        style={{ paddingLeft: "10px" }}
                    >
                        {qldbRegions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}

                    </Select>
                    <div style={{ marginLeft: "auto" }}>
                        <Tooltip title="Refresh">
                            <IconButton onClick={() => setForceRefresh(true)}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Show inactive items">
                            <ToggleButton
                                value="showInactive"
                                selected={showInactive}
                                style={{ border: "none" }}
                                onChange={() => setShowInactive(!showInactive)}
                            >
                                {showInactive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </ToggleButton>
                        </Tooltip>
                        <InputLabel id="region-select-label"></InputLabel>
                    </div>
                </Toolbar>
            </AppBar>
            <TreeView
                className={classes.treeView}
                defaultCollapseIcon={<IndeterminateCheckBoxOutlinedIcon />}
                defaultExpandIcon={<AddBoxOutlinedIcon />}
                defaultEndIcon={<CheckBoxOutlineBlankIcon />}
                onNodeSelect={(event: object, value: string) => {

                    if (value.startsWith("ledger-")) {
                        const ledger = value.substring(7);
                        setLocalActiveLedger(ledger)
                    }
                }}
            >
                {ledgers.map((ledger) => ledgerTreeItem(ledger))}
            </TreeView>
        </Box>
    );
};

const StyledTreeItem = withStyles((theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
    }),
)((props: TreeItemProps) => <TreeItem {...props} />);
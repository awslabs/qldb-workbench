import * as React from "react";
import { createStyles, fade, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { getLedgerMetaData, TableInfo, LedgerInfo } from "./ledger";
import TreeView from '@material-ui/lab/TreeView';
import RefreshIcon from '@material-ui/icons/Refresh';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import {Box, IconButton, Tooltip, Typography} from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { Toolbar } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
    treeView: {
        height: "100%",
        flexGrow: 1,
        maxWidth: 400,
        marginLeft: 5,
        color: theme.palette.text.secondary,
    },
    panelBox: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.grey[300],
    }
}));

export default ({ ledgerNames, setActiveLedger }: { ledgerNames: string[], setActiveLedger: (ledger: string) => void }) => {
    const [ledgers, setLedgers] = React.useState<LedgerInfo[]>([])
    const classes = useStyles();
    const [forceRefresh, setForceRefresh] = React.useState(false)
    const [showInactive, setShowInactive] = React.useState(false)


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
        <Box className={classes.panelBox}>
            <Toolbar>
                <Tooltip title="Refresh">
                    <IconButton onClick={() => setForceRefresh(true)}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Show inactive items">
                    <ToggleButton
                        value="showInactive"
                        selected={showInactive}
                        style={{border: "none"}}
                        onChange={() => setShowInactive(!showInactive)}
                    >
                        {showInactive ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </ToggleButton>
                </Tooltip>
            </Toolbar>
            <TreeView
                className={classes.treeView}
                defaultCollapseIcon={<IndeterminateCheckBoxOutlinedIcon />}
                defaultExpandIcon={<AddBoxOutlinedIcon />}
                defaultEndIcon={<CheckBoxOutlineBlankIcon />}
                onNodeSelect={(event: object, value: string) => {

                    if (value.startsWith("ledger-")) {
                        setActiveLedger(value.substring(7))
                    }
                }}
            >
                {ledgers.map((ledger) => ledgerTreeItem(ledger))}
            </TreeView>
        </Box>
    );
};

function tableTreeItem(t: TableInfo): JSX.Element {
    const isActive = t.status == "ACTIVE"
    return <StyledTreeItem key={t.tableId} nodeId={t.tableId} label={t.name} icon={<ListAltIcon color={isActive ? "inherit" : "disabled"} />} />
}

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
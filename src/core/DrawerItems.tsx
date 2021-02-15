import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TreeView from "@material-ui/lab/TreeView";
import * as React from "react";
import {createStyles, fade, makeStyles, Theme, useTheme, withStyles} from "@material-ui/core/styles";
import {getLedgerMetaData, LedgerInfo, listLedgers, TableInfo} from "./ledger";
import TreeItem, {TreeItemProps} from "@material-ui/lab/TreeItem";
import ListAltIcon from "@material-ui/icons/ListAlt";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {PullToRefresh} from "react-js-pull-to-refresh";
import {PullDownContent, ReleaseContent, RefreshContent} from "react-js-pull-to-refresh";
import {Box, Divider, IconButton, Toolbar, Tooltip, Typography} from "@material-ui/core";
import {addCompleterForUserTables} from "./Composer";
import AWS = require("aws-sdk");
import {drawerWidth} from "./App";
import RefreshIcon from "@material-ui/icons/Refresh";
import {useSnackbar} from "notistack";
import ace from "ace-builds/src-noconflict/ace";

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
        color: theme.palette.text.secondary,
        textDecoration: "line-through"
    },
    noStrikeThrough: {
        color: theme.palette.text.secondary,
        textDecoration: "none"
    },
    stickToBottom: {
        width: drawerWidth,
        position: "fixed",
        bottom: 0,
        textAlign: "center"
    },
    info: {
        color: theme.palette.text.secondary,
    },
    ledgerLabel: {
        color: theme.palette.text.primary
    }
}));

export default ({activeRegion, setActiveLedger, showInactive, forceRefresh, setForceRefresh}:
    {activeRegion: string, setActiveLedger: (ledger: string) => void, showInactive: boolean, forceRefresh: boolean, setForceRefresh: (refresh: boolean) => void}) => {
    const classes = useStyles();
    const theme = useTheme()
    const [ledgers, setLedgers] = React.useState<LedgerInfo[]>([])
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    React.useEffect(() => {
        AWS.config.update({region: activeRegion});
        const fetchLedgers = async () => listLedgers(enqueueSnackbar).then(results => Promise.all(results.map(async ledger => await getLedgerMetaData(ledger, enqueueSnackbar))).then(l => setLedgers(l)));
        fetchLedgers().then(() => {
           if(forceRefresh) enqueueSnackbar("Ledgers updated.", {variant: "success"})
        });
        setForceRefresh(false)
    }, [forceRefresh, activeRegion]);

    const ledgerTreeItem = (ledger: LedgerInfo): JSX.Element => {
        const key = "ledger-" + ledger.Name;
        return (
            <StyledTreeItem key={key} nodeId={key} label={ledger.Name} className={classes.ledgerLabel}>{
                ledger
                    .tables
                    .filter(t => showInactive || t.status == "ACTIVE")
                    .map(t => tableTreeItem(t))
            }
            </StyledTreeItem>
        );
    };

    const tableTreeItem = (t: TableInfo): JSX.Element => {
        const isActive = t.status == "ACTIVE"
        return <StyledTreeItem
            key={t.tableId}
            nodeId={t.tableId}
            label={t.name}
            className={isActive ? classes.noStrikeThrough : classes.strikeThrough}
            icon={<ListAltIcon color={isActive ? "inherit" : "disabled"} />}
            onClick={() => {
                const editor = ace.edit("aceEditor1");
                const currentValue = editor.getValue();
                editor.setValue(`${currentValue ? `${currentValue}\n` : ""}select * from ${t.name}`)
            }}
        >
            {t.indexes.map(i =>
                <StyledTreeItem
                    key={i.indexId}
                    nodeId={i.indexId}
                    label={i.expr}
                    icon={<KeyboardArrowRightIcon />}
                />
            )}
        </StyledTreeItem>
    };

    function onRefresh() {
        return new Promise((resolve) => {
            setForceRefresh(true);
            setTimeout(resolve, 1000)
        });
    }

    return (
        <Box>
            <PullToRefresh
                pullDownContent={<PullDownContent />}
                releaseContent={<ReleaseContent />}
                refreshContent={<RefreshContent />}
                pullDownThreshold={50}
                onRefresh={onRefresh}
                triggerHeight={50}
                backgroundColor={theme.palette.background.paper}>
                <Box minHeight={500} style={{background: "inherit"}}>
                    <TreeView
                        className={classes.treeView}
                        defaultCollapseIcon={<IndeterminateCheckBoxOutlinedIcon />}
                        defaultExpandIcon={<AddBoxOutlinedIcon />}
                        defaultEndIcon={<CheckBoxOutlineBlankIcon />}
                        onNodeSelect={(event: object, value: string) => {
                            if (value.startsWith("ledger-")) {
                                const ledger = value.substring(7);
                                setActiveLedger(ledger)
                                getLedgerMetaData(ledger).then(l => addCompleterForUserTables(l.tables.filter(t => t.status == "ACTIVE").map(t => t.name)))
                            }
                        }}
                    >
                        {ledgers.map((ledger) => ledgerTreeItem(ledger))}
                    </TreeView>
                    <Toolbar />
                </Box>
            </PullToRefresh>
            <Box className={classes.stickToBottom}>
                <Divider light={true}/>
                <Box component="div" display="inline" className={classes.info}>Pull down to refresh</Box>
                <Tooltip title="Refresh ledgers">
                    <IconButton size={"medium"} aria-label="refresh" onClick={() => setForceRefresh(true)}> <RefreshIcon /> </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
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
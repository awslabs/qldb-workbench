import IndeterminateCheckBoxOutlinedIcon from "@material-ui/icons/IndeterminateCheckBoxOutlined";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import TreeView from "@material-ui/lab/TreeView";
import * as React from "react";
import {createStyles, fade, makeStyles, Theme, useTheme, withStyles} from "@material-ui/core/styles";
import {createLedger, deleteLedger, getLedgerMetaData, LedgerInfo, listLedgers, TableInfo} from "./ledger";
import TreeItem, {TreeItemProps} from "@material-ui/lab/TreeItem";
import ListAltIcon from "@material-ui/icons/ListAlt";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import {PullDownContent, PullToRefresh, RefreshContent, ReleaseContent} from "react-js-pull-to-refresh";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery
} from "@material-ui/core";
import {addCompleterForUserTables} from "./Composer";
import {drawerWidth} from "./App";
import RefreshIcon from "@material-ui/icons/Refresh";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {useSnackbar} from "notistack";
import ace from "ace-builds/src-noconflict/ace";
import AWS = require("aws-sdk");
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useConfirm } from "material-ui-confirm";

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
    },
    ledgerLabelSecondary: {
        color: theme.palette.text.secondary
    },
    twoThirdColumn: {
        flexBasis: '66.66%',
    },
    helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: theme.spacing(1, 2),
        flexBasis: '33.33%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
}));

const BreakException = {}

export default ({activeRegion, setActiveLedger, showInactive, forceRefresh, setForceRefresh, activeLedger}:
    {activeRegion: string, setActiveLedger: (ledger: string) => void, showInactive: boolean, forceRefresh: boolean, setForceRefresh: (refresh: boolean) => void, activeLedger: string}) => {
    const classes = useStyles();
    const theme = useTheme()
    const confirm = useConfirm();

    const [ledgers, setLedgers] = React.useState<LedgerInfo[]>([])
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [dialogOpen, setDialogOpen] = React.useState(false)
    const ledgerNameRef = React.createRef<HTMLInputElement>()
    const ledgerTagsRef = React.createRef<HTMLInputElement>()
    const [deletionProtection, setDeletionProtection] = React.useState(false);

    const handleDialogOpen = () => setDialogOpen(true)
    const handleDialogClose = () => setDialogOpen(false)
    const handleDeletionProtectionChange = (event: React.ChangeEvent<HTMLInputElement>) => setDeletionProtection(event.target.checked)
    const handleDeleteLedger = () => {
        activeLedger
            ? confirm({title: "Delete Ledger", description: `This will permanently delete ledger ${activeLedger}.`})
                .then(() => deleteLedger(activeLedger, enqueueSnackbar).then(() => setForceRefresh(true)))
                .catch(() => console.log("Deletion cancelled."))
            : enqueueSnackbar("Nothing to delete", {variant: "info"})
    }

    React.useEffect(() => {
        AWS.config.update({region: activeRegion});
        const fetchLedgers = async () => {
            const ledgers = await listLedgers(enqueueSnackbar);
            const ledgerInfos = await Promise.all(ledgers.map(async ledger => {
                return await getLedgerMetaData(ledger, enqueueSnackbar);
            }));
            setLedgers(ledgerInfos);
        };
        fetchLedgers().then(() => {
           if(forceRefresh) enqueueSnackbar("Ledgers updated.", {variant: "success"})
        });
        setForceRefresh(false)
    }, [forceRefresh, activeRegion]);

    function tablesOf(ledger: LedgerInfo) {
        const tables = ledger.tables;
        if (tables) {
            return tables
                .filter(t => showInactive || t.status == "ACTIVE")
                .map(t => tableTreeItem(t));
        }
        return <></>;
    }

    const ledgerTreeItem = (ledger: LedgerInfo): JSX.Element => {
        const key = "ledger-" + ledger.Name;
        return (
            <StyledTreeItem key={key} nodeId={key} label={ledger.Name} className={ledger.State === "CREATING" ? classes.ledgerLabelSecondary : classes.ledgerLabel}>{
                tablesOf(ledger)
            }
            </StyledTreeItem>
        );
    };

    const handleCreateLedger = () => {
        const currentLedgerName = ledgerNameRef.current;
        if (!currentLedgerName || !currentLedgerName.value) {
            enqueueSnackbar("Ledger name is required.", {variant:"error"})
            return;
        }
        let tags: {[key: string]: string} = {}
        try {
            if (ledgerTagsRef.current) {
                ledgerTagsRef.current.value.split(" ").forEach(val => {
                    const key = val.split("=")[0]
                    const value = val.split("=")[1];
                    if ((key && !value) || (!key && value)) throw BreakException
                    tags[key] = value
                });
            }
        } catch (e) {
            if (e === BreakException) {
                enqueueSnackbar("Check supplied tags", {variant: "error"}); return;
            }
        }
        createLedger(currentLedgerName.value, deletionProtection, tags, enqueueSnackbar)
        setDialogOpen(false)
    }

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
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box>
            <Dialog fullScreen={fullScreen} open={dialogOpen} onClose={handleDialogClose}
                    aria-labelledby={"Form-dialog-title"}>
                <DialogTitle id={"Form-dialog-title"}>Create Ledger</DialogTitle>
                <DialogContent>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>} aria-controls="panel1c-content" id="panel1c-header">
                            <div className={classes.twoThirdColumn}>
                                <Typography className={classes.heading}>Ledger details</Typography>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                        <div className={classes.twoThirdColumn}>
                            <FormControl fullWidth>
                                <TextField autoFocus required margin="dense" id="ledgerName" label="Name"
                                           type="text" fullWidth style={{paddingRight: "15px"}}
                                           inputRef={ledgerNameRef}/>
                                <TextField margin="dense" id="ledgerTags" label="Tags"
                                           type="text"
                                           fullWidth style={{paddingRight: "15px"}}
                                           inputRef={ledgerTagsRef}/>
                                <FormControlLabel control={
                                    <Checkbox checked={deletionProtection} onChange={handleDeletionProtectionChange} name={"deletionProtection"} color={"primary"}/>
                                } label={"Deletion Protection"} />
                            </FormControl>
                        </div>
                        <div className={classes.helper}>
                            <Typography variant="caption">
                                Creates ledger.<br />
                                <Divider />
                                Name: name of the ledger.<br />
                                Deletion Protection: Protection against accidental ledger deletion.<br />
                                Tags: space separated 'key=value' pair.<br />
                            </Typography>
                        </div>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button size="small" onClick={handleDialogClose}>Cancel</Button>
                    <Button size="small" color="primary" onClick={handleCreateLedger}>Create</Button>
                </DialogActions>
            </Dialog>
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
                                getLedgerMetaData(ledger).then(l => addCompleterForUserTables((l.tables || []).filter(t => t.status == "ACTIVE").map(t => t.name)))
                            }
                        }}
                    >
                        {ledgers.map((ledger) => ledgerTreeItem(ledger))}
                    </TreeView>
                    <Toolbar/>
                </Box>
            </PullToRefresh>
            <Box className={classes.stickToBottom}>
                <Divider light={true}/>
                <Tooltip title="Create ledger">
                    <IconButton size={"medium"} aria-label="create" onClick={handleDialogOpen}> <AddIcon /> </IconButton>
                </Tooltip>
                <Tooltip title="Delete current ledger">
                    <IconButton size={"medium"} aria-label="delete" onClick={handleDeleteLedger}> <DeleteIcon /> </IconButton>
                </Tooltip>
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
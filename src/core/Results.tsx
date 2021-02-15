import * as React from "react";
import {
    Box,
    Button, Grid, IconButton,
    Paper,
    Tab,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Toolbar, Tooltip
} from "@material-ui/core";
import HistoryIcon from '@material-ui/icons/History';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import CloudDoneIcon from "@material-ui/icons/CloudDoneTwoTone";
import CloudOffIcon from "@material-ui/icons/CloudOffTwoTone";
import SendIcon from '@material-ui/icons/Send';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {Light as SyntaxHighlighter} from "react-syntax-highlighter";
import {githubGist, zenburn} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import {CopyToClipboard} from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ace from "ace-builds/src-noconflict/ace";
import {executeStatement} from "./QueryHandler";
import {loadHistory, QueryHistoryEntry, QueryStats, SetHistoryFn} from "./query-history";
import History from "./History";
import Typography from "@material-ui/core/Typography";
import CodeIcon from "@material-ui/icons/Code";
import TableChartIcon from "@material-ui/icons/TableChart";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        stickToBottom: {
            minWidth: "80%",
            position: "fixed",
            bottom: 0,
            justifyContent: "flex-start"
        },
        button: {
            margin: theme.spacing(1),
        },
        stickToTop: {
            minWidth: "80%",
            position: "fixed",
            zIndex: 1
        },
        headingAccordion: {
            fontFamily: "Courier",
            overflow: "hidden",
            textOverflow: "ellipsis",
            [theme.breakpoints.up('sm')]: {
                width: "20em",
            },
            [theme.breakpoints.up('md')]: {
                width: "40em",
            },
            [theme.breakpoints.up('lg')]: {
                width: "70em",
            },
            whiteSpace: "nowrap"
        },
        table: {
            minWidth: 650,
        },
        tableHeadContent: {
            fontWeight: theme.typography.fontWeightBold,
            fontFamily: "Courier",
        },
        iconButton: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.primary.main,
            float: "right",
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
        }
    }),
);

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3} style={{flex: 1}}>{children}</Box>
            )}
        </div>
    );
}

function prepareQueryStatsView(queryStats: QueryStats) {
    return (
        queryStats && <Grid container spacing={0}>
            <Grid item xs={12}><Typography variant="caption" > Read IOs: {queryStats.consumedIOs.readIOs}</Typography></Grid>
            <Grid item xs={12}><Typography variant="caption" >Time: {queryStats.timingInformation.processingTimeMilliseconds}ms</Typography></Grid>
        </Grid>
    )
}

function prepareErrorView(error: string) {
    return (
        error && <Alert variant={"filled"} severity="error">{error}</Alert>
    )
}

function prepareIonView(queryResult: [], darkState: boolean) {
    const classes = useStyles();
    const items = []
    for (const i in queryResult) {
        const nonPrettyResult = JSON.stringify(queryResult[i], undefined)
        const prettyResult = JSON.stringify(queryResult[i], undefined, 2)
        items.push(
            <Accordion key={"result-" + i}>
                <AccordionSummary
                    aria-controls={"result-panel-content-" + i}
                    id={"result-panel-header-" + i}
                >
                    <div className={classes.headingAccordion}>
                        {nonPrettyResult}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <SyntaxHighlighter language="json" style={darkState ? zenburn : githubGist} showLineNumbers={true}>
                        { prettyResult }
                    </SyntaxHighlighter>
                    <CopyToClipboard text={prettyResult}>
                        <label htmlFor="icon-button-file">
                            <IconButton color="primary" aria-label="copy" component="span">
                                <FileCopyIcon />
                            </IconButton>
                        </label>
                    </CopyToClipboard>
                </AccordionDetails>
            </Accordion>
        )
    }
    return <div>{ items }</div>
}

function prepareTableView(queryResult: []) {
    const classes = useStyles();
    const headers = findAllHeaders(queryResult)
    let rowIndex = 0
    return <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="Results table">
            <TableHead>
                <TableRow>
                    {headers.map((header) => <TableCell key={header}>
                        <Typography className={classes.tableHeadContent}>{header}</Typography>
                    </TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {queryResult.map((result) => prepareTableContentRow(result, headers, rowIndex++))}
            </TableBody>
        </Table>
    </TableContainer>

}

function prepareTableContentRow(queryResult: {}, headers: [], rowIndex: number) {
    let cellIndex = 0
    return <TableRow key={rowIndex}>
        {headers.map((header) => (
            <TableCell key={`cell${cellIndex++}`}>{JSON.stringify(queryResult[header])}</TableCell>
        ))}
    </TableRow>
}

function findAllHeaders(queryResult: []): [] {
    const headers: Map<string, number> = new Map<string, number>()
    for (const i in queryResult) {
        const map: Map<string, string> = queryResult[i]
        for (const key in map) {
            const count = headers.get(key) ? headers.get(key) + 1 : 1
            headers.set(key, count)
        }
    }
    return Array.from(headers.entries()).sort((a, b) => b[1] - a[1]).map((e) => e[0]) as []
}

export function execute(activeLedger: string, setHistory: SetHistoryFn, setResult: (text: string) => void,
                        setError: (text: string) => void, setQueryStats: (stats: QueryStats) => void) {
    const editor = ace.edit("aceEditor1");
    const selectedText = editor.getSelectedText();
    executeStatement(
        activeLedger,
        selectedText === "" ? editor.getValue() : selectedText,
        setHistory
    ).then(output => {
        if (output.errorMessage) {
            setError(output.errorMessage)
            setResult("")
            setQueryStats(undefined)
        } else {
            const extractedResult = JSON.stringify(output.result.reduce((acc, res) => acc.concat(res.getResultList()), []));
            setResult(extractedResult);
            setQueryStats(output.queryStats)
            setError("")
        }
    });
}

export default ({activeLedger, darkState, result, history, setHistory, setResult, error, setError, queryStats, setQueryStats}:
    { activeLedger: string, darkState: boolean, result: string, history: QueryHistoryEntry[], setHistory: SetHistoryFn,
        setResult: (text: string) => void, error: string, setError: (text: string) => void, queryStats: QueryStats, setQueryStats: (stats: QueryStats) => void}) => {
    const [activeTabValue, setActiveTabValue] = React.useState(0);
    const classes = useStyles();
    const queryResult = result ? JSON.parse(result) : []
    const [viewType, setViewType] = React.useState("ion");

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTabValue(newValue);
    };

    function historyEntrySelected(entry: QueryHistoryEntry) {
        setResult(JSON.stringify(entry.result))
        setActiveTabValue(0)
        setError("")
        setQueryStats(entry.queryStats)
        const editor = ace.edit("aceEditor1");
        const currentValue = editor.getValue();
        editor.setValue(`${currentValue ? `${currentValue}\n` : ""}${entry.text}`)
    }

    React.useEffect(() => loadHistory(setHistory), []);

    return (
        <Box style={{flexDirection: "row", height: "100%"}}>
            <Paper square elevation={0} className={classes.stickToTop}>
                <Button color={"primary"} variant={"contained"} className={classes.button} endIcon={<SendIcon/>}
                        onClick={() => { execute(activeLedger, setHistory, setResult, setError, setQueryStats) }} >
                    Run
                </Button>
                <Tooltip title={"Table View (experimental)"} >
                    <IconButton size={"medium"} aria-label="table" className={classes.iconButton} onClick={() => setViewType("table")}> <TableChartIcon /> </IconButton>
                </Tooltip>
                <Tooltip title={"Ion View"}>
                    <IconButton size={"medium"} aria-label="ion" className={classes.iconButton} onClick={() => setViewType("ion")}> <CodeIcon /> </IconButton>
                </Tooltip>
                <Box style={{float: "right"}}>{ prepareQueryStatsView(queryStats) }</Box>
            </Paper>
            <TabPanel value={activeTabValue} index={0} >
                <Toolbar />
                <Box >
                    { prepareErrorView(error) }
                    {(viewType == "ion") ? prepareIonView(queryResult, darkState) : prepareTableView(queryResult)}
                </Box>
                <Toolbar />
            </TabPanel>
            <TabPanel value={activeTabValue} index={1}>
                <Toolbar />
                <Box ><History history={history} setHistory={setHistory} historyEntrySelected={historyEntrySelected}/></Box>
                <Toolbar />
            </TabPanel>
            <Paper square className={classes.stickToBottom}>
                <Tabs value={activeTabValue} onChange={handleChange} indicatorColor="primary" textColor="primary">
                    <Tab icon={<ReceiptIcon />} />
                    <Tab icon={<HistoryIcon />} />
                    <ButtonInTabs value={activeLedger} disabled={!activeLedger.toString()}
                                  startIcon={activeLedger ? <CloudDoneIcon/> : <CloudOffIcon/>}
                                  style={{flex: 1, textTransform: "none"}} color={"primary"}>
                        {activeLedger ? "Connected to " + activeLedger : "No active ledger"}
                    </ButtonInTabs>
                </Tabs>
            </Paper>
        </Box>
    )
}

const ButtonInTabs = ({ children, value, disabled, startIcon, style, color}) => {
    return <Button value={value} disabled={disabled} startIcon={startIcon} style={style} color={color}
                   children={children}/>;
};
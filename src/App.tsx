import * as React from "react";
import * as ReactDOM from "react-dom";
import SplitPane from "react-split-pane";
import {getLedgerMetaData, listLedgers} from "./ledger";
import {openLedger} from "./session";
import Navigator from "./Navigator";
import Results from "./Results";
import {addCompleterForUserTables, Composer} from "./Composer";
import StatusBar from "./StatusBar";
import History from "./History";
import {flattenQueryStats, loadHistory, QueryHistoryEntry, QueryStats, recordHistory} from "./query-history";
import {Value} from "ion-js/dist/commonjs/es6/dom";
import {createMuiTheme, MuiThemeProvider, Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import AWS = require("aws-sdk");


AWS.config.update({region:"us-east-1"});

export enum Theme {
    LIGHT, DARK
}

export let CurrentTheme: Theme = Theme.LIGHT
export function toggleTheme() { CurrentTheme == Theme.LIGHT ? CurrentTheme = Theme.DARK : CurrentTheme = Theme.LIGHT }

export enum TabType {
    RESULTS = "results",
    HISTORY = "history"
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#ec7211",
        },
        secondary: {
            main: "#545b64",
        },
        text: {
            primary: "#545b64",
            secondary: "#687078",
            disabled: "#aab7b8",
        },
        error: {
            main: "#d13212",
        },
        success: {
            main: "#1d8102",
        },
        background: {
            default: "#f2f3f3",
        },
        grey: {
            50: "#fafafa",
            100: "#f2f3f3",
            200: "#eaeded",
            300: "#d5dbdb",
            400: "#aab7b8",
            500: "#879596",
            600: "#687078",
            700: "#545b64",
            900: "#16191f",
        }
    },
});

export enum Color {
    WHITE = "#ffffff",
}

export const RESULT_BOX_STYLE = {width: "100%", height: "100%", overflow: "scroll", fontSize: "10pt", flex: 1, backgroundColor: theme.palette.background.default};
export const RESULT_INTERNAL_CONTAINER_STYLE = {width: "100%", maxHeight: 300, overflow: "auto", flex: 1, backgroundColor: theme.palette.background.default};

const Detail = ({ ledgers, activeLedger }: { ledgers: string[], activeLedger: string}) => {
    const [queryStats, setQueryStats] = React.useState(undefined as QueryStats);
    const [resultsText, setResultsText] = React.useState("");
    const [selectedTab, setSelectedTab] = React.useState(TabType.RESULTS);
    const [history, setHistory] = React.useState([] as QueryHistoryEntry[]);
    const [errorMsg, setErrorMsg] = React.useState("")
    const [successBarOpen, setSuccessBarOpen] = React.useState(false);
    const [errorBarOpen, setErrorBarOpen] = React.useState(false);

    const composerText = React.useRef(null);
    const ledger = React.useRef(null);

    ledger.current = activeLedger
    React.useEffect(() => loadHistory(setHistory), []);

    function setComposerText(text: string) {
        composerText.current = text;
    }

    function updateResultText(result: Value[]) {
        setResultsText(JSON.stringify(result));
    }

    const executeStatement = async () => {
        try {
            setErrorMsg("")
            const result = await openLedger(ledger.current).execute(composerText.current);
            console.log(JSON.stringify(result))
            const queryStats = {
                consumedIOs: result.reduce((acc, res) => acc.concat(res.getConsumedIOs()), []),
                timingInformation: result.reduce((acc, res) => acc.concat(res.getTimingInformation()), []),
            };
            setQueryStats(flattenQueryStats(queryStats));
            updateResultText(result.reduce((acc, res) => acc.concat(res.getResultList()), []));
            recordHistory(composerText.current, result.reduce((acc, res) => acc.concat(res.getResultList()), []), queryStats, setHistory)
            setSuccessBarOpen(true)
        } catch (e) {
            setErrorMsg(e.toLocaleString())
            setResultsText("")
            setErrorBarOpen(true)
        }
    };

    const historyEntrySelected = (entry: QueryHistoryEntry) => {
        setSelectedTab(TabType.RESULTS);
        updateResultText(entry.result);
        setQueryStats(entry.queryStats);
        setComposerText(entry.text);
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessBarOpen(false);
        setErrorBarOpen(false)
    };

    return <SplitPane split="horizontal" size="50%">
        <Composer composerText={composerText.current} setComposerText={setComposerText} executeStatement={executeStatement} />
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>

            <Snackbar open={successBarOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert severity="success" onClose={handleClose}>Request successful!</Alert>
            </Snackbar>
            <Snackbar open={errorBarOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert severity="error" onClose={handleClose}>Woah! What did you do?</Alert>
            </Snackbar>

            { selectedTab === TabType.RESULTS
                ? <Results resultsText={resultsText} activeLedger={activeLedger} queryStats={queryStats} errorMsg={errorMsg}/>
                : <History history={history} setHistory={setHistory} historyEntrySelected={historyEntrySelected}/>
            }
            <StatusBar
                ledger={ledger.current}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}/>
        </div>
    </SplitPane>;
};

const App = () => {
    const [ledgers, setLedgers] = React.useState([]);
    const [activeLedger, setActiveLedger] = React.useState("")

    React.useEffect(() => {
        const fetchLedgers = async () => {
            setLedgers(await listLedgers())
        };
        fetchLedgers();
    }, []);

    React.useEffect(() => {
        getLedgerMetaData(activeLedger).then(l => addCompleterForUserTables(l.tables.map(q => q.name)))
    }, [activeLedger])


    return <MuiThemeProvider theme={theme}>
        <SplitPane split={"vertical"} size="20%">
            <Navigator ledgerNames={ledgers} setActiveLedger={setActiveLedger}/>
            <Detail ledgers={ledgers} activeLedger={activeLedger}/>
        </SplitPane>
    </MuiThemeProvider>;
};

ReactDOM.render(<App />, document.getElementById("main"));

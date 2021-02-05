import * as React from "react";
import * as ReactDOM from "react-dom";
import SplitPane from "react-split-pane";
import {listLedgers} from "./ledger";
import {openLedger} from "./session";
import Navigator from "./Navigator";
import Results from "./Results";
import {Composer} from "./Composer";
import StatusBar from "./StatusBar";
import History from "./History";
import {flattenQueryStats, loadHistory, QueryHistoryEntry, QueryStats, recordHistory} from "./query-history";
import {Value} from "ion-js/dist/commonjs/es6/dom";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import AWS = require("aws-sdk");

AWS.config.update({region:"us-east-1"});

export enum Color {
    GREEN = "green",
    RED = "red",
    DARKGRAY = "#f5f5f5",
    LIGHTGRAY = "#fafafa",
}

export enum Theme {
    LIGHT, DARK
}

export let CurrentTheme: Theme = Theme.LIGHT
export function toggleTheme() { CurrentTheme == Theme.LIGHT ? CurrentTheme = Theme.DARK : CurrentTheme = Theme.LIGHT }

export const RESULT_BOX_STYLE = {width: "100%", height: "100%", overflow: "scroll", fontSize: "10pt", flex: 1, backgroundColor: Color.DARKGRAY};
export const RESULT_INTERNAL_CONTAINER_STYLE = {width: "100%", maxHeight: 300, overflow: "scroll", flex: 1};

export enum TabType {
    RESULTS = "results",
    HISTORY = "history"
}

const Detail = ({ ledgers }: { ledgers: string[]}) => {
    const [queryStats, setQueryStats] = React.useState(undefined as QueryStats);
    const [resultsText, setResultsText] = React.useState("");
    const [selectedTab, setSelectedTab] = React.useState(TabType.RESULTS);
    const [history, setHistory] = React.useState([] as QueryHistoryEntry[]);
    const [errorMsg, setErrorMsg] = React.useState("")
    const [successBarOpen, setSuccessBarOpen] = React.useState(false);
    const [errorBarOpen, setErrorBarOpen] = React.useState(false);

    const composerText = React.useRef(null);
    const ledger = React.useRef(null);

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
            const queryStats = {
                consumedIOs: result.getConsumedIOs(),
                timingInformation: result.getTimingInformation(),
            };
            setQueryStats(flattenQueryStats(queryStats));
            updateResultText(result.getResultList());
            recordHistory(composerText.current, result.getResultList(), queryStats, setHistory)
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
                ? <Results resultsText={resultsText} queryStats={queryStats} errorMsg={errorMsg}/>
                : <History history={history} setHistory={setHistory} historyEntrySelected={historyEntrySelected}/>
            }
            <StatusBar
                queryStats={queryStats}
                ledgers={ledgers}
                ledger={ledger.current}
                setLedger={l => {
                    ledger.current = l;
                }}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}/>
        </div>
    </SplitPane>;
};

const App = () => {
    const [ledgers, setLedgers] = React.useState([]);
    React.useEffect(() => {
        const fetchLedgers = async () => {
            setLedgers(await listLedgers())
        };
        fetchLedgers();
    }, []);


    return <SplitPane split={"vertical"} size="20%">
        <Navigator ledgerNames={ledgers}/>
        <Detail ledgers={ledgers}/>
    </SplitPane>;
};

ReactDOM.render(<App />, document.getElementById("main"));

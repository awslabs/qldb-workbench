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
import AWS = require("aws-sdk");
import {Result} from "amazon-qldb-driver-nodejs";
import {Value} from "ion-js/dist/commonjs/es6/dom";

AWS.config.update({region:"us-east-1"});

export const EDITOR_STYLE = {padding: "1px", width: "100%", height: "100%", overflow: "scroll", fontFamily: "Courier New", fontSize: "10pt"};

export enum Color {
    GREEN = "green",
    DARKGRAY = "#f5f5f5",
    LIGHTGRAY = "#fafafa",
}

export enum Theme {
    LIGHT, DARK
}

export let CurrentTheme: Theme = Theme.LIGHT
export function toggleTheme() { CurrentTheme == Theme.LIGHT ? CurrentTheme = Theme.DARK : CurrentTheme = Theme.LIGHT }

export enum TabType {
    RESULTS = "results",
    HISTORY = "results"
}

const Detail = ({ ledgers }: { ledgers: string[]}) => {
    const [queryStats, setQueryStats] = React.useState(undefined as QueryStats);
    const [resultsText, setResultsText] = React.useState("");
    const [selectedTab, setSelectedTab] = React.useState(TabType.RESULTS);
    const [history, setHistory] = React.useState([] as QueryHistoryEntry[]);
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
        const result = await openLedger(ledger.current).execute(composerText.current);
        const queryStats = {
            consumedIOs: result.getConsumedIOs(),
            timingInformation: result.getTimingInformation(),
        };
        setQueryStats(flattenQueryStats(queryStats));
        updateResultText(result.getResultList());
        recordHistory(composerText.current, result.getResultList(), queryStats, setHistory)
    };

    const historyEntrySelected = (entry: QueryHistoryEntry) => {
        setSelectedTab(TabType.RESULTS);
        updateResultText(entry.result);
        setQueryStats(entry.queryStats);
        setComposerText(entry.text);
    }

    return <SplitPane split="horizontal" size="80%">
        <Composer composerText={composerText.current} setComposerText={setComposerText} executeStatement={executeStatement} />
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            { selectedTab === TabType.RESULTS
                ? <Results resultsText={resultsText}/>
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
        <Navigator ledgers={ledgers}/>
        <Detail ledgers={ledgers}/>
    </SplitPane>;
};

ReactDOM.render(<App />, document.getElementById("main"));

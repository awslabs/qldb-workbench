import * as React from "react";
import * as ReactDOM from "react-dom";
import SplitPane from "react-split-pane";
import {listLedgers} from "./ledger";
import {openLedger} from "./session";
import Navigator from "./Navigator";
import Results from "./Results";
import {Composer} from "./Composer";
import StatusBar from "./StatusBar";
import AWS = require("aws-sdk");

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

const Detail = ({ ledgers }: { ledgers: string[]}) => {
    const [queryStats, setQueryStats] = React.useState(undefined);
    const [resultsText, setResultsText] = React.useState("");
    const [selectedTab, setSelectedTab] = React.useState("results");
    const ledger = React.useRef(null);

    const executeText = async (text: string) => {
        const result = await openLedger(ledger.current).execute(text);
        setQueryStats({
            consumedIOs: result.getConsumedIOs(),
            timingInformation: result.getTimingInformation(),
        });
        setResultsText(JSON.stringify(result.getResultList()));
    };
    return <SplitPane split="horizontal" size="80%">
        <Composer executeText={executeText} />
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            <Results resultsText={resultsText}/>
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

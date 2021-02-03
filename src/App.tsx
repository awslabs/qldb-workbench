import * as React from "react";
import * as ReactDOM from "react-dom";
import SplitPane from "react-split-pane";
import Select from "react-select";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import * as path from "path";
import {listLedgers} from "./ledger";
import {openLedger, QueryStats} from "./session";
import AWS = require("aws-sdk");
import Navigator from "./Navigator";
import Results from "./Results";
import Composer from "./Composer";

AWS.config.update({region:"us-east-1"});

export const EDITOR_STYLE = {padding: "1px", width: "100%", height: "100%", overflow: "scroll", fontFamily: "Courier New", fontSize: "10pt"};

export enum Color {
    GREEN = "green",
    DARKGRAY = "#f5f5f5",
    LIGHTGRAY = "#fafafa",
}

const StatusBar = ({ ledgers, ledger, setLedger, queryStats }: { ledgers: string[], ledger: string, setLedger: (ledger: string) => void, queryStats?: QueryStats}) => {
    return <div className="status-bar">
        <span className="status-item" style={{ width: "300px" }}>
            <Select
                width="300px"
                value={ledger ? { label: ledger, value: ledger } : { label: "Choose a ledger...", value: "Choose a ledger" }}
                options={ ledgers.map(l => { return { label: l, value: l} }) }
                menuPlacement="top"
                onChange={o => setLedger(o.value)}
            />
        </span>
        {queryStats
            ? <span className="status-item">Read IOs: {queryStats.consumedIOs.getReadIOs()}; Time: {queryStats.timingInformation.getProcessingTimeMilliseconds()}ms</span>
            : <></>}
    </div>;
}

const Detail = ({ ledgers }: { ledgers: string[]}) => {
    const [queryStats, setQueryStats] = React.useState(undefined);
    const [resultsText, setResultsText] = React.useState("");
    const [ledger, setLedger] = React.useState(null);

    return <SplitPane split="horizontal" size="80%">
        <Composer executeText={async (text) => {
            const result = await openLedger(ledger).execute(text);
            setQueryStats({
                consumedIOs: result.getConsumedIOs(),
                timingInformation: result.getTimingInformation(),
            });
            setResultsText(JSON.stringify(result.getResultList()));
        }}/>
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
            <Results resultsText={resultsText}/>
            <StatusBar queryStats={queryStats} ledgers={ledgers} ledger={ledger} setLedger={setLedger}/>
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
        <Navigator />
        <Detail ledgers={ledgers}/>
    </SplitPane>;
};

ReactDOM.render(<App />, document.getElementById("main"));

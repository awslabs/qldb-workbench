import {IOUsage, TimingInformation} from "amazon-qldb-driver-nodejs";
import {Value} from "ion-js/dist/commonjs/es6/dom";
import * as fs from "fs";
import * as readline from "readline";

const HISTORY_FILE = ".qldb-quark-history";

export interface QueryHistoryEntry {
    text: string;
    result: Value[];
    queryStats: { timingInformation: { processingTimeMilliseconds: number }; consumedIOs: { readIOs: number } }
}

type SetHistoryFn = (value: (((prevState: QueryHistoryEntry[]) => QueryHistoryEntry[]) | QueryHistoryEntry[])) => void;

export function loadHistory(setHistory: SetHistoryFn) {
    readline.createInterface(fs.createReadStream(HISTORY_FILE)).on("line", l => {
        setHistory(history => [...history, JSON.parse(l)]);
    });
}

export function recordHistory(text: string, result: Value[], queryStats: { timingInformation: TimingInformation; consumedIOs: IOUsage }, setHistory: SetHistoryFn) {
    const historyEntry = { text, result, queryStats: {
            consumedIOs: { readIOs: queryStats.consumedIOs.getReadIOs() },
            timingInformation: { processingTimeMilliseconds: queryStats.timingInformation.getProcessingTimeMilliseconds() },
        }
    };
    fs.appendFileSync(HISTORY_FILE, JSON.stringify(historyEntry) + "\n");
    setHistory(history => [...history, historyEntry]);
}

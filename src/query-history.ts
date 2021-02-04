import {IOUsage, TimingInformation} from "amazon-qldb-driver-nodejs";
import {Value} from "ion-js/dist/commonjs/es6/dom";
import * as fs from "fs";
import * as readline from "readline";

const HISTORY_FILE = ".qldb-quark-history";

export type QueryStats = { timingInformation: { processingTimeMilliseconds: number }; consumedIOs: { readIOs: number } };

export interface QueryHistoryEntry {
    text: string;
    result: Value[];
    queryStats: QueryStats
}

type SetHistoryFn = (value: (((prevState: QueryHistoryEntry[]) => QueryHistoryEntry[]) | QueryHistoryEntry[])) => void;

export function loadHistory(setHistory: SetHistoryFn) {
    readline.createInterface(fs.createReadStream(HISTORY_FILE)).on("line", l => {
        setHistory(history => [...history, JSON.parse(l)]);
    });
}

export function flattenQueryStats(queryStats: { timingInformation: TimingInformation; consumedIOs: IOUsage }) {
    return {
        consumedIOs: {readIOs: queryStats.consumedIOs.getReadIOs()},
        timingInformation: {processingTimeMilliseconds: queryStats.timingInformation.getProcessingTimeMilliseconds()},
    };
}

export function recordHistory(text: string, result: Value[], queryStats: { timingInformation: TimingInformation; consumedIOs: IOUsage }, setHistory: SetHistoryFn) {
    const historyEntry = { text, result, queryStats: flattenQueryStats(queryStats)
    };
    fs.appendFileSync(HISTORY_FILE, JSON.stringify(historyEntry) + "\n");
    setHistory(history => [...history, historyEntry]);
}

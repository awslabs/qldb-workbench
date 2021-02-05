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

export type SetHistoryFn = (value: (((prevState: QueryHistoryEntry[]) => QueryHistoryEntry[]) | QueryHistoryEntry[])) => void;

export function loadHistory(setHistory: SetHistoryFn) {
    readline.createInterface(fs.createReadStream(HISTORY_FILE)).on("line", l => {
        setHistory(history => [...history, JSON.parse(l)]);
    });
}

export function flattenQueryStats(queryStats: { timingInformation: TimingInformation[]; consumedIOs: IOUsage[] }) {
    return {
        consumedIOs: {readIOs: queryStats.consumedIOs.reduce((acc, io) => acc + io.getReadIOs(), 0)},
        timingInformation: {processingTimeMilliseconds: queryStats.timingInformation.reduce((acc, timeInfo) => acc + timeInfo.getProcessingTimeMilliseconds(), 0)},
    };
}

function append(historyEntry: { result: Value[]; queryStats: { timingInformation: { processingTimeMilliseconds: number }; consumedIOs: { readIOs: number } }; text: string }) {
    fs.appendFileSync(HISTORY_FILE, JSON.stringify(historyEntry) + "\n");
}

export function recordHistory(text: string, result: Value[], queryStats: { timingInformation: TimingInformation[]; consumedIOs: IOUsage[] }, setHistory: SetHistoryFn) {
    const historyEntry = { text, result, queryStats: flattenQueryStats(queryStats) };
    append(historyEntry);
    setHistory(history => [...history, historyEntry]);
}

export function replaceHistory(history: QueryHistoryEntry[]) {
    fs.truncateSync(HISTORY_FILE);
    history.forEach(append);
}
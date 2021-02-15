import {openLedger} from "./session";
import * as React from "react";
import {flattenQueryStats, recordHistory, SetHistoryFn} from "./query-history";

export const executeStatement = async (ledgerName: string, statement: string, setHistory: SetHistoryFn) => {
    try {
        const result = await openLedger(ledgerName).execute(statement);
        const queryStats = {
            consumedIOs: result.reduce((acc, res) => acc.concat(res.getConsumedIOs()), []),
            timingInformation: result.reduce((acc, res) => acc.concat(res.getTimingInformation()), []),
        };
        recordHistory(statement, result.reduce((acc, res) => acc.concat(res.getResultList()), []), queryStats, setHistory)
        return {
            result: result,
            queryStats: flattenQueryStats(queryStats),
        }
    } catch (e) {
        return {
            errorMessage: e.toLocaleString()
        }
    }
};
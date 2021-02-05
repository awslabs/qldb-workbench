import * as React from "react";
import Select from "react-select";
import { Box, Tab, Tabs } from "@material-ui/core";
import HistoryIcon from '@material-ui/icons/History';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { TabType } from "./App";
import { QueryStats } from "./query-history";
import { addCompleterForUserTables } from "./Composer";
import { getLedgerMetaData } from "./ledger";

type Props = { ledgers: string[], ledger: string, setLedger: (ledger: string) => void, queryStats?: QueryStats, selectedTab: string, setSelectedTab: (selectedTab: TabType) => void };

export default ({ ledgers, ledger, setLedger, queryStats, selectedTab, setSelectedTab }: Props) => {
    return <div className="status-bar">
        <span className="status-item" style={{ width: "300px" }}>
            {"Active ledger: " + ledger}
        </span>
        {queryStats
            ? <span className="status-item">Read IOs: {queryStats.consumedIOs.readIOs}; Time: {queryStats.timingInformation.processingTimeMilliseconds}ms</span>
            : <></>}
        <span className="status-item" style={{ flex: 1 }}>
            <Tabs
                indicatorColor="primary"
                textColor="primary"
                value={selectedTab}
                defaultValue="results"
                onChange={(e, value) => {
                    setSelectedTab(value);
                }}
            >
                <Tab icon={<ReceiptIcon />} value="results" />
                <Tab icon={<HistoryIcon />} value="history" />
            </Tabs>
        </span>
    </div>;
}
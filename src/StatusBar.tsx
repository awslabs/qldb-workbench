import * as React from "react";
import {QueryStats} from "./session";
import Select from "react-select";
import {Tab, Tabs} from "@material-ui/core";
import HistoryIcon from '@material-ui/icons/History';
import ReceiptIcon from '@material-ui/icons/Receipt';
import {TabType} from "./App";

type Props = { ledgers: string[], ledger: string, setLedger: (ledger: string) => void, queryStats?: QueryStats, selectedTab: string, setSelectedTab: (selectedTab: TabType) => void };

export default({ ledgers, ledger, setLedger, queryStats, selectedTab, setSelectedTab }: Props) => {
    return <div className="status-bar">
        <span className="status-item" style={{ width: "300px" }}>
            <Select
                width="300px"
                value={ledger ? { label: ledger, value: ledger } : { label: "Choose a ledger...", value: "Choose a ledger" }}
                options={ ledgers.map(l => { return { label: l, value: l} }) }
                menuPlacement="top"
                onChange={o => {
                    console.log("o", o);
                    setLedger(o.value);
                }}
            />
        </span>
        {queryStats
            ? <span className="status-item">Read IOs: {queryStats.consumedIOs.getReadIOs()}; Time: {queryStats.timingInformation.getProcessingTimeMilliseconds()}ms</span>
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
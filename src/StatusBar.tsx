import {Tab, Tabs} from "@material-ui/core";
import HistoryIcon from '@material-ui/icons/History';
import ReceiptIcon from '@material-ui/icons/Receipt';
import * as React from "react";
import {TabType} from "./App";

type Props = { ledger: string, selectedTab: string, setSelectedTab: (selectedTab: TabType) => void };

export default ({ ledger, selectedTab, setSelectedTab }: Props) => {
    return <div className="status-bar">
        <span className="status-item" style={{ width: "300px" }}>
            {"Active ledger: " + ledger}
        </span>
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
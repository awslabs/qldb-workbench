import { QLDB } from "aws-sdk";
import { LedgerSummary } from "aws-sdk/clients/qldb";
import { openLedger } from "./session";

/**
 * Create a ledger and wait for it to be active.
 * @returns Promise which fulfills with void.
 */
export async function listLedgers() {
    const ledgers = await new QLDB().listLedgers().promise();
    return ledgers.Ledgers.filter(l => l.State === "ACTIVE").map(l => l.Name);
}

export async function getLedgerMetaData(ledgerName: string): Promise<LedgerInfo> {
    const ledger: LedgerInfo = await new QLDB().describeLedger({Name: ledgerName}).promise()
    const result = await openLedger(ledgerName).execute("SELECT * FROM information_schema.user_tables")
    const tables: TableInfo[] = JSON.parse(JSON.stringify(result.getResultList()));

    ledger.tables = tables

    return ledger
}

export interface LedgerInfo extends LedgerSummary {
    tables?: TableInfo[]
}

export interface TableInfo {
    name: string;
    tableId: string;
    status: string;
    indexes: IndexInfo[]
}

export interface IndexInfo {
    expr: string
    indexId: string
    status: string
}
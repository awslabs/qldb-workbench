import { QLDB } from "aws-sdk";
import { openLedger } from "./session";

/**
 * Create a ledger and wait for it to be active.
 * @returns Promise which fulfills with void.
 */
export async function listLedgers() {
    const ledgers = await new QLDB().listLedgers().promise();
    return ledgers.Ledgers.filter(l => l.State === "ACTIVE").map(l => l.Name);
}

export async function getLedgerMetaData(ledger: string) {
    const result = await openLedger(ledger).execute("SELECT * FROM information_schema.user_tables")
    const tables = JSON.parse(JSON.stringify(result.getResultList()));
    return {
        name: ledger,
        tables: tables
    }
}
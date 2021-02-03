import {QLDB} from "aws-sdk";

/**
 * Create a ledger and wait for it to be active.
 * @returns Promise which fulfills with void.
 */
export async function listLedgers() {
    const ledgers = await new QLDB().listLedgers().promise();
    return ledgers.Ledgers.filter(l => l.State === "ACTIVE").map(l => l.Name);
}
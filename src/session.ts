import {
    IOUsage,
    QldbDriver,
    Result,
    RetryConfig,
    TimingInformation,
    TransactionExecutor
} from "amazon-qldb-driver-nodejs";
import {ClientConfiguration} from "aws-sdk/clients/acm";
import {Agent} from "https";

export interface QueryStats {
    consumedIOs: IOUsage,
    timingInformation: TimingInformation,
}

export const executeStatement = (driver: QldbDriver) => async (statement: string): Promise<Result> => {
    return await driver.executeLambda(async (txn: TransactionExecutor) => {
        return await txn.execute(statement);
    });
}

export function openLedger(ledgerName: string) {
    const maxConcurrentTransactions: number = 10;
    const agentForQldb: Agent = new Agent({
        keepAlive: true,
        maxSockets: maxConcurrentTransactions
    });
    const serviceConfigurationOptions: ClientConfiguration = {
        region: "us-east-1",
        httpOptions: {
            agent: agentForQldb
        }
    };
    const retryLimit: number = 4;
    // Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
    const retryConfig: RetryConfig = new RetryConfig(retryLimit);
    const driver = new QldbDriver(ledgerName, serviceConfigurationOptions, maxConcurrentTransactions, retryConfig);
    return {
        execute: executeStatement(driver)
    };
}

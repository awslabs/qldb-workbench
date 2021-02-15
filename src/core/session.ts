import {QldbDriver, Result, RetryConfig, TransactionExecutor} from "amazon-qldb-driver-nodejs";
import {ClientConfiguration} from "aws-sdk/clients/acm";
import {Agent} from "https";
import {OptionsObject, SnackbarKey, SnackbarMessage} from "notistack";
import {frontendEndpointValue} from "./ledger";

const SEPARATOR = ";"
export let sessionEndpointValue = ""
export const setSessionEndpoint = (endpoint: string) => sessionEndpointValue = endpoint

const executeStatement = (driver: QldbDriver, enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) => async (statement: string): Promise<Result[]> => {
    try {
        return await driver.executeLambda(async (txn: TransactionExecutor) => {
            if (!statement) throw new Error('Nothing to run!!')
            const statements = statement.split(SEPARATOR).filter(st => st.trim().length > 0);
            if (statements.length > 0) {
                return Promise.all(statements.map(async st => txn.execute(st)))
            } else throw new Error('Nothing to run!!');
        });
    } catch (e) {
        const errorMessage = `Unable to execute query on ledger. ${frontendEndpointValue || sessionEndpointValue ? "Make sure you have set session endpoint correctly." : ""}`
        enqueueSnackbar && enqueueSnackbar(errorMessage, {variant: "error"})
        throw e
    }
}

export function openLedger(ledgerName: string, enqueueSnackbar?: (message: SnackbarMessage, options?: OptionsObject) => SnackbarKey) {
    const maxConcurrentTransactions: number = 10;
    const agentForQldb: Agent = new Agent({
        keepAlive: true,
        maxSockets: maxConcurrentTransactions,
        rejectUnauthorized: false // Don't do this
    });
    const serviceConfigurationOptions: ClientConfiguration = {
        httpOptions: {
            agent: agentForQldb
        },
    };
    const serviceConfigurationOptionsWithEndpoint: ClientConfiguration = {
        httpOptions: {
            agent: agentForQldb,
        },
        endpoint: sessionEndpointValue
    };
    const retryLimit: number = 4;
    // Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
    const retryConfig: RetryConfig = new RetryConfig(retryLimit);
    const driver = sessionEndpointValue ? new QldbDriver(ledgerName, serviceConfigurationOptionsWithEndpoint, maxConcurrentTransactions, retryConfig)
        : new QldbDriver(ledgerName, serviceConfigurationOptions, maxConcurrentTransactions, retryConfig);
    return {
        execute: executeStatement(driver, enqueueSnackbar)
    };
}

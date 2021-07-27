import {
  QldbDriver,
  Result,
  RetryConfig,
  TransactionExecutor,
} from "amazon-qldb-driver-nodejs";
import { Agent } from "https";

const SEPARATOR = ";";
export let sessionEndpointValue = "";
export const setSessionEndpoint = (endpoint: string) =>
  (sessionEndpointValue = endpoint);

const executeStatement = (driver: QldbDriver) => {
  return async (statement: string): Promise<Result[]> => {
    return await driver.executeLambda(async (txn: TransactionExecutor) => {
      if (!statement) {
        return [];
      }
      const statements = statement
        .split(SEPARATOR)
        .filter((st) => st.trim().length > 0);
      if (statements.length == 0) {
        return [];
      }
      return await Promise.all(statements.map(async (st) => txn.execute(st)));
    });
  };
};

export function openLedger(ledgerName: string) {
  const maxConcurrentTransactions: number = 10;
  const agentForQldb: Agent = new Agent({
    keepAlive: true,
    maxSockets: maxConcurrentTransactions,
    rejectUnauthorized: false, // Don't do this
  });

  const getServiceConfig = () =>
    sessionEndpointValue
      ? {
          httpOptions: { agent: agentForQldb },
          endpoint: sessionEndpointValue,
        }
      : { httpOptions: { agent: agentForQldb } };

  const retryLimit: number = 4;
  // Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
  const retryConfig: RetryConfig = new RetryConfig(retryLimit);
  const driver = new QldbDriver(
    ledgerName,
    getServiceConfig(),
    maxConcurrentTransactions,
    retryConfig
  );
  return {
    execute: executeStatement(driver),
  };
}

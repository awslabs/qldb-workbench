import { QldbDriver } from "amazon-qldb-driver-js/dist/src/QldbDriver";
import { useCallback } from "react";

import { useDriver } from "./useDriver";

interface QLDBResult {
  error: Error | undefined;
  query: <T>(
    lambda: (driver: QldbDriver) => Promise<T[]>
  ) => Promise<{ results: T[]; error?: Error }>;
}

export function useQLDB(ledger: string): QLDBResult {
  const { error: driverError, getDriver } = useDriver();

  const executeQuery = useCallback(
    async <T>(lambda: (driver: QldbDriver) => Promise<T[]>) => {
      const driver = getDriver(ledger);

      if (!driver || driverError) return { results: [], error: driverError };

      try {
        const results = await lambda(driver);

        return { results };
      } catch (error) {
        return { results: [], error };
      }
    },
    [getDriver, ledger, driverError]
  );

  return { error: driverError, query: executeQuery };
}

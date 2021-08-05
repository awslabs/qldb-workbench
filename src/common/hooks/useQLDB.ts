import { QldbDriver } from "amazon-qldb-driver-js/dist/src/QldbDriver";
import { useCallback, useState } from "react";

import { useDriver } from "./useDriver";

interface QLDBResult<T> {
  results: T[];
  error?: Error;
  query: () => Promise<void>;
  clear: () => void;
}

export function useQLDB<T>(
  ledger: string,
  lambda: (driver: QldbDriver) => Promise<T[]>
): QLDBResult<T> {
  const [results, setResults] = useState<T[]>([]);
  const { error: driverError, getDriver } = useDriver();
  const [error, setError] = useState();

  const clear = useCallback(() => {
    setResults([]);
    setError(undefined);
  }, []);

  const executeQuery = useCallback(async () => {
    const driver = getDriver(ledger);

    if (!driver || driverError) return;

    try {
      const result = await lambda(driver);

      setResults(result);
      setError(undefined);
    } catch (e) {
      clear();
      setError(e);
    }
  }, [getDriver, ledger, driverError, lambda, clear]);

  return { results, error: driverError || error, query: executeQuery, clear };
}

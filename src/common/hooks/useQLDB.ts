import { QldbDriver } from "amazon-qldb-driver-js/dist/src/QldbDriver";
import { useCallback, useContext, useState } from "react";

import QLDBSession = require("aws-sdk/clients/qldbsession");
import { ClientConfiguration } from "aws-sdk/clients/qldbsession";
import { AppStateContext } from "../../core/AppStateProvider";

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
  const [error, setError] = useState<Error | undefined>();

  const [
    {
      credentials: { accessKeyId, secretAccessKey },
      region,
    },
  ] = useContext(AppStateContext);

  const clear = useCallback(() => {
    setResults([]);
    setError(undefined);
  }, []);

  const executeQuery = useCallback(async () => {
    if (!accessKeyId || !secretAccessKey) {
      setError(new Error("Missing credentials"));
      return;
    }

    const driver = new QldbDriver(
      ledger,
      {
        region,
        credentials: { accessKeyId, secretAccessKey },
      },
      undefined,
      undefined,
      (options: ClientConfiguration) => new QLDBSession(options)
    );

    try {
      const result = await lambda(driver);

      setResults(result);
      setError(undefined);
    } catch (e) {
      clear();
      setError(e);
    }
  }, [accessKeyId, secretAccessKey, ledger, region, lambda, clear]);

  return { results, error, query: executeQuery, clear };
}

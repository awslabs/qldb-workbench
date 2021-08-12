import { QldbDriver } from "amazon-qldb-driver-js/dist/src/QldbDriver";
import { ClientConfiguration } from "aws-sdk/clients/qldbsession";
import { useContext, useCallback, useState } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import QLDBSession from "aws-sdk/clients/qldbsession";

function getDriverKey(region: string, ledger: string): string {
  return `${region}:${ledger}`;
}

export function useDriver(): {
  error?: Error;
  getDriver: (ledger: string) => QldbDriver | null;
  removeDriver: (ledger: string) => void;
} {
  const [
    {
      credentials: { accessKeyId, secretAccessKey },
      drivers,
      region,
    },
    setAppState,
  ] = useContext(AppStateContext);

  const [error, setError] = useState<Error | undefined>();

  const getDriver = useCallback(
    (ledger: string) => {
      const key = getDriverKey(region, ledger);

      if (key in drivers) {
        return drivers[key];
      }

      if (!accessKeyId || !secretAccessKey) {
        setError(new Error("Missing credentials"));
        return null;
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

      setAppState((state) => ({
        ...state,
        drivers: {
          ...state.drivers,
          [key]: driver,
        },
      }));
      return driver;
    },
    [accessKeyId, drivers, region, secretAccessKey, setAppState]
  );

  const removeDriver = useCallback(
    (ledger: string) => {
      const key = getDriverKey(region, ledger);

      if (key in drivers) {
        setAppState((state) => {
          state.drivers[key].close();
          delete state.drivers[key];
          return { ...state, drivers: { ...state.drivers } };
        });
      }
    },
    [drivers, region, setAppState]
  );

  return { error, getDriver, removeDriver };
}

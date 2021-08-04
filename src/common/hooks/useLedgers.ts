import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import QLDB = require("aws-sdk/clients/qldb");

export function useLedgers(): {
  loading: boolean;
  loadingDetails: boolean;
  selectedLedger?: QLDB.DescribeLedgerResponse;
  ledgers: string[];
  selectLedger: (ledger: string) => void;
} {
  const [ledgers, setLedgers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [ledgerDetails, setLedgerDetails] =
    useState<QLDB.DescribeLedgerResponse>();
  const [
    {
      credentials: { accessKeyId, secretAccessKey },
      ledger,
      region,
    },
    setAppState,
  ] = useContext(AppStateContext);

  const qldbClient = useMemo(() => {
    if (!accessKeyId || !secretAccessKey) {
      return;
    }

    return new QLDB({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }, [accessKeyId, region, secretAccessKey]);

  useEffect(() => {
    if (!qldbClient) return;

    const fetchLedgers = async () => {
      setLoading(true);

      try {
        const result = await qldbClient.listLedgers().promise();

        setLedgers(result.Ledgers?.map((l) => l.Name ?? "") ?? []);
      } finally {
        setLoading(false);
      }
    };
    fetchLedgers();
  }, [qldbClient]);

  useEffect(() => {
    if (!qldbClient) return;

    const fetchLedgerDetails = async (ledger?: string) => {
      setLedgerDetails(undefined);

      if (!ledger) return;

      setLoadingDetails(true);

      try {
        const { $response: _, ...details } = await qldbClient
          .describeLedger({ Name: ledger })
          .promise();

        setLedgerDetails(details);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchLedgerDetails(ledger);
  }, [ledger, qldbClient]);

  const selectLedger = useCallback(
    (ledger) => {
      setAppState((state) => ({ ...state, ledger }));
    },
    [setAppState]
  );

  return {
    loading,
    loadingDetails,
    selectedLedger: ledgerDetails,
    ledgers,
    selectLedger,
  };
}

import { AWSError, QLDB } from "aws-sdk";
import {
  CreateLedgerRequest,
  LedgerList,
  LedgerSummary,
  ListLedgersResponse,
} from "aws-sdk/clients/qldb";
import { dom } from "ion-js";
import { openLedger, sessionEndpointValue } from "./session";
import { ClientConfiguration } from "aws-sdk/clients/acm";
import { qldbRegions } from "./AppBar";
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { PromiseResult } from "aws-sdk/lib/request";

export let frontendEndpointValue: string | undefined = undefined;

function determineRegion(endpoint: string) {
  const regions = qldbRegions.filter((region) =>
    endpoint.includes(region.region)
  );
  return regions.length > 0 ? regions[0].region : undefined;
}

export const setFrontendEndpoint = (
  endpoint: string,
  setRegion: (region: string) => void,
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey
) => {
  frontendEndpointValue = endpoint;
  const region = determineRegion(endpoint);
  if (region) {
    setRegion(region);
    enqueueSnackbar(
      `Region changed to ${region} to match frontend endpoint region.`,
      { variant: "success" }
    );
  }
};

export async function listLedgers(
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey
): Promise<LedgerSummary[]> {
  let ledgers: PromiseResult<ListLedgersResponse, AWSError>;
  try {
    if (frontendEndpointValue) {
      const serviceConfigurationOptions: ClientConfiguration = {
        endpoint: frontendEndpointValue,
      };
      ledgers = await new QLDB(serviceConfigurationOptions)
        .listLedgers()
        .promise();
    } else {
      ledgers = await new QLDB().listLedgers().promise();
    }
    if (!ledgers || !ledgers.Ledgers || ledgers.Ledgers.length == 0) {
      const errorMessage = "No ledgers found.";
      enqueueSnackbar(errorMessage, { variant: "warning" });
    }
    return ledgers.Ledgers || [];
  } catch (e) {
    const errorMessage = frontendEndpointValue
      ? "Error while fetching ledgers.\nMake sure frontend endpoint override is correct."
      : "Error while fetching ledgers.";
    enqueueSnackbar(errorMessage, { variant: "error" });
    console.log(e);
    return [];
  }
}

export async function createLedger(
  name: string,
  deletionProtection: boolean = false,
  tags: { [key: string]: string },
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey
) {
  let request: CreateLedgerRequest = {
    Name: name,
    DeletionProtection: deletionProtection,
    PermissionsMode: "ALLOW_ALL",
    Tags: tags,
  };
  try {
    let ledgerArn;
    if (frontendEndpointValue) {
      const serviceConfigurationOptions: ClientConfiguration = {
        endpoint: frontendEndpointValue,
      };
      ledgerArn = await new QLDB(serviceConfigurationOptions)
        .createLedger(request)
        .promise()
        .then((response) => response.Arn);
    } else {
      ledgerArn = await new QLDB()
        .createLedger(request)
        .promise()
        .then((response) => response.Arn);
    }
    enqueueSnackbar(`Ledger with arn: ${ledgerArn} successfully created.`, {
      variant: "success",
    });
  } catch (e) {
    enqueueSnackbar(e.toLocaleString(), { variant: "error" });
  }
}

export async function deleteLedger(
  name: string,
  enqueueSnackbar: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey
) {
  try {
    if (frontendEndpointValue) {
      const serviceConfigurationOptions: ClientConfiguration = {
        endpoint: frontendEndpointValue,
      };
      await new QLDB(serviceConfigurationOptions)
        .deleteLedger({ Name: name })
        .promise();
    } else {
      await new QLDB().deleteLedger({ Name: name }).promise();
    }
    enqueueSnackbar(`Ledger with name: ${name} successfully deleted.`, {
      variant: "success",
    });
  } catch (e) {
    enqueueSnackbar(e.toLocaleString(), { variant: "error" });
  }
}

export async function getLedgerMetaData(
  ledgerSummary: LedgerSummary,
  enqueueSnackbar?: (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => SnackbarKey
): Promise<LedgerInfo> {
  if (!ledgerSummary.Name) {
    return nullLedger;
  }
  let ledger: LedgerInfo;
  if (frontendEndpointValue) {
    const serviceConfigurationOptions: ClientConfiguration = {
      endpoint: frontendEndpointValue,
    };
    ledger = await new QLDB(serviceConfigurationOptions)
      .describeLedger({ Name: ledgerSummary.Name })
      .promise();
  } else {
    ledger = await new QLDB()
      .describeLedger({ Name: ledgerSummary.Name })
      .promise();
  }

  if (ledger.State === "ACTIVE") {
    try {
      const result = await openLedger(ledgerSummary.Name).execute(
        "SELECT * FROM information_schema.user_tables"
      );
      ledger.tables = parseTableInfos(result[0].getResultList());
    } catch (e) {
      const errorMessage = `Unable to execute query on ledger ${
        ledgerSummary.Name
      }. ${
        frontendEndpointValue || sessionEndpointValue
          ? "Make sure you have set session endpoint correctly."
          : ""
      }. ${e}`;
      enqueueSnackbar && enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }
  return ledger;
}

const nullLedger: LedgerInfo = {
  Name: "<NONE>",
  State: "INACTIVE",
  tables: [],
};

export interface LedgerInfo extends LedgerSummary {
  tables?: TableInfo[];
}

export interface TableInfo {
  name: string;
  tableId: string;
  status: string;
  indexes: IndexInfo[];
}

export interface IndexInfo {
  expr: string;
  indexId: string;
  status: string;
}

function parseTableInfos(values: dom.Value[]): TableInfo[] {
  return values.map((value) => parseTableInfo(value));
}

function parseTableInfo(value: dom.Value): TableInfo {
  return {
    name: value.get("name")!.stringValue()!,
    tableId: value.get("tableId")!.stringValue()!,
    status: value.get("status")!.stringValue()!,
    indexes: parseIndexInfos(value.get("indexes")!.elements()),
  };
}

function parseIndexInfos(values: dom.Value[]): IndexInfo[] {
  return values.map((value) => parseIndexInfo(value));
}

function parseIndexInfo(value: dom.Value): IndexInfo {
  return {
    expr: value.get("expr")!.stringValue()!,
    indexId: value.get("indexId")!.stringValue()!,
    status: value.get("status")!.stringValue()!,
  };
}

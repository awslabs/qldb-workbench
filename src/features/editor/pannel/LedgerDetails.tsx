import { Spinner } from "@awsui/components-react";
import SpaceBetween from "@awsui/components-react/space-between";
import StatusIndicator from "@awsui/components-react/status-indicator";
import { QLDB } from "aws-sdk";
import * as React from "react";
import { FlexContainer } from "../../../common/components/FlexContainer";
import { ValueWithLabel } from "../../../common/components/ValueWithLabel";
import { getStatus } from "../../../common/utils/statusUtils";
import { capitalizeFirstLetter } from "../../../common/utils/stringUtils";

import "./styles.scss";

interface Props {
  loading: boolean;
  ledger?: QLDB.DescribeLedgerResponse;
}

export function LedgerDetails(props: Props): JSX.Element {
  const { loading, ledger } = props;

  return (
    <FlexContainer
      header={loading ? <Spinner /> : ledger?.Name}
      handle={{ direction: "horizontal", position: "start" }}
    >
      <div>
        <SpaceBetween size="s">
          <ValueWithLabel label="Status">
            {ledger ? (
              <StatusIndicator type={getStatus(ledger.State)}>
                {capitalizeFirstLetter(ledger.State)}
              </StatusIndicator>
            ) : (
              "-"
            )}
          </ValueWithLabel>
          <ValueWithLabel label="Creation time">
            {ledger?.CreationDateTime?.toLocaleString() ?? "-"}
          </ValueWithLabel>
          <ValueWithLabel label="Permission mode">
            {ledger ? capitalizeFirstLetter(ledger.PermissionsMode) : "-"}
          </ValueWithLabel>
          <ValueWithLabel label="Deletion protection">
            {ledger
              ? ledger.DeletionProtection
                ? "Enabled"
                : "Disabled"
              : "-"}
          </ValueWithLabel>
          <ValueWithLabel label="Ledger Amazon Resource Name (ARN)">
            {ledger?.Arn ?? "-"}
          </ValueWithLabel>
        </SpaceBetween>
      </div>
    </FlexContainer>
  );
}

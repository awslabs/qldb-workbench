import { StatusIndicator } from "@awsui/components-react";
import * as React from "react";
import { getStatus } from "../utils/statusUtils";
import { capitalizeFirstLetter } from "../utils/stringUtils";

interface Props {
  value: string;
}

export const StatusIcon: React.FC<Props> = ({ value }: Props) => (
  <StatusIndicator key="status" type={getStatus(value)}>
    {capitalizeFirstLetter(value)}
  </StatusIndicator>
);

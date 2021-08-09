import Box from "@awsui/components-react/box";
import { PropsWithChildren } from "react";
import * as React from "react";

interface Props {
  label: string;
}

export const ValueWithLabel = (
  props: PropsWithChildren<Props>
): JSX.Element => {
  const { label, children } = props;

  return (
    <div>
      <Box margin={{ bottom: "xxxs" }} color="text-label">
        {label}
      </Box>
      <div>{children}</div>
    </div>
  );
};

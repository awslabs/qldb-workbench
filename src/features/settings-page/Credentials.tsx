import { Box, Input } from "@awsui/components-react";
import * as React from "react";
import { useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";

export function Credentials(): JSX.Element {
  const [{ credentials }, setAppState] = useContext(AppStateContext);

  return (
    <div className="setting-credentials">
      <Box margin={{ bottom: "xxxs" }} color="text-label">
        AWS AccessKeyId:
      </Box>
      <div>
        <Input
          value={credentials?.accessKeyId ?? ""}
          onChange={({ detail }) =>
            setAppState((state) => ({
              ...state,
              credentials: {
                ...credentials,
                accessKeyId: detail.value,
              },
            }))
          }
        />
      </div>
      <Box margin={{ bottom: "xxxs" }} color="text-label">
        AWS secretAccessKey:
      </Box>
      <div>
        <Input
          value={credentials?.secretAccessKey ?? ""}
          type="password"
          onChange={({ detail }) =>
            setAppState((state) => ({
              ...state,
              credentials: {
                ...credentials,
                secretAccessKey: detail.value,
              },
            }))
          }
        />
      </div>
    </div>
  );
}

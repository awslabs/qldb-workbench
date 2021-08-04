import { NonCancelableEventHandler } from "@awsui/components-react/internal/events";
import Select, { SelectProps } from "@awsui/components-react/select";
import * as React from "react";
import { useCallback, useContext } from "react";
import { AppStateContext } from "../../core/AppStateProvider";
import "./styles.scss";

enum Region {
  "us-east-1" = "US East (N. Virginia)",
  "us-east-2" = "US East (Ohio)",
  "us-west-2" = "US West (Oregon)",
  "ap-northeast-2" = "Asia Pacific (Seoul)",
  "ap-southeast-1" = "Asia Pacific (Singapore)",
  "ap-southeast-2" = "Asia Pacific (Sydney)",
  "ap-northeast-1" = "Asia Pacific (Tokyo)",
  "eu-central-1" = "Europe (Frankfurt)",
  "eu-west-1" = "Europe (Ireland)",
  "eu-west-2" = "Europe (London)",
}

export function RegionSelector(): JSX.Element {
  const [{ region }, setAppState] = useContext(AppStateContext);

  const handleRegionChange: NonCancelableEventHandler<SelectProps.ChangeDetail> =
    useCallback(
      ({ detail }) => {
        setAppState((state) => ({
          ...state,
          region: detail.selectedOption.value as Region,
        }));
      },
      [setAppState]
    );

  return (
    <Select
      className="region-selector"
      selectedOption={{ value: region, label: Region[region] }}
      onChange={handleRegionChange}
      options={Object.entries(Region).map(([id, label]) => ({
        label,
        value: id,
      }))}
      selectedAriaLabel="Regions"
    />
  );
}

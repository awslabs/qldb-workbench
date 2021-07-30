import Select from "@awsui/components-react/select";
import * as React from "react";
import "./styles.scss";

type Regions = "us-east-1" | "us-west-1";

interface Option {
  label: string;
  value?: Regions;
}

export function RegionSelector() {
  const [selectedOption, setSelectedOption] = React.useState<Option>({
    label: "N. Virginia",
    value: "us-east-1",
  });

  return (
    <Select
      className="region-selector"
      selectedOption={selectedOption}
      onChange={({ detail: { selectedOption } }) =>
        setSelectedOption(selectedOption as Option)
      }
      options={[
        {
          label: "N. Virginia",
          value: "us-east-1",
        },
        {
          label: "N. California",
          value: "us-west-1",
        },
      ]}
      selectedAriaLabel="Regions"
    />
  );
}

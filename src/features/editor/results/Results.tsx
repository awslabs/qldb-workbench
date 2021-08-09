import Alert from "@awsui/components-react/alert";
import * as React from "react";
import { useContext } from "react";
import JSONTree from "react-json-tree";
import { FlexContainer } from "../../../common/components/FlexContainer";
import { ThemeContext } from "../../../core/ThemeProvider";

interface Props {
  results: unknown[];
  error?: Error;
}

function EmptyResults() {
  return (
    <div>
      <h3>No results to show</h3>
      <p>{"You haven't finished running any queries."}</p>
    </div>
  );
}

export function Results(props: Props): JSX.Element {
  const { results, error } = props;
  const [theme] = useContext(ThemeContext);

  return (
    <FlexContainer
      header={`Results${results.length > 0 ? ` (${results.length})` : ""}`}
      handle={{ direction: "horizontal", position: "start" }}
    >
      <div>
        {error ? (
          <Alert type="error" header={error.name}>
            {error.message}
          </Alert>
        ) : results.length === 0 ? (
          <EmptyResults />
        ) : (
          results.map((result, i) => (
            <JSONTree
              key={`results-json-${i}`}
              keyPath={[i]}
              data={result}
              theme="tomorrow"
              invertTheme={theme === "light"}
            />
          ))
        )}
      </div>
    </FlexContainer>
  );
}

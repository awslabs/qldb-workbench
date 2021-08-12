import Alert from "@awsui/components-react/alert";
import * as React from "react";
import { useContext } from "react";
import JSONTree from "react-json-tree";
import { FlexContainer } from "../../../common/components/FlexContainer";
import { ThemeContext } from "../../../core/ThemeProvider";

export type ResultsData = {
  [query: string]: unknown[];
}[];
interface Props {
  results: ResultsData;
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
  const multiStatement = results.length > 1;
  const totalResults = results.reduce(
    (all, res) => all + Object.values(res).flat().length,
    0
  );

  return (
    <FlexContainer
      header={`Results${results.length > 0 ? ` (${totalResults})` : ""}`}
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
              hideRoot
              shouldExpandNode={(_a, _b, level) => level < 2}
              key={`results-json-${i}`}
              keyPath={[i]}
              data={
                multiStatement || totalResults === 0
                  ? result
                  : Object.values(result)[0]
              }
              theme="tomorrow"
              invertTheme={theme === "light"}
            />
          ))
        )}
      </div>
    </FlexContainer>
  );
}

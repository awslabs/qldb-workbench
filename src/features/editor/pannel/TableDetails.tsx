import { Container, Spinner } from "@awsui/components-react";
import SpaceBetween from "@awsui/components-react/space-between";
import StatusIndicator from "@awsui/components-react/status-indicator";
import * as React from "react";
import { useEffect, useState } from "react";
import { TableInfo } from "../../../apis/qldb/ledger";
import { FlexContainer } from "../../../common/components/FlexContainer";
import { ItemsList } from "../../../common/components/ItemsList";
import { ValueWithLabel } from "../../../common/components/ValueWithLabel";
import { useQLDB } from "../../../common/hooks/useQLDB";
import { getStatus } from "../../../common/utils/statusUtils";
import { capitalizeFirstLetter } from "../../../common/utils/stringUtils";

import "./styles.scss";

interface Props {
  ledger: string;
  table: string;
}

export function TableDetails(props: Props): JSX.Element {
  const { ledger, table } = props;
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<TableInfo>();
  const { query } = useQLDB(ledger);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);

      try {
        const result = await query((driver) =>
          driver.executeLambda(async (txn) => {
            const res = await txn.execute(
              `SELECT * FROM information_schema.user_tables WHERE name = '${table}';`
            );

            return res
              .getResultList()
              .map((r) => JSON.parse(JSON.stringify(r)) as TableInfo);
          })
        );

        setDetails(result.results[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [query, table]);

  return (
    <FlexContainer
      header={loading ? <Spinner /> : details?.name}
      handle={{ direction: "horizontal", position: "start" }}
      containerProps={{ disableContentPaddings: true }}
    >
      <div>
        <Container>
          <SpaceBetween size="s">
            <ValueWithLabel label="ID">
              {details ? details.tableId : "-"}
            </ValueWithLabel>
            <ValueWithLabel label="Table Name">
              {details ? details.name : "-"}
            </ValueWithLabel>
            <ValueWithLabel label="Status">
              {details ? (
                <StatusIndicator type={getStatus(details.status)}>
                  {capitalizeFirstLetter(details.status)}
                </StatusIndicator>
              ) : (
                "-"
              )}
            </ValueWithLabel>
          </SpaceBetween>
        </Container>
        <ItemsList
          header="indexes"
          loading={loading}
          items={details?.indexes ?? []}
          columns={[
            { fieldName: "expr", header: "Field name" },
            { fieldName: "indexId", header: "ID" },
          ]}
        />
      </div>
    </FlexContainer>
  );
}

import { Container, Header } from "@awsui/components-react";
import * as React from "react";

export function PageNotFound(): JSX.Element {
  return (
    <Container
      header={<Header variant="h2">Page Not found</Header>}
    ></Container>
  );
}

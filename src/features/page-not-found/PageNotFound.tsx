import { Container, Header } from "@awsui/components-react";
import * as React from "react";

export function PageNotFound({ name }) {
  return (
    <Container
      header={<Header variant="h2">Page {name} Not found</Header>}
    ></Container>
  );
}

import { Container, Header, SpaceBetween } from "@awsui/components-react";
import * as React from "react";
import { ThemeSelector } from "./ThemeSelector";

import "./styles.scss";
import { Credentials } from "./Credentials";

export function Settings(): JSX.Element {
  return (
    <div className="settings">
      <Container header={<Header variant="h2">Settings</Header>}>
        <SpaceBetween size="s">
          <ThemeSelector />
          <Credentials />
        </SpaceBetween>
      </Container>
    </div>
  );
}

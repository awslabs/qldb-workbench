import { Container, Header } from "@awsui/components-react";
import * as React from "react";
import { ThemeSelector } from "./ThemeSelector";

import "./styles.scss";

export function Settings() {
  return (
    <div className="settings">
      <Container header={<Header variant="h2">Settings</Header>}>
        <ThemeSelector />
      </Container>
    </div>
  );
}

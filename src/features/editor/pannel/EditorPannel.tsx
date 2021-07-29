import * as React from "react";
import { FlexContainer } from "../../../common/components/FlexContainer";

import "./styles.scss";

export function EditorPannel() {
  return (
    <FlexContainer
      header="Ledgers"
      handle={{ direction: "vertical", position: "end" }}
    >
      <p>This is the browse tool content</p>
    </FlexContainer>
  );
}

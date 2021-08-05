import * as React from "react";
import { FlexContainer } from "../../../common/components/FlexContainer";

import "./styles.scss";

export function EditorPannel(): JSX.Element {
  return (
    <FlexContainer handle={{ direction: "vertical", position: "end" }}>
      <p>This is the browse tool content</p>
    </FlexContainer>
  );
}

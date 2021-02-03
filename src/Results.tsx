import * as React from "react";
import ContentEditable from "react-contenteditable";
import {Color, EDITOR_STYLE} from "./App";

export default ({ resultsText }: { resultsText: string }) => {
    return <ContentEditable html={resultsText} onChange={() => {}} style={Object.assign({ backgroundColor: Color.LIGHTGRAY, flex: 1 }, EDITOR_STYLE)} />;
}


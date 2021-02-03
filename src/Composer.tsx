import * as React from "react";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";
import {EDITOR_STYLE} from "./App";
import ActionBar from "./ActionBar";

export default ({ executeText }: { executeText: (text: string) => void }) => {
    const text = React.useRef("");

    const handleChange = (e: ContentEditableEvent) => {
        text.current = e.target.value;
    };

    return <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <ContentEditable html={text.current} onChange={handleChange} style={EDITOR_STYLE} onKeyDown={e => {
            if (e.metaKey && e.key === "e") {
                executeText(text.current);
            }
        }} />
        <ActionBar executeButtonClicked={() => {
            executeText(text.current);
        }}/>
    </div>
}


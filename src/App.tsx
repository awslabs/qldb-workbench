import * as React from "react";
import * as ReactDOM from "react-dom";
import SplitPane from "react-split-pane";
import ContentEditable, {ContentEditableEvent} from "react-contenteditable";

const EDITOR_STYLE = {padding: "1px", width: "100%", height: "100%", overflow: "scroll", fontFamily: "Courier New", fontSize: "10pt"};

const Composer = () => {
    const text = React.useRef("");

    const handleChange = (e: ContentEditableEvent) => {
        text.current = e.target.value;
    };

    return <ContentEditable html={text.current} onChange={handleChange} style={EDITOR_STYLE} />
}

const Results = () => {
    const text = React.useRef("");

    const handleChange = (e: ContentEditableEvent) => {
        text.current = e.target.value;
    };

    return <ContentEditable html={text.current} onChange={handleChange} style={Object.assign({ backgroundColor: "#fafafa" }, EDITOR_STYLE)} />
}

const App = () => <div>
    <SplitPane split="horizontal" size="80%">
        <Composer />
        <Results />
    </SplitPane>
</div>;

ReactDOM.render(<App />, document.getElementById("main"));
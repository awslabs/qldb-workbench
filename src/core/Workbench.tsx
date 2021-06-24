import * as React from "react";
import * as ReactDOM from "react-dom";

function Workbench() {
    return <>
        <header>This is the header</header>
        <main>
            <p>This is the main</p>
            <p>More main content</p>
            <p>Yet another paragraph with some more text and even more text</p>
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
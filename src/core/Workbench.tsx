import * as React from "react";
import * as ReactDOM from "react-dom";

function Workbench() {
    return <>
        <header>This is the header</header>
        <main>
            <nav>This is the nav</nav>
            <section>This is where the files will go</section>
            <div id="tools">This is where the toolbox will go</div>
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
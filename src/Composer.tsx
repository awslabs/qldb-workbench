import * as React from "react";
import {Color, CurrentTheme, Theme} from "./App";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql"
import "ace-builds/src-noconflict/theme-textmate"
import "ace-builds/src-noconflict/ext-language_tools"
import ace from "ace-builds/src-noconflict/ace";

export class Composer extends React.Component<{ composerText: string, executeStatement: () => void, setComposerText: (text: string) => void }> {
    componentDidMount() {
        initDefaultCompleters()
    }

    render() {
        let {composerText, setComposerText, executeStatement} = this.props;
        const COMPOSER_STYLE = {
            padding: "1px",
            width: "100%",
            height: "100%",
            overflow: "scroll",
            fontSize: "12pt"
        };

        const executeCode = {
            name: "executeCode",
            bindKey: {win: 'Ctrl-E', mac: 'Command-E'},
            exec: () => {
                executeStatement()
            },
            readOnly: true
        };

        return <div style={{width: "100%", display: "flex", flexDirection: "column"}} id={"composer"}>
            <AceEditor
                name={"aceEditor"}
                mode={"sql"}
                theme={CurrentTheme == Theme.LIGHT ? "textmate" : "dracula"}
                style={COMPOSER_STYLE}
                onChange={setComposerText}
                commands={[executeCode]}
                value={composerText}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                enableSnippets={true}
            />
            <ActionBar executeButtonClicked={() => {
                executeStatement();
            }}/>
        </div>
    }
}

const ActionBar = ({executeButtonClicked}: { executeButtonClicked: () => void }) => {
    return <span className="action-bar">
        <span className="action-button" onClick={executeButtonClicked}><GoSvg color={Color.GREEN}/></span>
    </span>;
}

const GoSvg = ({color}: { color: Color }) =>
    <svg width="20px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="running"
         role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 512"
         className="svg-inline--fa fa-running fa-w-13 fa-2x">
        <path fill={color}
              d="M272 96c26.51 0 48-21.49 48-48S298.51 0 272 0s-48 21.49-48 48 21.49 48 48 48zM113.69 317.47l-14.8 34.52H32c-17.67 0-32 14.33-32 32s14.33 32 32 32h77.45c19.25 0 36.58-11.44 44.11-29.09l8.79-20.52-10.67-6.3c-17.32-10.23-30.06-25.37-37.99-42.61zM384 223.99h-44.03l-26.06-53.25c-12.5-25.55-35.45-44.23-61.78-50.94l-71.08-21.14c-28.3-6.8-57.77-.55-80.84 17.14l-39.67 30.41c-14.03 10.75-16.69 30.83-5.92 44.86s30.84 16.66 44.86 5.92l39.69-30.41c7.67-5.89 17.44-8 25.27-6.14l14.7 4.37-37.46 87.39c-12.62 29.48-1.31 64.01 26.3 80.31l84.98 50.17-27.47 87.73c-5.28 16.86 4.11 34.81 20.97 40.09 3.19 1 6.41 1.48 9.58 1.48 13.61 0 26.23-8.77 30.52-22.45l31.64-101.06c5.91-20.77-2.89-43.08-21.64-54.39l-61.24-36.14 31.31-78.28 20.27 41.43c8 16.34 24.92 26.89 43.11 26.89H384c17.67 0 32-14.33 32-32s-14.33-31.99-32-31.99z"
              className=""/>
    </svg>;

let defaultCompleters: any[] = []

function initDefaultCompleters() {
    const editor = ace.edit("aceEditor")
    let systemTables = ["information_schema.user_tables"];
    defaultCompleters = [...editor.completers, tableNameCompleter(systemTables, "SystemTables")]
}

const tableNameCompleter = (names: string[], meta: string = "TableName") => {
    return {
        getCompletions: function (editor: any, session: any, pos: any, prefix: any, callback: any) {
            callback(null, names.map(function (name) {
                return {caption: name, value: name, meta: meta};
            }));
        }
    }
}

export function addCompleterForUserTables(names: string[], meta: string = "TableName") {
    const editor = ace.edit("aceEditor")
    editor.completers = [...defaultCompleters, tableNameCompleter(names)]
}

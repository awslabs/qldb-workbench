import * as React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import ace from "ace-builds/src-noconflict/ace";
import PartiQLMode, { defaultSnippets, Snippets } from "../mode/PartiQLMode";

const COMPOSER_STYLE = {
  width: "100%",
  height: "100%",
  fontSize: "12pt",
};

export class Composer extends React.Component<{
  executeStatement: () => void;
}> {
  componentDidMount() {
    updatePartiqlMode();
    initDefaultCompleters();
  }

  render() {
    const { executeStatement } = this.props;

    const executeCode = {
      name: "executeCode",
      bindKey: { win: "Ctrl-E", mac: "Command-E" },
      exec: executeStatement,
      readOnly: true,
    };

    return (
      <AceEditor
        name={"aceEditor1"}
        mode={"text"} // Just to initialize.. Once loaded it will be updated to PartiQL
        theme={"textmate"}
        style={COMPOSER_STYLE}
        commands={[executeCode]}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
        enableSnippets={true}
      />
    );
  }
}

let defaultCompleters: any[] = [];

function updatePartiqlMode() {
  const partiQLMode = new PartiQLMode();
  const editor = ace.edit("aceEditor1");
  editor.setShowPrintMargin(false);
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setMode(partiQLMode);
}

function initDefaultCompleters() {
  const editor = ace.edit("aceEditor1");
  let systemTables = ["information_schema.user_tables"];
  defaultCompleters = [
    ...editor.completers,
    tableNameCompleter(systemTables, "SystemTables"),
    snippetCompleter(defaultSnippets),
  ];
}

const snippetCompleter = (snippets: Snippets[]) => {
  return {
    getCompletions: function (
      editor: any,
      session: any,
      pos: any,
      prefix: any,
      callback: any
    ) {
      callback(
        null,
        snippets.map((snippet) => ({
          caption: snippet.name,
          snippet: snippet.snippet,
          meta: "Snippet",
        }))
      );
    },
  };
};

const tableNameCompleter = (names: string[], meta: string = "TableName") => {
  return {
    getCompletions: function (
      editor: any,
      session: any,
      pos: any,
      prefix: any,
      callback: any
    ) {
      callback(
        null,
        names.map((name) => ({ caption: name, value: name, meta: meta }))
      );
    },
  };
};

export function addCompleterForUserTables(names: string[]) {
  const editor = ace.edit("aceEditor1");
  editor.completers = [
    ...defaultCompleters,
    tableNameCompleter(names),
    tableNameCompleter(
      names.map((name) => `_ql_committed_${name}`),
      "TableMetadata"
    ),
  ];
}

export function changeEditorTheme(darkState: boolean) {
  ace
    .edit("aceEditor1")
    .setTheme(darkState ? "ace/theme/textmate" : "ace/theme/ambiance");
}

import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Results } from "./results/Results";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/mode-sql";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-min-noconflict/theme-dawn";
import "ace-builds/src-min-noconflict/ext-language_tools.js";
import { EditorPannel } from "./pannel/EditorPannel";
import { useTabs } from "../../common/hooks/useTabs";
import { Actions as EditorActions } from "./Actions";

import "./styles.scss";
import { useQLDB } from "../../common/hooks/useQLDB";
import { TransactionExecutor } from "amazon-qldb-driver-js/dist/src/TransactionExecutor";
import { dom } from "ion-js";

export function Editor(): JSX.Element {
  const [theme] = useContext(ThemeContext);
  const [tabs, content, setTabContent] = useTabs();
  const { results, error, query, clear } = useQLDB<dom.Value>(
    "TestLedger",
    (driver) =>
      driver.executeLambda(async (txn: TransactionExecutor) => {
        const result = await txn.execute(content);

        return result.getResultList().map((r) => JSON.parse(JSON.stringify(r)));
      })
  );

  return (
    <div className="editor-container">
      <EditorPannel />
      <section className="main-section">
        {tabs}
        <div className="editor">
          <AceEditor
            enableLiveAutocompletion
            setOptions={{ scrollPastEnd: true }}
            value={content}
            onChange={setTabContent}
            theme={theme === "dark" ? "tomorrow_night_bright" : "dawn"}
            mode={"sql"}
            width="100%"
            height="100%"
          />
        </div>
        <EditorActions
          onRun={query}
          onSave={() => {
            throw new Error("Not implemented yet");
          }}
          onClear={() => {
            setTabContent("");
            clear();
          }}
        />
        <Results error={error} results={results} />
      </section>
    </div>
  );
}

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

export function Editor() {
  const [theme] = useContext(ThemeContext);
  const [tabs, content, setTabContent] = useTabs();

  return (
    <div className="editor-container">
      <EditorPannel />
      <section className="main-section">
        {tabs}
        <div className="editor">
          <AceEditor
            enableLiveAutocompletion
            value={content}
            onChange={setTabContent}
            theme={theme === "dark" ? "tomorrow_night_bright" : "dawn"}
            mode={"sql"}
            width="100%"
            height="100%"
          />
        </div>
        <Results />
      </section>
    </div>
  );
}

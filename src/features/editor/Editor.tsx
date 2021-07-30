import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Results } from "./results/Results";
import { Tab } from "./Tab";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-min-noconflict/theme-dawn";
import { EditorPannel } from "./ledgers/EditorPannel";

export function Editor() {
  const [theme] = useContext(ThemeContext);

  return (
    <div className="editor-container">
      <EditorPannel />
      <section className="main-section">
        <ul className="editor-tabs">
          <li>
            <Tab name="Buffer One" />
          </li>
          <li>
            <Tab name="Buffer Two" />
          </li>
          <li>
            <Tab name="Buffer Three" />
          </li>
        </ul>
        <div className="editor">
          <AceEditor
            theme={theme === "dark" ? "tomorrow_night_bright" : "dawn"}
            mode={"text"}
            width="100%"
            height="100%"
          />
        </div>
        <Results />
      </section>
    </div>
  );
}

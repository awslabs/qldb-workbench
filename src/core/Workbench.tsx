import * as React from "react";

import "../../assets/styles.scss";
import "@awsui/global-styles/index.css";
import { Topbar } from "../features/topbar/Topbar";
import ThemeProvider from "./ThemeProvider";
import { Navigation } from "../features/navigation/Navigation";
import { Editor } from "../features/editor/Editor";

export function Workbench() {
  return (
    <ThemeProvider className="root">
      <Topbar />
      <Navigation />
      <main>
        <Editor />
      </main>
    </ThemeProvider>
  );
}

import * as React from "react";

import { Topbar } from "../features/topbar/Topbar";
import ThemeProvider from "./ThemeProvider";
import { Navigation } from "../features/navigation/Navigation";
import { Editor } from "../features/editor/Editor";

import "../../assets/styles.scss";
import "@awsui/global-styles/index.css";
import { PageNotFound } from "../features/page-not-found/PageNotFound";
import { Page, usePage } from "../common/hooks/usePage";
import { Settings } from "../features/settings-page/Settings";
import { useShortcuts } from "../common/hooks/useShortcuts";

function getMainPage(page: Page) {
  switch (page) {
    case "editor":
      return <Editor />;
    case "settings":
      return <Settings />;
    default:
      return <PageNotFound name={page} />;
  }
}

function Workbench() {
  const [page, setPage] = usePage();
  useShortcuts();

  return (
    <>
      <Topbar />
      <Navigation page={page} onPageChange={setPage} />
      <main>{getMainPage(page)}</main>
    </>
  );
}

export default function ThemedWorkbench(): React.ReactElement {
  return (
    <ThemeProvider className="root">
      <Workbench />
    </ThemeProvider>
  );
}

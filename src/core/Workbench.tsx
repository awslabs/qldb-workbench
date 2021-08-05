import * as React from "react";

import { Topbar } from "../features/topbar/Topbar";
import { Navigation } from "../features/navigation/Navigation";
import { Editor } from "../features/editor/Editor";

import "../../assets/styles.scss";
import "@awsui/global-styles/index.css";
import { Settings } from "../features/settings-page/Settings";
import { useShortcuts } from "../common/hooks/useShortcuts";
import { Page } from "../common/components/Page";
import { Pages } from "../common/components/Pages";
import { PageNotFound } from "../features/page-not-found/PageNotFound";
import AppStateProvider from "./AppStateProvider";

function Workbench() {
  useShortcuts();

  return (
    <>
      <Topbar />
      <Pages defaultPage="editor">
        <Navigation />
        <main>
          <Page name="editor">
            <Editor />
          </Page>
          <Page name="recent">
            <PageNotFound />
          </Page>
          <Page name="saved">
            <PageNotFound />
          </Page>
          <Page name="verification">
            <PageNotFound />
          </Page>
          <Page name="settings">
            <Settings />
          </Page>
          <Page name="feedback">
            <PageNotFound />
          </Page>
        </main>
      </Pages>
    </>
  );
}

export default function ThemedWorkbench(): React.ReactElement {
  return (
    <AppStateProvider className="root">
      <Workbench />
    </AppStateProvider>
  );
}

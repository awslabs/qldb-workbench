import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Results, ResultsData } from "./results/Results";
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
import { AppStateContext } from "../../core/AppStateProvider";
import { TransactionExecutor } from "amazon-qldb-driver-js/dist/src/TransactionExecutor";
import { useRecentQueries } from "../../common/hooks/useRecentQueries";
import { useSavedQueries } from "../../common/hooks/useSavedQueries";
import { useEffect } from "react";

export function Editor(): JSX.Element {
  const [theme] = useContext(ThemeContext);
  const [{ ledger }, setAppState] = useContext(AppStateContext);
  const { tabsComponent: tabs, content, changeTabContent } = useTabs();
  const { addRecentQuery } = useRecentQueries();
  const { addSavedQuery } = useSavedQueries();
  const [results, setResults] = useState<ResultsData>([]);
  const [error, setError] = useState<Error>();
  const [saved, setSaved] = useState(false);
  const { error: driverError, query } = useQLDB(ledger ?? "");
  const queries = content.split(";").filter((q) => q.trim());

  const handleRun = useCallback(async () => {
    if (!ledger) return;

    setError(undefined);
    const result = await query((driver) =>
      driver.executeLambda(async (txn: TransactionExecutor) => {
        const results = await Promise.all(
          queries.map(async (query) => ({
            query,
            result: await txn.execute(query),
          }))
        );

        return results.map(({ query, result }) => ({
          [query]: result
            .getResultList()
            .map((r) => JSON.parse(JSON.stringify(r)) as unknown),
        }));
      })
    );

    addRecentQuery({
      query: content,
      status: result.error ? "ERROR" : "SUCCESS",
      createdAt: new Date().toDateString(),
      ledger,
    });

    if (result.error) {
      setResults([]);
      setError(result.error);
      return;
    }

    setResults(result.results);
  }, [addRecentQuery, content, ledger, queries, query]);

  const handleSave = useCallback(() => {
    if (!ledger) return;

    setSaved(true);
    addSavedQuery({
      query: content,
      createdAt: new Date().toDateString(),
      ledger,
      description: undefined,
    });
    setAppState((state) => ({ ...state, currentPage: "saved" }));
  }, [addSavedQuery, content, ledger, setAppState]);

  const handleContentChange = useCallback(
    (content: string) => {
      changeTabContent(content);
    },
    [changeTabContent]
  );
  useEffect(() => setSaved(false), [content]);

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
            onChange={handleContentChange}
            theme={theme === "dark" ? "tomorrow_night_bright" : "dawn"}
            mode={"sql"}
            width="100%"
            height="100%"
          />
        </div>
        <EditorActions
          onRun={handleRun}
          onSave={saved ? undefined : handleSave}
          onClear={() => {
            changeTabContent("");
            setResults([]);
          }}
        />
        <Results error={driverError || error} results={results} />
      </section>
    </div>
  );
}

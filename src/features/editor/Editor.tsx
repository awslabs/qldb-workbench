import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Results } from "./results/Results";
import { Tab } from "./Tab";
import AceEditor from "react-ace";
import "ace-builds/src-min-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-min-noconflict/theme-dawn";
import { Ledgers } from "./ledgers/Ledgers";
import {
  DragActions,
  useDraggableHandle,
} from "../../common/hooks/useDraggableHandle";

export function Editor() {
  const [theme] = useContext(ThemeContext);
  const [ledgersDragState, ledgersEl, dispatchLedgersDragged] =
    useDraggableHandle("ledgers", "horizontal", "start");

  const [resultsDragState, resultsEl, dispatchResultsDragged] =
    useDraggableHandle("results", "vertical", "end");

  const dispatchDragged: React.MouseEventHandler<HTMLElement> = (e) => {
    dispatchLedgersDragged(e as DragActions);
    dispatchResultsDragged(e as DragActions);
  };

  return (
    <main
      style={{
        userSelect:
          ledgersDragState.dragging || resultsDragState.dragging
            ? "none"
            : "auto",
      }}
      onMouseUp={dispatchDragged}
      onMouseMove={dispatchDragged}
    >
      <Ledgers
        {...{
          navEl: ledgersEl,
          width: ledgersDragState.currentSize,
          dispatchLeft: dispatchLedgersDragged,
        }}
      />
      <section className="editors">
        <ul className="buffers">
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
        <Results
          {...{
            resultsEl,
            height: resultsDragState.currentSize,
            dispatchBottom: dispatchResultsDragged,
          }}
        />
      </section>
    </main>
  );
}

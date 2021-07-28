import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useToggle } from "../../../common/hooks/useToggle";

export function Results({ resultsEl, height, dispatchBottom }) {
  const [open, toggleOpen] = useToggle(true);
  return open ? (
    <>
      <div
        className="horizontal handle"
        onMouseDown={dispatchBottom}
        onMouseMove={dispatchBottom}
      />
      <div
        ref={resultsEl}
        className="editor-results"
        style={{ height: height + "px" }}
      >
        <Tool name="Results" close={toggleOpen}>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
          <p>These are the results.</p>
        </Tool>
      </div>
    </>
  ) : (
    <>
      <aside className="bottom collapsed" onClick={toggleOpen}>
        <ul>
          <li className="bottom">
            <TextIcon name="zoom_in" />
            <span className="bottom">Results</span>
          </li>
        </ul>
      </aside>
      <div className="handle collapsed" />
    </>
  );
}

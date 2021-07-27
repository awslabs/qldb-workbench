import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useToggle } from "../../../common/hooks/useToggle";

export function Results({ resultsEl, height, dispatchBottom }) {
  const [open, toggleOpen] = useToggle(true);
  return open ? (
    <>
      <div
        id="bottomhandle"
        className="resultshandle"
        onMouseDown={dispatchBottom}
        onMouseMove={dispatchBottom}
      />
      <div ref={resultsEl} id="results" style={{ height: height + "px" }}>
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
      <aside className="bottom collapsed">
        <ul>
          <li className="bottom" onClick={toggleOpen}>
            <TextIcon name="zoom_in" />
            <span className="bottom">Results</span>
          </li>
        </ul>
      </aside>
      <div id="bottomhandle" className="handle collapsed" />
    </>
  );
}

import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useDraggableHandle } from "../../../common/hooks/useDraggableHandle";
import { useToggle } from "../../../common/hooks/useToggle";

export function Results() {
  const [open, toggleOpen] = useToggle(true);
  const [dragState, el, handle] = useDraggableHandle("horizontal", "start");

  return open ? (
    <>
      {handle}
      <div
        ref={el}
        className="editor-results"
        style={{ height: dragState.currentSize + "px" }}
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
    <aside className="bottom collapsed" onClick={toggleOpen}>
      <ul>
        <li className="bottom">
          <TextIcon name="zoom_in" />
          <span className="bottom">Results</span>
        </li>
      </ul>
    </aside>
  );
}

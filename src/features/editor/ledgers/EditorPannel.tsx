import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useDraggableHandle } from "../../../common/hooks/useDraggableHandle";
import { useToggle } from "../../../common/hooks/useToggle";

export function EditorPannel() {
  const [open, toggleOpen] = useToggle(true);
  const [dragState, el, handle] = useDraggableHandle("vertical", "end");

  return (
    <div
      ref={el}
      className="editor-pannel"
      style={{ width: dragState.currentSize + "px" }}
    >
      {open ? (
        <>
          <Tool name="Browse" close={toggleOpen}>
            <p>This is the browse tool content</p>
          </Tool>
          {handle}
        </>
      ) : (
        <aside className="left collapsed">
          <ul>
            <li className="left" onClick={toggleOpen}>
              <TextIcon name="manage_search" />
              <span className="left">Browse</span>
            </li>
          </ul>
        </aside>
      )}
    </div>
  );
}

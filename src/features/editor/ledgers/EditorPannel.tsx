import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useDraggableHandle } from "../../../common/hooks/useDraggableHandle";
import { useToggle } from "../../../common/hooks/useToggle";

export function EditorPannel() {
  const [open, toggleOpen] = useToggle(true);
  const [dragState, el, handle] = useDraggableHandle("vertical", "end");

  return open ? (
    <div
      ref={el}
      className="editor-pannel"
      style={open ? { width: dragState.currentSize + "px" } : {}}
    >
      <Tool name="Browse" close={toggleOpen}>
        <p>This is the browse tool content</p>
      </Tool>
      {handle}
    </div>
  ) : (
    <aside className="left collapsed" onClick={toggleOpen}>
      <ul>
        <li className="left">
          <TextIcon name="manage_search" />
          <span className="left">Browse</span>
        </li>
      </ul>
    </aside>
  );
}

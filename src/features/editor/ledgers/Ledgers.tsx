import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useToggle } from "../../../common/hooks/useToggle";

export function EditorPannel({ navEl, width, dispatchLeft }) {
  const [open, toggleOpen] = useToggle(true);

  return (
    <div ref={navEl} className="editor-pannel" style={{ width: width + "px" }}>
      {open ? (
        <>
          <Tool name="Browse" close={toggleOpen}>
            <p>This is the browse tool content</p>
          </Tool>
          <div
            className="vertical handle"
            onMouseDown={dispatchLeft}
            onMouseMove={dispatchLeft}
          />
        </>
      ) : (
        <>
          <aside className="left collapsed">
            <ul>
              <li className="left" onClick={toggleOpen}>
                <TextIcon name="manage_search" />
                <span className="left">Browse</span>
              </li>
            </ul>
          </aside>
          <div className="handle collapsed" />
        </>
      )}
    </div>
  );
}

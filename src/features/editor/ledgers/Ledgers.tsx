import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";
import { Tool } from "../../../common/components/Tool";
import { useToggle } from "../../../common/hooks/useToggle";

export function Ledgers({ navEl, width, dispatchLeft }) {
  const [open, toggleOpen] = useToggle(true);

  return open ? (
    <>
      <nav ref={navEl} style={{ width: width + "px" }}>
        <Tool name="Browse" close={toggleOpen}>
          <p>This is the browse tool content</p>
        </Tool>
      </nav>
      <div
        id="lefthandle"
        className="handle"
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
      <div id="lefthandle" className="handle collapsed" />
    </>
  );
}

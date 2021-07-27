import * as React from "react";
import { useMouseUpAnywhere } from "../hooks/useMouseUpAnywhere";
import { useToggle } from "../hooks/useToggle";
import { TextIcon } from "./TextIcon";

export function Tool({ name, close, children }) {
  const [minimizeChosen, _, setMinimize] = useToggle(false);
  useMouseUpAnywhere(setMinimize(false));
  const chosenClass = "minimize " + (minimizeChosen ? "chosen" : "");
  return (
    <>
      <header className="tool-header">
        <ul className="tool-header-main">
          <li>{name}</li>
        </ul>
        <ul className="tool-header-controls">
          <li
            className={chosenClass}
            onClick={close}
            onMouseDown={setMinimize(true)}
            onMouseUp={setMinimize(false)}
          >
            <TextIcon color="dimgray" name="minimize" />
          </li>
        </ul>
      </header>
      <section className="tool">{children}</section>
    </>
  );
}

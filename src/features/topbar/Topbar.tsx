import * as React from "react";
import "./styles.scss";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Logo } from "./Logo";
import { ThemeSelector } from "./ThemeSelector";

export function Topbar() {
  const [theme] = useContext(ThemeContext);

  return (
    <div className={`topbar ${theme}`} data-theme={theme}>
      <div className="content">
        <div className="left">
          <Logo />
        </div>
        <div className="right">
          <ThemeSelector />
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}

import * as React from "react";
import "./styles.scss";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import { Logo } from "./Logo";
import { RegionSelector } from "./RegionSelector";

export function Topbar() {
  const [theme] = useContext(ThemeContext);

  return (
    <header>
      <div className={`topbar ${theme}`} data-theme={theme}>
        <div className="content">
          <div className="left">
            <Logo />
          </div>
          <div className="right">
            <RegionSelector />
          </div>
        </div>
        <div className="divider" />
      </div>
    </header>
  );
}

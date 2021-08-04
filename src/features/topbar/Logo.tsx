import * as React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../core/ThemeProvider";
import * as awsLogo from "../../images/aws-logo-white.png";
import * as awsLogoBlack from "../../images/aws-logo-black.png";

export function Logo(): JSX.Element {
  const [theme] = useContext(ThemeContext);

  return (
    <img src={theme === "light" ? awsLogoBlack : awsLogo} alt="aws-logo" />
  );
}

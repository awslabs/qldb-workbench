import { Icon, IconProps } from "@awsui/components-react";
import * as React from "react";
import { PropsWithChildren } from "react";

interface Props {
  name: IconProps.Name;
  onClick?: () => void;
  selected?: boolean;
}

export function NavButton(props: PropsWithChildren<Props>): React.ReactElement {
  const { name, selected, onClick, children } = props;

  return (
    <div
      className={`nav-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <Icon name={name} />
      <div>{children}</div>
    </div>
  );
}

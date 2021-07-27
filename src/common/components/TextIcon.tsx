import * as React from "react";

type CssColor = "darkgray" | "dimgray" | "slategray";

interface Props {
  name: string;
  color?: CssColor;
}

export function TextIcon({ name, color }: Props) {
  return (
    <span style={{ color }} className="material-icons icon">
      {name}
    </span>
  );
}

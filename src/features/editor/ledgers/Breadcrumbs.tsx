import * as React from "react";
import { TextIcon } from "../../../common/components/TextIcon";

export function Breadcrumbs() {
  return (
    <ul className="breadcrumb">
      <li className="strong">
        <span>us-east-1</span>
      </li>
      <li>
        <TextIcon name="chevron_right" />
      </li>
      <li>
        <span>LedgerOne</span>
      </li>
    </ul>
  );
}

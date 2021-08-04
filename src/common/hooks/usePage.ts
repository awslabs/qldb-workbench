import { useState } from "react";

export type PageName =
  | "editor"
  | "recent"
  | "saved"
  | "verification"
  | "settings"
  | "feedback";

export function usePage(
  initial: PageName
): [PageName, React.Dispatch<React.SetStateAction<PageName>>] {
  return useState<PageName>(initial);
}

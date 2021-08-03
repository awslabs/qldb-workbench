import { useState } from "react";

export type PageName =
  | "editor"
  | "recent"
  | "saved"
  | "verification"
  | "settings"
  | "feedback";

export function usePage(initial: PageName) {
  return useState<PageName>(initial);
}

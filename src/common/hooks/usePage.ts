import { useState } from "react";

export type Page =
  | "editor"
  | "recent"
  | "saved"
  | "verification"
  | "settings"
  | "feedback";

export function usePage() {
  return useState<Page>("editor");
}

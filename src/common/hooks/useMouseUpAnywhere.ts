import { useEffect } from "react";

export function useMouseUpAnywhere(onMouseUp: () => void): void {
  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseUp]);
}

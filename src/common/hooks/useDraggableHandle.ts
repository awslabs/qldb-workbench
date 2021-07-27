import { useCallback, useReducer } from "react";

const MIN_TOOL_SIZE = 10;

type Direction = "vertical" | "horizontal";
type Anchor = "start" | "end";

interface DragSubscribed {
  type: "drag-subscribed";
  size: number;
}
interface MouseDown {
  type: "mousedown";
  clientY: number;
  clientX: number;
}
interface MouseUp {
  type: "mouseup";
  clientY: number;
  clientX: number;
}
interface MouseMove {
  type: "mousemove";
  clientY: number;
  clientX: number;
}
export type DragActions = DragSubscribed | MouseDown | MouseUp | MouseMove;

interface DragState {
  id: string;
  direction: Direction;
  anchor: Anchor;
  dragging: boolean;
  startSize?: number;
  currentSize?: number;
  startPosition?: number;
  currentPosition?: number;
}

function dragReducer(state: DragState, action: DragActions): DragState {
  switch (action.type) {
    case "drag-subscribed":
      return { ...state, startSize: action.size };
    case "mousedown":
      return {
        ...state,
        dragging: true,
        startPosition:
          state.direction === "horizontal" ? action.clientX : action.clientY,
      };
    case "mouseup":
      if (!state.dragging) {
        return state;
      }
      return { ...state, dragging: false, startSize: state.currentSize };
    case "mousemove":
      if (!state.dragging || !state.startSize || !state.startPosition) {
        return state;
      }
      const position =
        state.direction === "horizontal" ? action.clientX : action.clientY;
      const delta = position - state.startPosition;
      const size =
        state.startSize + (state.anchor === "start" ? delta : -delta);
      return {
        ...state,
        currentPosition: position,
        currentSize: Math.max(size, MIN_TOOL_SIZE),
      };
    default:
      return state;
  }
}

export function useDraggableHandle(
  id: string,
  direction: Direction,
  anchor: Anchor
): [DragState, React.LegacyRef<HTMLDivElement>, React.Dispatch<DragActions>] {
  const [handleState, dispatch] = useReducer(dragReducer, {
    id,
    direction,
    anchor,
    dragging: false,
  });

  const el = useCallback((node) => {
    if (!node) return;

    dispatch({
      type: "drag-subscribed",
      size: direction === "horizontal" ? node.offsetWidth : node.offsetHeight,
    });
  }, []);

  return [handleState, el, dispatch];
}

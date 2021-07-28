import * as React from "react";
import { ReactNode, useCallback, useEffect, useReducer } from "react";

const MIN_TOOL_SIZE = 10;

type Direction = "vertical" | "horizontal";
type Position = "start" | "end";

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
type DragActions = DragSubscribed | MouseDown | MouseUp | MouseMove;

interface DragState {
  direction: Direction;
  position: Position;
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
          state.direction === "vertical" ? action.clientX : action.clientY,
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
        state.direction === "vertical" ? action.clientX : action.clientY;
      const delta = position - state.startPosition;
      const size =
        state.startSize + (state.position === "start" ? -delta : delta);
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
  direction: Direction,
  position: Position
): [DragState, React.LegacyRef<HTMLDivElement>, ReactNode] {
  const [dragState, dispatch] = useReducer(dragReducer, {
    direction,
    position,
    dragging: false,
  });

  const el = useCallback((node) => {
    if (!node) return;

    dispatch({
      type: "drag-subscribed",
      size: direction === "vertical" ? node.offsetWidth : node.offsetHeight,
    });
  }, []);

  useEffect(() => {
    document
      .getElementsByTagName("body")[0]
      .classList.toggle("dragging", dragState.dragging);
  }, [dragState.dragging]);

  useEffect(() => {
    const handler = (e) => dispatch(e as DragActions);

    document.addEventListener("mousemove", handler);
    document.addEventListener("mouseup", handler);

    return () => {
      document.removeEventListener("mousemove", handler);
      document.removeEventListener("mouseup", handler);
    };
  }, []);

  const handle: ReactNode = (
    <div
      className={`${direction} handle ${dragState.dragging ? "dragging" : ""}`}
      onMouseDown={(e) => dispatch(e as DragActions)}
    />
  );

  return [dragState, el, handle];
}

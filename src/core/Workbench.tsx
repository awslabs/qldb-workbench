import * as React from "react";
import * as ReactDOM from "react-dom";
import {useCallback, useEffect, useReducer, useState} from "react";
import AceEditor from 'react-ace';

import '../../assets/styles.scss';

const MIN_TOOL_WINDOW_WIDTH = 10;
const MIN_TOOL_WINDOW_HEIGHT = 10;

function handleWidthDragging(state, action) {
    switch (action.type) {
        case "widthknown":
            return { ...state, startWidth: action.width, width: action.width  };
        case "mousedown":
            return { ...state, dragging: true, startX: action.clientX };
        case "mouseup":
            if (!state.dragging) {
                return state;
            }
            if (typeof(state.width) === "undefined") {
              return { ...state, dragging: false, startWidth: state.startWidth };
            }
            return { ...state, dragging: false, startWidth: state.width };
        case "mousemove":
            if (!state.dragging) {
                return state;
            }
            const delta = action.clientX - state.startX;
            const width = state.startWidth + (state.invert ? -delta : delta );
            return { ...state, currentX: action.clientX, width: width < MIN_TOOL_WINDOW_WIDTH ? MIN_TOOL_WINDOW_WIDTH : width};
        default:
            return state;
    }
}

function handleHeightDragging(state, action) {
  switch (action.type) {
      case "heightknown":
          return { ...state, startHeight: action.height, height: action.height };
      case "mousedown":
          return { ...state, dragging: true, startY: action.clientY };
      case "mouseup":
          if (!state.dragging) {
              return state;
          }
          if (typeof(state.height) === "undefined") {
            return { ...state, dragging: false, startHeight: state.startHeight };
          }
          return { ...state, dragging: false, startHeight: state.height };
      case "mousemove":
          if (!state.dragging) {
              return state;
          }
          const delta = action.clientY - state.startY;
          const height = state.startHeight + (state.invert ? -delta : delta );
          return { ...state, currentY: action.clientY, height: height < MIN_TOOL_WINDOW_HEIGHT ? MIN_TOOL_WINDOW_HEIGHT : height};
      default:
          return state;
  }
}

function useWidthDraggableHandle(id: string, invert: boolean) {
  const [handleState, dispatch] = useReducer(handleWidthDragging, { id, invert, dragging: false });    
  const el = useCallback(node => {
        if (node !== null) {
            dispatch({ type: "widthknown", width: node.offsetWidth });
        }
    }, []);
    return [handleState, el, dispatch];
}

function useHeightDraggableHandle(id: string, invert: boolean) {
  const [handleState, dispatch] = useReducer(handleHeightDragging, { id, invert, dragging: false });
  const el = useCallback(node => {
      if (node !== null) {
          dispatch({ type: "heightknown", height: node.offsetHeight });
      }
  }, []);
  return [handleState, el, dispatch];
}

enum CssColor {
    darkgray = "darkgray",
    dimgray = "dimgray",
    slategray = "slategray"
}

interface TextIconProps {
    name: string;
    color?: CssColor;
}

function TextIcon({name, color}: TextIconProps) {
    return <span style={{color}} className="material-icons icon">{name}</span>;
}

function useToggle(initial: boolean): [boolean, () => void, () => void] {
    const [value, setValue] = useState(initial);
    return [
        value,
        () => { setValue(true) },
        () => { setValue(false) }
    ];
}

function useMouseUpAnywhere(onMouseUp) {
    useEffect(() => {
        document.addEventListener("mouseup", onMouseUp);
        return () => document.removeEventListener("mouseup", onMouseUp);
    }, []);
}

function Tool({name, close, children}) {
    const [minimizeChosen, chooseMinimize, unchooseMinimize] = useToggle(false);
    useMouseUpAnywhere(unchooseMinimize);
    const chosenClass = "minimize " + (minimizeChosen ? "chosen" : "");
    return <>
        <header className="tool-header">
            <ul className="tool-header-main">
                <li>{name}</li>
            </ul>
            <ul className="tool-header-controls">
                <li className={chosenClass} onClick={close} onMouseDown={chooseMinimize} onMouseUp={unchooseMinimize}>
                    <TextIcon color={CssColor.dimgray} name="minimize"/>
                </li>
            </ul>
        </header>
        <section className="tool">
            {children}
        </section>
    </>;
}
function Nav({navEl, width, dispatchLeft}) {
    const [open, setOpen, setClosed] = useToggle(true);
    return open ?
        <>
            <nav ref={navEl} style={{width: width + "px"}}>
                <Tool name="Browse" close={setClosed}>
                    <p>This is the browse tool content</p>
                </Tool>
            </nav>
            <div id="lefthandle" className="handle" onMouseDown={dispatchLeft} onMouseMove={dispatchLeft}/>
        </>
        :
        <>
            <aside className="left collapsed">
                <ul>
                    <li className="left" onClick={setOpen}>
                        <TextIcon name="manage_search"/><span className="left">Browse</span>
                    </li>
                </ul>
            </aside>
            <div id="lefthandle" className="handle collapsed"/>
        </>;
}

function Tools({toolsEl, width, dispatchRight}) {
    const [open, setOpen, setClosed] = useToggle(true);
    return open ?
        <>
            <div id="righthandle" className="handle" onMouseDown={dispatchRight} onMouseMove={dispatchRight}/>
            <div ref={toolsEl} id="tools" style={{width: width + "px"}}>
                <Tool name="History" close={setClosed}>
                    <p>This is the history tool content</p>
                </Tool>
            </div>
        </>
        :
        <>
            <aside className="right collapsed">
                <ul>
                    <li className="right" onClick={setOpen}>
                        <TextIcon name="history"/><span className="right">History</span>
                    </li>
                </ul>
            </aside>
            <div id="righthandle" className="handle collapsed"/>
        </>;
}

function Breadcrumb() {
    return <ul className="breadcrumb">
        <li className="strong"><span>us-east-1</span></li>
        <li><TextIcon name="chevron_right"/></li>
        <li><span>LedgerOne</span></li>
    </ul>;
}

function Editors({resultsEl, height, dispatchBottom}) {
    return <section className="editors">
        <ul className="buffers">
            <li><Button name="Buffer One"/></li>
            <li><Button name="Buffer Two"/></li>
            <li><Button name="Buffer Three"/></li>
        </ul>
        <div className="editor">
          <AceEditor mode={"text"} width="100%" height="100%" />
        </div>
        <Result {...{resultsEl, height: height, dispatchBottom}}/>
    </section>;
}

function Button({name}) {
  const [isOpen, setIsOpen] = React.useState(true); 
  const onClickBufferCloseButton = () => setIsOpen(false);

  return (
        <div className={isOpen ? 'button-opened' : 'button-closed'}>
            {name}
            <button className="close" onClick={onClickBufferCloseButton}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

function Result({resultsEl, height, dispatchBottom}) {
    const [open, setOpen, setClosed] = useToggle(true);
    return open ?
        <>
            <div id="bottomhandle" className="resultshandle" onMouseDown={dispatchBottom} onMouseMove={dispatchBottom}/>
            <div ref={resultsEl} id="results" style={{height: height + "px"}}>
                <Tool name="Results" close={setClosed}>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                    <p>These are the results.</p>
                </Tool>
            </div>
        </>
        :
        <>
            <aside className="bottom collapsed">
                <ul>
                    <li className="bottom" onClick={setOpen}>
                        <TextIcon name="zoom_in"/><span className="bottom">Results</span>
                    </li>
                </ul>
            </aside>
            <div id="bottomhandle" className="handle collapsed"/>
        </>;

}

function Workbench() {
    const [leftHandleState, navEl, dispatchLeft] = useWidthDraggableHandle("left", false);
    const [rightHandleState, toolsEl, dispatchRight] = useWidthDraggableHandle("right", true);
    const [bottomHandleState, resultsEl, dispatchBottom] = useHeightDraggableHandle("bottom", true);
    const dispatchAll = (e) => {
        dispatchLeft(e);
        dispatchRight(e);
        dispatchBottom(e);
    }
    return <>
        <header><Breadcrumb /></header>
        <main
            style={{userSelect: leftHandleState.dragging || rightHandleState.dragging || bottomHandleState.dragging? "none" : "auto"}}
            onMouseUp={dispatchAll}
            onMouseMove={dispatchAll}>
            <Nav {...{navEl, width: leftHandleState.width, dispatchLeft}} />
            <Editors {...{resultsEl, height: bottomHandleState.height, dispatchBottom}}/>
            <Tools {...{toolsEl, width: rightHandleState.width, dispatchRight}} />
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
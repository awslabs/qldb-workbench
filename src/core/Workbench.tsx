import * as React from "react";
import * as ReactDOM from "react-dom";
import {useCallback, useEffect, useReducer, useState} from "react";
import AceEditor from 'react-ace';

const MIN_TOOL_WINDOW_WIDTH = 10;
const MIN_TOOL_WINDOW_HEIGHT = 10;

function handleWidthDragging(state, action) {
    switch (action.type) {
        case "widthknown":
            return { ...state, startWidth: action.width };
        case "mousedown":
            return { ...state, dragging: true, startX: action.clientX };
        case "mouseup":
            if (!state.dragging) {
                return state;
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
          return { ...state, startHeight: action.height };
      case "mousedown":
          return { ...state, dragging: true, startX: action.clientX };
      case "mouseup":
          if (!state.dragging) {
              return state;
          }
          return { ...state, dragging: false, startHeight: state.height };
      case "mousemove":
          if (!state.dragging) {
              return state;
          }
          const delta = action.clientY - state.startX;
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

function Editors({resultsEl, height, dispatchButtom}) {
    return <section className="editors">
        <ul className="buffers">
            <li><Button name="Buffer One"/></li>
            <li><Button name="Buffer Two"/></li>
            <li><Button name="Buffer Three"/></li>
        </ul>
        <AceEditor width="100%" height="100%" />
        <Result {...{resultsEl, height: height, dispatchButtom}}/>
    </section>;
}

function Button({name}) {
  const [isOpen, setIsOpen] = React.useState(true); 
  const onClickBufferCloseButton = () => setIsOpen(false);

  return <li>
            <div className={isOpen ? 'button-opened' : 'button-closed'}>
              {name}
              <button className="close" onClick={onClickBufferCloseButton}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </li>
}

function Result({resultsEl, height, dispatchButtom}) {
    const [open, setOpen, setClosed] = useToggle(true);
    return open ?
        <>
            <div id="buttomhandle" className="resultshandle" onMouseDown={dispatchButtom} onMouseMove={dispatchButtom}/>
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
            <aside className="buttom collapsed">
                <ul>
                    <li className="buttom" onClick={setOpen}>
                        <TextIcon name="zoom_in"/><span className="buttom">Results</span>
                    </li>
                </ul>
            </aside>
            <div id="buttomhandle" className="handle collapsed"/>
        </>;

}

function Workbench() {
    const [leftHandleState, navEl, dispatchLeft] = useWidthDraggableHandle("left", false);
    const [rightHandleState, toolsEl, dispatchRight] = useWidthDraggableHandle("right", true);
    const [buttomHandleState, resultsEl, dispatchButtom] = useHeightDraggableHandle("buttom", true);
    const dispatchAll = (e) => {
        dispatchLeft(e);
        dispatchRight(e);
        dispatchButtom(e);
    }
    return <>
        <header><Breadcrumb /></header>
        <main
            style={{userSelect: leftHandleState.dragging || rightHandleState.dragging || buttomHandleState.dragging? "none" : "auto"}}
            onMouseUp={dispatchAll}
            onMouseMove={dispatchAll}>
            <Nav {...{navEl, width: leftHandleState.width, dispatchLeft}} />
            <Editors {...{resultsEl, height: buttomHandleState.height, dispatchButtom}}/>
            <Tools {...{toolsEl, width: rightHandleState.width, dispatchRight}} />
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
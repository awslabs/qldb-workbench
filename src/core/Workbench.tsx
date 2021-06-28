import * as React from "react";
import * as ReactDOM from "react-dom";
import {useCallback, useEffect, useReducer, useState} from "react";

function handleDragging(state, action) {
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
            return { ...state, currentX: action.clientX, width: state.startWidth + (state.invert ? -delta : delta )};
        default:
            return state;
    }
}

function useDraggableHandle(id: string, invert: boolean) {
    const [handleState, dispatch] = useReducer(handleDragging, { id, invert, dragging: false });
    const el = useCallback(node => {
        if (node !== null) {
            dispatch({ type: "widthknown", width: node.offsetWidth });
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

function Tool({close, children}) {
    const [minimizeChosen, chooseMinimize, unchooseMinimize] = useToggle(false);
    useMouseUpAnywhere(unchooseMinimize);
    const chosenClass = "minimize " + (minimizeChosen ? "chosen" : "");
    return <>
        <header className="tool-header">
            <ul id="tool-header-main">
            </ul>
            <ul id="tool-header-controls">
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
                <Tool close={setClosed}>
                    <p>This is the browse tool content</p>
                </Tool>
            </nav>
            <div id="lefthandle" className="handle" onMouseDown={dispatchLeft} onMouseMove={dispatchLeft}/>
        </>
        :
        <>
            <aside className="collapsed">
                <ul>
                    <li onClick={setOpen}>
                        <TextIcon name="manage_search"/><span>Browse</span>
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
                <Tool close={setClosed}>
                    <p>This is the history tool content</p>
                </Tool>
            </div>
        </>
        :
        <>
            <aside className="collapsed">
                <ul>
                    <li onClick={setOpen}>
                        <TextIcon name="manage_search"/><span>Browse</span>
                    </li>
                </ul>
            </aside>
            <div id="lefthandle" className="handle collapsed"/>
        </>;
}

function Workbench() {
    const [leftHandleState, navEl, dispatchLeft] = useDraggableHandle("left", false);
    const [rightHandleState, toolsEl, dispatchRight] = useDraggableHandle("right", true);
    const dispatchBoth = (e) => {
        dispatchLeft(e);
        dispatchRight(e);
    }
    return <>
        <header>This is the header</header>
        <main
            style={{userSelect: leftHandleState.dragging || rightHandleState.dragging ? "none" : "auto"}}
            onMouseUp={dispatchBoth}
            onMouseMove={dispatchBoth}>
            <Nav {...{navEl, width: leftHandleState.width, dispatchLeft}} />
            <section>This is where the files will go</section>
            <Tools {...{toolsEl, width: rightHandleState.width, dispatchRight}} />
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
import * as React from "react";
import * as ReactDOM from "react-dom";
import {useCallback, useReducer, useState} from "react";

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

function NavClosed() {
    return <>
        <div>N</div>
    </>;
}

function Nav({navEl, width, dispatchLeft}) {
    const [navOpen, setNavOpen] = useState(true);
    return navOpen ?
        <>
            <nav ref={navEl} style={{width: width + "px"}}>
                    <header className="nav-header">
                        <ul id="nav-header-main">
                        </ul>
                        <ul id="nav-header-tools">
                            <li className="minimize" onClick={() => setNavOpen(false)}>
                                <hr/>
                            </li>
                        </ul>
                    </header>
                    <section>Nav content</section>
            </nav>
            <div id="lefthandle" className="handle" onMouseDown={dispatchLeft} onMouseMove={dispatchLeft}/>
        </>
        :
        <>
            <aside className="collapsed">
                <ul>
                    <li onClick={() => setNavOpen(true)}>
                        <span className="material-icons icon">manage_search</span><span>Browse</span>
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
            <div id="righthandle" className="handle" onMouseDown={dispatchRight} onMouseMove={dispatchRight}/>
            <div ref={toolsEl} id="tools" style={{width: rightHandleState.width + "px"}}>This is where the toolbox will
                go
            </div>
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
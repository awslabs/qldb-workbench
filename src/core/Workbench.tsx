import * as React from "react";
import * as ReactDOM from "react-dom";
import {useCallback, useReducer, useRef} from "react";

function reducer(state, action) {
    switch (action.type) {
        case "widthknown":
            return { ...state, startWidth: action.width };
        case "mousedown":
            return { ...state, dragging: true, startX: action.clientX };
        case "mouseup":
            return { ...state, dragging: false, startWidth: state.width };
        case "mousemove":
            if (!state.dragging) {
                return state;
            }
            return { ...state, currentX: action.clientX, width: state.startWidth + (action.clientX - state.startX) };
        default:
            return state;
    }
}

function Workbench() {
    const [leftHandleState, dispatch] = useReducer(reducer, { dragging: false });
    const navEl = useCallback(node => {
        if (node !== null) {
            dispatch({ type: "widthknown", width: node.offsetWidth });
        }
    }, []);
    return <>
        <header>This is the header</header>
        <main style={{ userSelect: leftHandleState.dragging ? "none" : "auto" }} onMouseUp={dispatch} onMouseMove={dispatch}>
            <nav ref={navEl} style={{ width: leftHandleState.width + "px" }}>This is the nav</nav>
            <div id="lefthandle" className="handle" onMouseDown={dispatch} onMouseMove={dispatch}/>
            <section>This is where the files will go</section>
            <div id="righthandle" className="handle"/>
            <div id="tools">This is where the toolbox will go</div>
        </main>
        <footer>This is the footer</footer>
    </>;
}

ReactDOM.render(<Workbench />, document.getElementById("app"));
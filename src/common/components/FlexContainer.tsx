import * as React from "react";

import "./styles.scss";
import {
  Container,
  Header,
  Button,
  ContainerProps,
} from "@awsui/components-react";
import { PropsWithChildren } from "react";
import {
  Direction,
  Position,
  useDraggableHandle,
} from "../hooks/useDraggableHandle";
import { useToggle } from "../hooks/useToggle";

interface Props {
  header?: React.ReactElement | string;
  handle: { position: Position; direction: Direction };
  containerProps?: ContainerProps;
}

export function FlexContainer(props: PropsWithChildren<Props>): JSX.Element {
  const { header, handle, containerProps, children } = props;
  const [open, toggleOpen] = useToggle(true);
  const [dragState, resizableEl, handleComponent] = useDraggableHandle(
    handle.direction,
    handle.position
  );

  return (
    <div
      className={`tool-container ${handle.direction} ${
        !open ? "collapsed" : ""
      }`}
    >
      {open && handle.position === "start" && handleComponent}
      <Container
        className="tool"
        disableContentPaddings={!open}
        header={
          <Header
            actions={
              <Button
                variant="icon"
                iconName={open ? "treeview-collapse" : "treeview-expand"}
                onClick={toggleOpen}
              />
            }
          >
            <div
              className="tool-header"
              style={
                handle.direction === "vertical"
                  ? {
                      width: `${dragState.currentSize}px`,
                    }
                  : {}
              }
            >
              {header}
            </div>
          </Header>
        }
        {...containerProps}
      >
        <div
          ref={resizableEl}
          className="tool-body"
          style={{
            [handle.direction === "horizontal" ? "height" : "width"]: open
              ? `${dragState.currentSize}px`
              : "0px",
          }}
        >
          {children}
        </div>
        {open && handle.position === "end" && handleComponent}
      </Container>
    </div>
  );
}

import * as React from "react";

export function Tab({ name }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const onClickBufferCloseButton = () => setIsOpen(false);

  return (
    <div className={isOpen ? "button-opened" : "button-closed"}>
      {name}
      <button className="close" onClick={onClickBufferCloseButton}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}

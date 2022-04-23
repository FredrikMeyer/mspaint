import React from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

// TODO use some windowing functionality??

export default function Window({ title }: { title: string }) {
  const [top, setTop] = React.useState(150);
  const [left, setLeft] = React.useState(300);

  const [dragging, setDragging] = React.useState(false);

  const mouseDownHandler: React.MouseEventHandler<HTMLDivElement> = () => {
    /* const offsetX = e.pageX - left;
     * const offsetY = e.pageY - top; */

    setDragging(true);
  };

  const mouseMoveHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const offsetX = e.pageX - left;
    const offsetY = e.pageY - top;
    if (dragging) {
      setTop(top + offsetX);
      setLeft(left + offsetY);
    }
  };

  const onMouseUp: React.MouseEventHandler<HTMLDivElement> = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  return (
    <div
      onMouseDown={mouseDownHandler}
      onMouseMove={mouseMoveHandler}
      onMouseUp={onMouseUp}
      className="window"
      style={{
        position: "fixed",
        top: top + "px",
        left: left + "px",
        width: "500px",
        height: "300px",
        backgroundColor: "white",
        border: "1px solid black",
      }}
    >
      <div>
        <div className="topbar">
          <div className="topbar-text">{title}</div>
          <div className="topbar-icons">
            <div className="icon">
              <MdArrowDropDown />
            </div>
            <div className="icon">
              <MdArrowDropUp />
            </div>
          </div>
        </div>
      </div>
      <div>hei hei</div>
    </div>
  );
}

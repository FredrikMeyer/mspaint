import React from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-text">Fredrik Meyer - [Untitled]</div>
      <div className="topbar-icons">
        <div className="icon">
          <MdArrowDropDown />
        </div>
        <div className="icon">
          <MdArrowDropUp />
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function Menu() {
  return (
    <div className="menu">
      <div className="menu-elements">
        <div>File</div>
        <div>About</div>
        <div>
          <a href="https://blog.fredrikmeyer.net/">Blog</a>
        </div>
        <div>Recommendations</div>
        <div>Contact</div>
        <div>Etc</div>
      </div>
    </div>
  );
}

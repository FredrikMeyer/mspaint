import React from "react";

export default function ColorPicker({
  setCurrentColor,
}: {
  setCurrentColor: (c: string) => void;
}) {
  const colors = [
    "white",
    "grey",
    "red",
    "yellow",
    "cyan",
    "blue",
    "magenta",
    "lightyellow",
    "lightgreen",
    "lightskyblue",
    "orchid",
  ];

  const row2 = [
    "black",
    "darkgrey",
    "darkred",
    "goldenrod",
    "seagreen",
    "cornflowerblue",
    "darkblue",
    "mediumpurple",
    "wheat",
    "darkolivegreen",
    "dodgerblue",
  ];
  return (
    <div className="main-cc-color-picker">
      <div className="main-cc-color-picker-row">
        {colors.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => setCurrentColor(c)}
          ></div>
        ))}
      </div>
      <div className="main-cc-color-picker-row">
        {row2.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => setCurrentColor(c)}
          ></div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import styles from "./ColorPicker.module.scss";

const row1 = [
  "rgb(255, 255, 255)",
  "rgb(191, 191, 191)",
  "rgb(233, 50, 35)", // light red
  "rgb(255, 253, 84)", // bright yellow
  "rgb(117, 249, 76)", // neon green
  "rgb(115, 251, 253)", // light blue
  "rgb(0, 30, 245)", // blue
  "rgb(234, 60, 247)", // magenta
  "rgb(255, 255, 146)", // yellow-ish
  "rgb(117, 250, 142)", // yellow-green
  "rgb(160, 252, 253)", // sky-blue
  "rgb(127, 131, 247)", // purple
  "rgb(234, 53, 127)", // pink
  "rgb(239, 134, 80)", // orange
];

const row2 = [
  "rgb(0, 0, 0)", // black
  "rgb(128, 128, 128)", // dark grey
  "rgb(117, 20, 12)", // dark red
  "rgb(128, 127, 38)", // dark yellow
  "rgb(55, 125, 34)", // dark neon gren
  "rgb(54, 126, 127)", // dark teal
  "rgb(0, 10, 123)", // dark blue
  "rgb(117, 25, 124)", // dark magenta
  "rgb(128, 127, 73)", // wheat
  "rgb(24, 63, 63)", // dark green
  "rgb(51, 129, 247)", // blue sky dark
  "rgb(22, 64, 124)", // dark dark blue sky
  "rgb(57, 15, 123)", // dark purple
  "rgb(120, 66, 21)", // brown
];

export default function ColorPicker({
  setCurrentColor,
}: {
  setCurrentColor: (c: string) => void;
}) {
  return (
    <div className={styles["color-picker"]}>
      <div className={styles["color-picker-row"]}>
        {row1.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c }}
            onClick={() => setCurrentColor(c)}
          ></div>
        ))}
      </div>
      <div className={styles["color-picker-row"]}>
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

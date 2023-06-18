import React from "react";
import styles from "./ColorPicker.module.scss";
import { COLORS, Color } from "./colors";

const {
  WHITE,
  LIGHT_GREY,
  RED,
  YELLOW,
  NEON_GREEN,
  TEAL,
  BLUE,
  MAGENTA,
  PASTEL_YELLOW,
  LIGHT_MALACHITE_GREEN,
  WATERSPOUT,
  MEDIUM_SLATE_BLUE,
  CERISE_PINK,
  ATOMIC_TANGERINE,
} = COLORS;

const row1 = [
  WHITE,
  LIGHT_GREY,
  RED,
  YELLOW,
  NEON_GREEN,
  TEAL,
  BLUE,
  MAGENTA,
  PASTEL_YELLOW,
  LIGHT_MALACHITE_GREEN,
  WATERSPOUT,
  MEDIUM_SLATE_BLUE,
  CERISE_PINK,
  ATOMIC_TANGERINE,
];

const row2 = [
  COLORS.BLACK,
  COLORS.DARK_GREY,
  COLORS.DARK_RED,
  COLORS.DARK_YELLOW,
  COLORS.DARK_NEON_GREEN,
  COLORS.DARK_TEAL,
  COLORS.DARK_BLUE,
  COLORS.DARK_MAGENTA,
  COLORS.GOLD_FUSION,
  COLORS.SACRAMENTO_STATE_GREEN,
  COLORS.BRILLIANT_AZURE,
  COLORS.DARK_CERULEAN,
  COLORS.PERSIAN_INDIGO,
  COLORS.SEPIA,
];

export default function ColorPicker({
  currentColor,
  setCurrentColor,
}: {
  currentColor: Color;
  setCurrentColor: (c: Color) => void;
}) {
  return (
    <div className={styles["color-picker"]}>
      <div className={styles["current-color"]}>
        <div
          className={styles["current-background-color"]}
          style={{
            backgroundColor: Color.toRGBString(currentColor),
          }}
        ></div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <div className={styles["color-picker-row"]}>
          {row1.map((c, i) => (
            <div
              key={i}
              style={{ backgroundColor: Color.toRGBString(c) }}
              onClick={() => setCurrentColor(c)}
            ></div>
          ))}
        </div>
        <div className={styles["color-picker-row"]}>
          {row2.map((c, i) => (
            <div
              key={i}
              style={{ backgroundColor: Color.toRGBString(c) }}
              onClick={() => setCurrentColor(c)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

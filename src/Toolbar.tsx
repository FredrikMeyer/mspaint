import React from "react";
import ToolbarIcon from "./ToolbarIcon";
import styles from "./Toolbar.module.scss";

const toolMap = {
  FILL: 6,
  DRAW: 7,
  ERASE: 5,
  LINE: 9,
  SQUARE: 10,
  NOOP: -1,
  ROUNDED_RECT: 12,
  CIRCLE: 14,
} as const;

export type DrawingTool = keyof typeof toolMap;

const rToolMap = Object.fromEntries(
  Object.entries(toolMap).map(([key, val]) => [val, key as DrawingTool])
) as Record<number, DrawingTool>;

export default function Toolbar({
  activeTool,
  setActiveTool,
  setToolSize,
}: {
  activeTool: DrawingTool;
  setActiveTool: (t: DrawingTool) => void;
  toolSize: number;
  setToolSize: (s: number) => void;
}) {
  const activeToolIndex = toolMap[activeTool];

  return (
    <div className={styles.toolbar}>
      {
        <div className={styles["toolbar-icons"]}>
          {[...Array(18).keys()].map((i) => (
            <ToolbarIcon
              key={i}
              n={i}
              marked={i == activeToolIndex}
              setAsActive={() => setActiveTool(rToolMap[i] ?? i)}
              altText={rToolMap[i] ?? "No function here yet."}
              implemented={!!rToolMap[i]}
            />
          ))}
        </div>
      }
      <div className={styles["tool-size"]}>
        {[...Array(8).keys()].map((i) => (
          <div
            key={i}
            className={styles["tool-size-bar"]}
            style={{ height: 3 * i }}
            onClick={() => setToolSize(i)}
          ></div>
        ))}
      </div>
    </div>
  );
}

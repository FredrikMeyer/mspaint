import React from "react";
import ToolbarIcon from "./ToolbarIcon";
import styles from "./Toolbar.module.scss";
import { DrawingTool } from "./types";

const toolMap: Record<DrawingTool, number> = {
  DRAW: 7,
  ERASE: 5,
  NOOP: -1,
};

const rToolMap: Record<number, DrawingTool> = { 7: "DRAW", 5: "ERASE" };

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

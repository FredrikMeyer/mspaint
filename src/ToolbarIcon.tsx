import React from "react";
import styles from "./Toolbar.module.scss";

type ToolbarIconProperties = {
  n: number;
  marked: boolean;
  setAsActive: () => void;
  altText: string;
  implemented: boolean;
};

export default function ToolbarIcon(properties: ToolbarIconProperties) {
  const { n, marked, setAsActive, altText, implemented } = properties;

  const w = 41;
  const h = 45;

  return (
    <div
      className={styles["toolbar-icon"]}
      style={{ height: `${h}px`, width: `${w}px` }}
    >
      <img
        src={`/icons/${n}.png`}
        height={`${h}px`}
        width={`${w}px`}
        className={marked ? styles["toolbar-icon-marked"] : undefined}
        onClick={setAsActive}
        alt={altText}
        style={{
          filter: implemented ? "unset" : "blur(2px)",
          cursor: implemented ? "pointer" : "unset",
        }}
      />
    </div>
  );
}

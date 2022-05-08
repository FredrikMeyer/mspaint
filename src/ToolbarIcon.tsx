import React from "react";

type ToolbarIconProperties = {
  n: number;
  marked: boolean;
  setAsActive: () => void;
};

export default function ToolbarIcon(properties: ToolbarIconProperties) {
  const { n, marked, setAsActive } = properties;

  const w = 41;
  const h = 45;

  return (
    <div
      style={{ border: "1px solid black", height: `${h}px`, width: `${w}px` }}
    >
      <img
        src={`/icons/${n}.png`}
        style={{
          margin: "0px",
          height: `${h}px`,
          width: `${w}px`,
          filter: marked ? `invert(1)` : undefined,
        }}
        onClick={setAsActive}
      />
    </div>
  );
}

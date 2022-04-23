import React from "react";

function numberToXY(n: number): [number, number] {
  const x = n % 2;
  const y = (n - (n % 2)) / 2;

  return [x, y];
}

type ToolbarIconProperties = {
  sourceImage: HTMLImageElement;
  n: number;
  marked: boolean;
  setAsActive: () => void;
};

export default function ToolbarIcon(properties: ToolbarIconProperties) {
  const { sourceImage, n, marked, setAsActive } = properties;

  const reference = React.useRef<HTMLCanvasElement>(null);

  const [x, y] = numberToXY(n);

  const sw = 82;
  const sh = 90;

  const w = 41;
  const h = 45;

  React.useEffect(() => {
    const canvas = reference.current;

    const context = canvas?.getContext("2d");
    if (!context) return;

    context.filter = `invert(${marked ? 1 : 0})`;

    context.drawImage(
      sourceImage,
      3 + x * (sw + 7),
      4 + y * (sh + 7.5),
      sw,
      sh,
      0,
      0,
      w,
      h
    );
  }, [marked, sourceImage, x, y]);

  return (
    <div
      style={{ border: "1px solid black", height: `${h}px`, width: `${w}px` }}
    >
      <canvas
        style={{
          margin: "0px",
          height: `${h}px`,
          width: `${w}px`,
        }}
        ref={reference}
        width={w}
        height={h}
        onClick={setAsActive}
      ></canvas>
    </div>
  );
}

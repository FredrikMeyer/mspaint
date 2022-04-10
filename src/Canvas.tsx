import React from "react";

export default function Canvas({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const reference = React.useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState(50);
  const [height, setHeight] = React.useState(50);

  React.useEffect(() => {
    const current = containerRef.current;
    if (current) {
      const height = current.clientHeight;
      const width = current.clientWidth;
      setWidth(width);
      setHeight(height);
    }
  }, [containerRef]);

  return <canvas ref={reference} width={width} height={height}></canvas>;
}

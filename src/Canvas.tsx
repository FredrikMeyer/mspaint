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

  React.useEffect(() => {
    const current = reference.current;
    if (current) {
      const ctx = current.getContext("2d");
      if (ctx) {
        const fontSize = (width * 20) / 200;
        ctx.font = `${fontSize}px serif`;
        ctx.fillText("Velkommen ", 10, 100);
      }
    }
  });

  return <canvas ref={reference} width={width} height={height}></canvas>;
}

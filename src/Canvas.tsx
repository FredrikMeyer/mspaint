import React from "react";

function useCtx(reference: React.RefObject<HTMLCanvasElement>) {
  const current = reference.current;
  const ctx = current?.getContext("2d");

  const boundingRect = current?.getBoundingClientRect();
  return { ctx: ctx, boundingRect: boundingRect };
}

export default function Canvas({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const reference = React.useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = React.useState(50);
  const [height, setHeight] = React.useState(50);

  const { ctx, boundingRect } = useCtx(reference);

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
      if (ctx) {
        const fontSize = (width * 20) / 200;
        ctx.font = `${fontSize}px serif`;
        ctx.fillText("Welcome", 10, 100);
        ctx.font = `${fontSize / 2}px serif`;
        ctx.fillText("draw here", 10, 200);
      }
    }
  });

  return (
    <canvas
      ref={reference}
      width={width}
      height={height}
      onTouchStart={(e) => {
        ctx?.beginPath();
      }}
      onTouchMove={(e) => {
        const x = e.touches[0].clientX - (boundingRect?.left || 0);
        const y = e.touches[0].clientY - (boundingRect?.top || 0);

        if (ctx) {
          ctx.ellipse(x, y, 3, 3, 0, 0, 0);
          ctx.stroke();
        }
      }}
      onMouseDown={(e) => {
        ctx?.beginPath();
      }}
      onMouseMove={(e) => {
        if (e.buttons !== 1) return;

        const x = e.clientX - (boundingRect?.left || 0);
        const y = e.clientY - (boundingRect?.top || 0);

        if (ctx) {
          ctx.ellipse(x, y, 3, 3, 0, 0, 0);
          ctx.stroke();
        }
      }}
      onMouseUp={(e) => {
        if (ctx) {
          ctx.stroke();
        }
      }}
    ></canvas>
  );
}

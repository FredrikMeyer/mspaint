import React from "react";

function useCtx(reference: React.RefObject<HTMLCanvasElement>) {
  const current = reference.current;
  const ctx = current?.getContext("2d");

  return { ctx: ctx };
}

export default function Canvas({
  width,
  height,
  containerRef,
  currentColor,
}: {
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement>;
  currentColor: string;
}) {
  const reference = React.useRef<HTMLCanvasElement>(null);

  const { ctx } = useCtx(reference);

  const [left, setLeft] = React.useState(0);
  const [top, setTop] = React.useState(0);

  React.useEffect(() => {
    const boundingRect = containerRef.current?.getBoundingClientRect();
    if (boundingRect) {
      setLeft(boundingRect.left);
      setTop(boundingRect.top);
    }
  }, [containerRef]);

  React.useEffect(() => {
    const current = reference.current;
    if (current) {
      if (ctx) {
        const fontSize = (width * 15) / 200;
        ctx.font = `${fontSize}px serif`;
        ctx.fillText("Welcome", 10, 150);
        ctx.font = `${fontSize / 2}px serif`;
        ctx.fillText("draw here", 10, 250);

        ctx.font = `${fontSize / 4}px serif`;
        ctx.fillText("under construction ;)", 10, 300);
      } else {
        // eslint-disable-next-line no-console
        console.error("no ctx");
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("no current");
    }
  }, [reference, width, ctx]);

  return (
    <canvas
      ref={reference}
      width={width}
      height={height}
      onTouchStart={() => {
        ctx?.beginPath();
      }}
      onTouchMove={(e) => {
        const x = e.touches[0].clientX - left;
        const y = e.touches[0].clientY - top;

        if (ctx) {
          ctx.strokeStyle = currentColor;
          ctx.ellipse(x, y, 3, 3, 0, 0, 0);
          ctx.stroke();
        }
      }}
      onMouseDown={() => {
        ctx?.beginPath();
      }}
      onMouseMove={(e) => {
        if (e.buttons !== 1) return;

        const x = e.clientX - left;
        const y = e.clientY - top;

        if (ctx) {
          ctx.strokeStyle = currentColor;
          ctx.ellipse(x, y, 3, 3, 0, 0, 0);
          ctx.stroke();
        }
      }}
      onMouseUp={() => {
        if (ctx) {
          ctx.stroke();
        }
      }}
    ></canvas>
  );
}

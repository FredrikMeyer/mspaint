import React from "react";
import { DrawingTool } from "./types";

function useCtx(reference: React.RefObject<HTMLCanvasElement>) {
  const current = reference.current;
  const ctx = current?.getContext("2d");

  return { ctx: ctx };
}

export default function Canvas({
  width,
  height,
  containerRef,
  canvasRef,
  currentColor,
  activeTool,
}: {
  activeTool: DrawingTool;
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentColor: string;
}) {
  const { ctx } = useCtx(canvasRef);

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
    const current = canvasRef.current;
    if (current) {
      const ctx = current.getContext("2d");
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
        console.error("No canvas ctx yet");
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("No ref! (ie canvas was not mounted)");
    }
  }, [canvasRef, width]);

  const onTouchStart = React.useCallback(() => {
    ctx?.beginPath();
  }, [ctx]);

  const onMove = React.useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      if (activeTool == "DRAW") {
        ctx.strokeStyle = currentColor;
      } else if (activeTool == "ERASE") {
        ctx.strokeStyle = "white";
      }
      ctx.ellipse(x, y, 3, 3, 0, 0, 0);
      ctx.stroke();
    },
    [currentColor, activeTool]
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onTouchStart={onTouchStart}
      onTouchMove={(e) => {
        const x = e.touches[0].clientX - left;
        const y = e.touches[0].clientY - top;

        if (ctx) {
          onMove(ctx, x, y);
        }
      }}
      onMouseDown={onTouchStart}
      onMouseMove={(e) => {
        if (e.buttons !== 1) return;

        const x = e.clientX - left;
        const y = e.clientY - top;

        if (ctx) {
          onMove(ctx, x, y);
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

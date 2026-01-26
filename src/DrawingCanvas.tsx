import React from "react";
import { DrawingTool } from "./Toolbar";
import "./Canvas.scss";
import { Color, ColorFactory } from "./colors";
import FloodFiller from "./floodFill";
import { useScaleByDevicePixelRatio } from "./canvasUtils";

function useCtx(reference: React.RefObject<HTMLCanvasElement | null>) {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const canvasElement = reference.current;
    if (canvasElement !== null) {
      const context = canvasElement.getContext("2d");
      if (context) {
        setCtx(context);
      }
    }
  }, [reference]);

  return { ctx: ctx };
}

function mouseEventToCoords(
  ev: React.MouseEvent<HTMLCanvasElement>,
  top: number,
  left: number,
) {
  // Get the target canvas element
  const canvas = ev.currentTarget;
  
  // Calculate the position relative to the canvas element
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  // Calculate the scale factor between the CSS size and the actual canvas size
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Apply the scale to get the correct coordinates on the canvas
  return [x * scaleX, y * scaleY];
}

export default function DrawingCanvas({
  activeTool,
  toolSize,
  currentColor,
  width: originalWidth,
  height: originalHeight,
  canvasRef,
  backgroundCanvasRef,
  leftTop,
  onCommit,
}: {
  activeTool: DrawingTool;
  toolSize: number;
  currentColor: Color;
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  leftTop: { left: number; top: number };
  onCommit: () => void;
}) {
  const [width, height] = useScaleByDevicePixelRatio(
    canvasRef,
    originalWidth,
    originalHeight,
  );

  const [drawingState, setDrawingState] = React.useState<
    | { tool: "LINE"; startPoint: [number, number] }
    | { tool: "SQUARE"; startPoint: [number, number] }
    | { tool: "CIRCLE"; startPoint: [number, number] }
    | undefined
  >(undefined);
  const { ctx } = useCtx(canvasRef);

  const onDrawStart = React.useCallback(
    (x: number, y: number) => {
      if (activeTool === "LINE") {
        ctx?.moveTo(x, y);
      } else {
        ctx?.beginPath();
      }
    },
    [ctx, activeTool],
  );

  const onMove = React.useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.lineWidth = toolSize;
      ctx.strokeStyle = ColorFactory.toRGBString(currentColor);
      if (activeTool === "LINE" && drawingState?.tool === "LINE") {
        const [startX, startY] = drawingState.startPoint;
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        return;
      }
      if (activeTool === "SQUARE" && drawingState?.tool === "SQUARE") {
        const [startX, startY] = drawingState.startPoint;
        ctx.clearRect(0, 0, width, height);
        const rectWidth = Math.floor(x - startX);
        const rectHeight = Math.floor(y - startY);
        ctx.strokeRect(
          Math.floor(startX) + 0.5,
          Math.floor(startY) + 0.5,
          rectWidth,
          rectHeight,
        );
        ctx.stroke();
        return;
      }
      if (activeTool === "ROUNDED_RECT" && drawingState?.tool === "SQUARE") {
        const [startX, startY] = drawingState.startPoint;
        ctx.clearRect(0, 0, width, height);
        const rectWidth = Math.floor(x - startX);
        const rectHeight = Math.floor(y - startY);
        ctx.beginPath();
        ctx.roundRect(
          Math.floor(startX) + 0.5,
          Math.floor(startY) + 0.5,
          rectWidth,
          rectHeight,
          20,
        );
        ctx.stroke();
        return;
      }
      if (activeTool === "CIRCLE" && drawingState?.tool === "CIRCLE") {
        const [startX, startY] = drawingState.startPoint;
        ctx.clearRect(0, 0, width, height);
        const rectWidth = x - startX;
        const rectHeight = y - startY;

        const rx = Math.abs(rectWidth);
        const ry = Math.abs(rectHeight);

        const cx = startX + 0.5 * rectWidth;
        const cy = startY + 0.5 * rectHeight;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 0.5 * rx, 0.5 * ry, 0, 0, Math.PI * 2);

        ctx.stroke();
        return;
      }
      if (activeTool == "DRAW") {
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (activeTool == "ERASE") {
        ctx.strokeStyle = "white";
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    },

    [currentColor, activeTool, toolSize, height, width, drawingState],
  );

  const floodfillerRef = React.useRef<FloodFiller | undefined>(undefined);

  React.useEffect(() => {
    const canvas = backgroundCanvasRef.current;
    if (canvas) {
      floodfillerRef.current = new FloodFiller(canvas, width, height);
    }
  }, [backgroundCanvasRef, width, height]);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const [x, y] = mouseEventToCoords(e, leftTop.top, leftTop.left);
      if (activeTool === "LINE") {
        setDrawingState({ tool: "LINE", startPoint: [x, y] });
      }
      if (activeTool === "SQUARE") {
        setDrawingState({ tool: "SQUARE", startPoint: [x, y] });
      }
      if (activeTool === "ROUNDED_RECT") {
        setDrawingState({ tool: "SQUARE", startPoint: [x, y] });
      }
      if (activeTool === "CIRCLE") {
        setDrawingState({ tool: "CIRCLE", startPoint: [x, y] });
      }
      if (activeTool == "FILL") {
        if (floodfillerRef.current) {
          floodfillerRef.current.floodFill(x, y, currentColor);
        }
      }
      onDrawStart(x, y);
    },
    [activeTool, leftTop.left, leftTop.top, onDrawStart, currentColor],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.buttons !== 1) return;

      const [x, y] = mouseEventToCoords(e, leftTop.top, leftTop.left);

      if (ctx) {
        onMove(ctx, x, y);
      }
    },
    [ctx, leftTop.left, leftTop.top, onMove],
  );

  const onPointerUp = React.useCallback(() => {
    if (ctx) {
      setDrawingState(undefined);
      onCommit();
    }
  }, [ctx, onCommit]);

  return (
    <canvas
      id="drawing-canvas"
      ref={canvasRef}
      width={width}
      height={height}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    ></canvas>
  );
}

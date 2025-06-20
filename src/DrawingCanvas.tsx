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

function getNewPixel(contxt: CanvasRenderingContext2D, size: number) {
  const p = contxt.createImageData(size, size);
  const d = p.data;

  for (let i = 0; i < d.length / 4; i++) {
    d[4 * i] = 0;
    d[4 * i + 1] = 0;
    d[4 * i + 2] = 0;
    d[4 * i + 3] = 255;
  }

  return p;
}

function mouseEventToCoords(
  ev: React.MouseEvent<HTMLCanvasElement>,
  top: number,
  left: number,
) {
  const x = ev.clientX - left;
  const y = ev.clientY - top;

  const scale = window.devicePixelRatio;

  return [x * scale, y * scale];
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
        /* const ry = Math.abs(rectHeight); */

        const cx = Math.round(startX + 0.5 * rectWidth);
        const cy = Math.round(startY + 0.5 * rectHeight);
        ctx.beginPath();
        ctx.fillStyle = ColorFactory.toRGBString(currentColor);
        ctx.fillRect(cx, cy, 1, 1);

        const pxl = getNewPixel(ctx, toolSize);
        const circleSymmetricPts = (x: number, y: number) => {
          ctx.putImageData(pxl, x, y);
          ctx.putImageData(pxl, x, -y + 2 * cy); // x, -y
          ctx.putImageData(pxl, -x + 2 * cx, y); // -x, y
          ctx.putImageData(pxl, -x + 2 * cx, -y + 2 * cy); // -x, -y

          ctx.putImageData(pxl, y - cy + cx, x - cx + cy); // y, x
          ctx.putImageData(pxl, y - cy + cx, -x + cx + cy); // y, -x  : y -> y - cy -> x - cx -> cx - x -> cx - x + cy
          ctx.putImageData(pxl, -y + cy + cx, x - cx + cy); // - y, x : x -> x - cx -> y - cy -> cy - y -> cy -y + cx
          ctx.putImageData(pxl, -y + cy + cx, -x + cx + cy); // -y, -x :
        };

        const drawCircle = (radius: number) => {
          let xPosition = 0;
          let yPosition = radius;
          let d = 1 - radius;
          circleSymmetricPts(cx + xPosition, cy + yPosition);

          while (yPosition > xPosition) {
            if (d < 0) {
              d = d + 2 * xPosition + 3;
            } else {
              d = d + 2 * (xPosition - yPosition) + 5;
              yPosition = yPosition - 1;
            }
            xPosition = xPosition + 1;
            circleSymmetricPts(cx + xPosition, cy + yPosition);
          }
        };

        drawCircle(rx);
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

  const floodfiller = React.useMemo(
    () =>
      backgroundCanvasRef.current
        ? new FloodFiller(backgroundCanvasRef.current, width, height)
        : undefined,
    [backgroundCanvasRef, width, height],
  );

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
        if (floodfiller) {
          floodfiller.floodFill(x, y, currentColor);
        }
      }
      onDrawStart(x, y);
    },
    [
      activeTool,
      leftTop.left,
      leftTop.top,
      onDrawStart,
      floodfiller,
      currentColor,
    ],
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

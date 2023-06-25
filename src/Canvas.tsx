import React from "react";
import { DrawingTool } from "./Toolbar";
import "./Canvas.scss";
import { Color } from "./colors";
import FloodFiller from "./floodFill";

function useCtx(reference: React.RefObject<HTMLCanvasElement>) {
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | undefined>(
    undefined
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
  left: number
) {
  const x = ev.clientX - left;
  const y = ev.clientY - top;

  const scale = window.devicePixelRatio;

  return [x * scale, y * scale];
}

function DrawingCanvas({
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
  canvasRef: React.RefObject<HTMLCanvasElement>;
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
  leftTop: { left: number; top: number };
  onCommit: () => void;
}) {
  const [width, height] = useScaleByDevicePixelRatio(
    canvasRef,
    originalWidth,
    originalHeight
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
    [ctx, activeTool]
  );

  const onMove = React.useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      ctx.lineWidth = toolSize;
      ctx.strokeStyle = Color.toRGBString(currentColor);
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
          rectHeight
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
          20
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

    [currentColor, activeTool, toolSize, height, width, drawingState]
  );

  const floodfiller = React.useMemo(
    () =>
      backgroundCanvasRef.current
        ? new FloodFiller(backgroundCanvasRef.current)
        : undefined,
    [backgroundCanvasRef]
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
    ]
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.buttons !== 1) return;

      const [x, y] = mouseEventToCoords(e, leftTop.top, leftTop.left);

      if (ctx) {
        onMove(ctx, x, y);
      }
    },
    [ctx, leftTop.left, leftTop.top, onMove]
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

function useScaleByDevicePixelRatio(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  width: number,
  height: number
) {
  const [scaledWidthHeight, setScaledWidthHeight] = React.useState<
    null | [number, number]
  >(null);

  React.useLayoutEffect(() => {
    const current = canvasRef.current;
    const context = current?.getContext("2d");

    const scale = window.devicePixelRatio; // 2 on retina
    if (current) {
      if (!context) {
        console.warn("Context not loaded before scaling.");
        return;
      }

      setScaledWidthHeight([
        Math.floor(width * scale),
        Math.floor(height * scale),
      ]);

      context.scale(scale, scale);
      current.style.width = `${width}px`;
      current.style.height = `${height}px`;
    } else {
      console.warn("Canvas element not loaded before scaling.");
    }

    return () => context?.scale(1 / scale, 1 / scale);
  }, [canvasRef, height, width]);

  return scaledWidthHeight || [width, height];
}

function BackgroundCanvas({
  width: originalWidth,
  height: originalHeight,
  canvasRef,
}: {
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const [width, height] = useScaleByDevicePixelRatio(
    canvasRef,
    originalWidth,
    originalHeight
  );

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
      } else {
        // eslint-disable-next-line no-console
        console.error("No canvas ctx yet");
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("No background ref! (ie canvas was not mounted)");
    }
  }, [canvasRef, width]);

  return (
    <canvas
      id="background-canvas"
      width={width}
      height={height}
      ref={canvasRef}
    ></canvas>
  );
}

// function useTopLeft TODO
function useTopLeftCorner(container: HTMLDivElement) {
  const [leftTop, setLeftTop] = React.useState<
    { left: number; top: number } | undefined
  >(undefined);

  React.useLayoutEffect(() => {
    const boundingRect = container.getBoundingClientRect();
    if (boundingRect) {
      const { left, top } = boundingRect;
      setLeftTop({ left, top });
    }
  }, [container]);

  return leftTop;
}

export default function Canvas({
  width,
  height,
  container,
  backgroundCanvasRef,
  currentColor,
  activeTool,
  toolSize,
}: {
  activeTool: DrawingTool;
  width: number;
  height: number;
  container: HTMLDivElement;
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement>;
  currentColor: Color;
  toolSize: number;
}) {
  // TODO: https://react.dev/reference/react/forwardRef
  // Use useImperativeHandle so that App.tsx doesn't need to know about internals of canvas
  const drawingCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const leftTop = useTopLeftCorner(container);

  const onCommit = React.useCallback(() => {
    if (drawingCanvasRef.current) {
      const drawingCanvas = drawingCanvasRef.current;
      const context = drawingCanvas.getContext("2d");
      if (context) {
        const backgroundContext = backgroundCanvasRef.current?.getContext("2d");

        if (backgroundContext) {
          backgroundContext.globalCompositeOperation = "source-over";
          backgroundContext.drawImage(drawingCanvas, 0, 0);
        }

        const scale = window.devicePixelRatio;
        context.clearRect(
          0,
          0,
          drawingCanvas.width * scale,
          drawingCanvas.height * scale
        );
      }
    }
  }, [backgroundCanvasRef]);

  return (
    <>
      <BackgroundCanvas
        canvasRef={backgroundCanvasRef}
        width={width}
        height={height}
      />

      {leftTop && (
        <DrawingCanvas
          toolSize={toolSize}
          currentColor={currentColor}
          leftTop={leftTop}
          activeTool={activeTool}
          canvasRef={drawingCanvasRef}
          backgroundCanvasRef={backgroundCanvasRef}
          width={width}
          height={height}
          onCommit={onCommit}
        />
      )}
    </>
  );
}

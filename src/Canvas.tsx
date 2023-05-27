import React from "react";
import { DrawingTool } from "./types";
import "./Canvas.scss";

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

  return [x, y];
}

function DrawingCanvas({
  activeTool,
  toolSize,
  currentColor,
  width,
  height,
  canvasRef,
  leftTop,
  onCommit,
}: {
  activeTool: DrawingTool;
  toolSize: number;
  currentColor: string;
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  leftTop: { left: number; top: number };
  onCommit: () => void;
}) {
  const [drawingState, setDrawingState] = React.useState<
    | { tool: "LINE"; startPoint: [number, number] }
    | { tool: "SQUARE"; startPoint: [number, number] }
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
      ctx.strokeStyle = currentColor;
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
        const rectWidth = x - startX;
        const rectHeight = y - startY;
        ctx.strokeRect(startX, startY, rectWidth, rectHeight);
        ctx.stroke();
        return;
      }
      if (activeTool === "ROUNDED_RECT" && drawingState?.tool === "SQUARE") {
        const [startX, startY] = drawingState.startPoint;
        ctx.clearRect(0, 0, width, height);
        const rectWidth = x - startX;
        const rectHeight = y - startY;
        ctx.beginPath();
        ctx.roundRect(startX, startY, rectWidth, rectHeight, 20);
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
      onDrawStart(x, y);
    },
    [activeTool, leftTop.left, leftTop.top, onDrawStart]
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

function BackgroundCanvas({
  width,
  height,
  canvasRef,
}: {
  width: number;
  height: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
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

export default function Canvas({
  width,
  height,
  container,
  canvasRef,
  currentColor,
  activeTool,
  toolSize,
}: {
  activeTool: DrawingTool;
  width: number;
  height: number;
  container: HTMLDivElement;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentColor: string;
  toolSize: number;
}) {
  // TODO: https://react.dev/reference/react/forwardRef
  // Use useImperativeHandle so that App.tsx doesn't need to know about internals of canvas
  const drawingCanvasRef = React.useRef<HTMLCanvasElement>(null);

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

  const onCommit = React.useCallback(() => {
    if (drawingCanvasRef.current) {
      const drawingCanvas = drawingCanvasRef.current;
      const context = drawingCanvas.getContext("2d");
      if (context) {
        const backgroundContext = canvasRef.current?.getContext("2d");

        if (backgroundContext) {
          backgroundContext.globalCompositeOperation = "source-over";
          backgroundContext.drawImage(drawingCanvas, 0, 0);
        }

        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      }
    }
  }, [canvasRef]);

  return (
    <>
      <BackgroundCanvas canvasRef={canvasRef} width={width} height={height} />
      {leftTop && (
        <DrawingCanvas
          toolSize={toolSize}
          currentColor={currentColor}
          leftTop={leftTop}
          activeTool={activeTool}
          canvasRef={drawingCanvasRef}
          width={width}
          height={height}
          onCommit={onCommit}
        />
      )}
    </>
  );
}

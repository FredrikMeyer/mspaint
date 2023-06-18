import React from "react";
import { DrawingTool } from "./Toolbar";
import "./Canvas.scss";
import { Color } from "./colors";

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

  const floodFill = React.useCallback(
    (x: number, y: number) => {
      // 1. Get pixel array of the background canvas
      // 2. Get the color of the point (x,y)
      // 3. Use algorithm on pixel array
      // 4. Put the pixel array back

      const backgroundContext = backgroundCanvasRef.current?.getContext("2d");

      if (!backgroundContext || !backgroundCanvasRef.current) {
        console.warn("No backgroundContxt!");
        return;
      }

      const imageData = backgroundContext.getImageData(
        0,
        0,
        backgroundCanvasRef.current.width,
        backgroundCanvasRef.current.height
      );

      const imageDataArray = imageData.data;

      const ptToIndex = (x: number, y: number): number => {
        return Math.round(y) * width + Math.round(x);
      };

      const indexToPt = (ind: number): [number, number] => {
        const x = ind % width;
        const y = (ind - x) / width;

        return [x, y];
      };

      const neighboursOfPt = (
        x: number,
        y: number
      ): { x: number; y: number }[] => {
        // Return neighbours in north/south/etc directions within the frame
        return [
          { x: x + 1, y },
          { x: x - 1, y },
          { x, y: y - 1 },
          { x, y: y + 1 },
        ].filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y <= height);
      };

      const shouldBeColored = (
        x: number,
        y: number,
        startColor: number,
        dataArray: Uint32Array
      ): boolean => {
        // Check if point is the same color as start color

        const indexOfPt = ptToIndex(x, y);

        const color = dataArray[indexOfPt];
        return color === startColor;
      };

      const fillArray = (
        startX: number,
        startY: number,
        newColor: number,
        dataArray: Uint32Array
      ) => {
        const startColor = dataArray[ptToIndex(startX, startY)];
        const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];

        let current = queue.shift();
        let i = 0;
        while (current && i < width * height) {
          const neigbours = neighboursOfPt(current.x, current.y);

          for (const n of neigbours) {
            if (shouldBeColored(n.x, n.y, startColor, dataArray)) {
              queue.push(n);
              dataArray[ptToIndex(n.x, n.y)] = newColor;
            }
          }

          current = queue.shift();
          i++;
        }
      };

      const doFill = () => {
        imageData.data.set(buf8);
        backgroundContext.putImageData(imageData, 0, 0);
      };

      const buf = imageDataArray.buffer;
      const buf8 = new Uint8ClampedArray(buf);
      const data = new Uint32Array(buf);

      fillArray(x, y, Color.to32BitRepresentation(currentColor), data);
      doFill();
    },
    [backgroundCanvasRef, height, width, currentColor]
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
        floodFill(x, y);
      }
      onDrawStart(x, y);
    },
    [activeTool, leftTop.left, leftTop.top, onDrawStart, floodFill]
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
        const backgroundContext = backgroundCanvasRef.current?.getContext("2d");

        if (backgroundContext) {
          backgroundContext.globalCompositeOperation = "source-over";
          backgroundContext.drawImage(drawingCanvas, 0, 0);
        }

        context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      }
    }
  }, [backgroundCanvasRef]);

  React.useEffect(() => {
    const ctx = drawingCanvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
  }, []);

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

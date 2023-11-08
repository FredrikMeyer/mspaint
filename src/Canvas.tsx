import React from "react";
import { DrawingTool } from "./Toolbar";
import "./Canvas.scss";
import { Color } from "./colors";
import { useScaleByDevicePixelRatio } from "./canvasUtils";
import DrawingCanvas from "./DrawingCanvas";

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
    originalHeight,
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
          drawingCanvas.height * scale,
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

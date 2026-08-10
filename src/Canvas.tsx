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
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  // Store the canvas content when dimensions change
  const previousCanvasContent = React.useRef<ImageData | null>(null);
  const previousDimensions = React.useRef<{width: number, height: number} | null>(null);
  
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
        // If we have previous content and dimensions have changed, restore it
        if (previousCanvasContent.current && previousDimensions.current &&
            (previousDimensions.current.width !== width || previousDimensions.current.height !== height)) {
          // Create a temporary canvas to hold the previous content
          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = previousDimensions.current.width;
          tempCanvas.height = previousDimensions.current.height;
          const tempCtx = tempCanvas.getContext("2d");
          
          if (tempCtx) {
            // Put the previous content on the temp canvas
            tempCtx.putImageData(previousCanvasContent.current, 0, 0);
            
            // Draw the temp canvas onto the resized canvas
            ctx.drawImage(tempCanvas, 0, 0);
          }
        } else if (!previousCanvasContent.current) {
          // First render, draw the welcome text
          const fontSize = (width * 15) / 200;
          ctx.font = `${fontSize}px serif`;
          ctx.fillText("Welcome", 10, 150);
          ctx.font = `${fontSize / 2}px serif`;
          ctx.fillText("draw here", 10, 250);
        }
        
        // Store the current canvas content for future resizes
        try {
          previousCanvasContent.current = ctx.getImageData(0, 0, width, height);
          previousDimensions.current = { width, height };
        } catch (e) {
          console.error("Failed to get image data:", e);
        }
      } else {
        console.error("No canvas ctx yet");
      }
    } else {
      console.error("No background ref! (ie canvas was not mounted)");
    }
  }, [canvasRef, width, height]);

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
function useTopLeftCorner(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [leftTop, setLeftTop] = React.useState<
    { left: number; top: number } | undefined
  >(undefined);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      const boundingRect = container.getBoundingClientRect();
      if (boundingRect) {
        const { left, top } = boundingRect;
        setLeftTop({ left, top });
      }
    }
  }, [containerRef]);

  return leftTop;
}

export default function Canvas({
  width,
  height,
  containerRef,
  backgroundCanvasRef,
  currentColor,
  activeTool,
  toolSize,
}: {
  activeTool: DrawingTool;
  width: number;
  height: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  backgroundCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentColor: Color;
  toolSize: number;
}) {
  // TODO: https://react.dev/reference/react/forwardRef
  // Use useImperativeHandle so that App.tsx doesn't need to know about internals of canvas
  const drawingCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const leftTop = useTopLeftCorner(containerRef);

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

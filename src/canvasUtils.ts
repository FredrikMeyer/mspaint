import React from "react";

/**
 * Resizes a canvas while preserving its content
 * @param canvas The canvas element to resize
 * @param newWidth The new width
 * @param newHeight The new height
 */
export function resizeCanvas(
  canvas: HTMLCanvasElement,
  newWidth: number,
  newHeight: number,
) {
  // Create a temporary canvas to store the current content
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");

  if (!tempContext) {
    console.warn("Could not get context for temporary canvas");
    return;
  }

  // Set the temporary canvas to the current canvas size
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // Copy the current canvas content to the temporary canvas
  tempContext.drawImage(canvas, 0, 0);

  // Resize the original canvas
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Get the context of the original canvas
  const context = canvas.getContext("2d");

  if (!context) {
    console.warn("Could not get context for canvas");
    return;
  }

  // Copy the content back to the resized canvas without stretching
  // Use the original dimensions to avoid stretching the content
  context.drawImage(
    tempCanvas,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
  );
}

export function useScaleByDevicePixelRatio(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
) {
  const [scaledWidthHeight, setScaledWidthHeight] = React.useState<
    null | [number, number]
  >(null);

  // Store previous dimensions to detect changes
  const prevDimensions = React.useRef<[number, number]>([0, 0]);

  React.useLayoutEffect(() => {
    const current = canvasRef.current;
    const context = current?.getContext("2d");

    const scale = window.devicePixelRatio; // 2 on retina
    if (current) {
      if (!context) {
        console.warn("Context not loaded before scaling.");
        return;
      }

      const scaledWidth = Math.floor(width * scale);
      const scaledHeight = Math.floor(height * scale);

      // Check if dimensions have changed
      if (
        prevDimensions.current[0] !== 0 &&
        prevDimensions.current[1] !== 0 &&
        (prevDimensions.current[0] !== scaledWidth ||
          prevDimensions.current[1] !== scaledHeight)
      ) {
        // Resize the canvas while preserving content
        resizeCanvas(current, scaledWidth, scaledHeight);
        // Reset the scale after resize
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(scale, scale);
      } else if (
        prevDimensions.current[0] === 0 &&
        prevDimensions.current[1] === 0
      ) {
        // Initial setup
        current.width = scaledWidth;
        current.height = scaledHeight;
        context.scale(scale, scale);
      }

      // Update previous dimensions
      prevDimensions.current = [scaledWidth, scaledHeight];

      setScaledWidthHeight([scaledWidth, scaledHeight]);

      current.style.width = `${width}px`;
      current.style.height = `${height}px`;
    } else {
      console.warn("Canvas element not loaded before scaling.");
    }

    return () => context?.scale(1 / scale, 1 / scale);
  }, [canvasRef, height, width]);

  return scaledWidthHeight || [width, height];
}

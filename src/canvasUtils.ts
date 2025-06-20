import React from "react";

export function useScaleByDevicePixelRatio(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  width: number,
  height: number,
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

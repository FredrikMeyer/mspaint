import { Color } from "./colors";

export default function floadFill(
  x: number,
  y: number,
  backgroundCanvas: HTMLCanvasElement,
  width: number,
  height: number,
  currentColor: Color
) {
  // 1. Get pixel array of the background canvas
  // 2. Get the color of the point (x,y)
  // 3. Use algorithm on pixel array
  // 4. Put the pixel array back

  const backgroundContext = backgroundCanvas.getContext("2d");

  if (!backgroundContext) {
    console.warn("No backgroundContxt!");
    return;
  }

  const imageData = backgroundContext.getImageData(0, 0, width, height);

  const imageDataArray = imageData.data;

  const ptToIndex = (x: number, y: number): number => {
    return Math.round(y) * width + Math.round(x);
  };

  const indexToPt = (ind: number): [number, number] => {
    const x = ind % width;
    const y = (ind - x) / width;

    return [x, y];
  };

  const neighboursOfPt = (x: number, y: number): { x: number; y: number }[] => {
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
      if (i % 100000 === 0) {
        console.log(i);
      }
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
}

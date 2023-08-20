import { Color } from "./colors";

export default class FloodFiller {
  #backgroundCanvas: HTMLCanvasElement;
  #width: number;
  #height: number;

  constructor(
    backgroundCanvas: HTMLCanvasElement,
    width: number,
    height: number,
  ) {
    this.#backgroundCanvas = backgroundCanvas;
    this.#width = width;
    this.#height = height;
  }

  #neighboursOfPt(x: number, y: number): { x: number; y: number }[] {
    // Optimised thanks to ChatGPT
    // Generate only valid neighbors to avoid unnecessary calculations
    const neighbours = [];
    if (x + 1 < this.#width) neighbours.push({ x: x + 1, y });
    if (x - 1 >= 0) neighbours.push({ x: x - 1, y });
    if (y + 1 < this.#height) neighbours.push({ x, y: y + 1 });
    if (y - 1 >= 0) neighbours.push({ x, y: y - 1 });
    return neighbours;
  }

  #ptToIndex(x: number, y: number): number {
    return y * this.#width + x;
  }

  #shouldBeColored(
    index: number,
    startColor: number,
    dataArray: Uint32Array,
  ): boolean {
    // Check if point is the same color as start color

    const color = dataArray[index];
    return color === startColor;
  }

  #fillArray(
    startX: number,
    startY: number,
    newColor: number,
    dataArray: Uint32Array,
  ) {
    const startColor = dataArray[this.#ptToIndex(startX, startY)];
    const queue: { x: number; y: number }[] = [{ x: startX, y: startY }];
    const visitedNodes = new Array(this.#width * this.#height);

    let current = queue.shift();
    let i = 0;
    while (current && i < this.#width * this.#height) {
      if (i % 1000000 === 0) {
        console.log(i);
      }
      const neigbours = this.#neighboursOfPt(current.x, current.y);

      for (const n of neigbours) {
        const index = this.#ptToIndex(n.x, n.y);
        if (
          !visitedNodes[index] &&
          this.#shouldBeColored(index, startColor, dataArray)
        ) {
          queue.push(n);
          dataArray[index] = newColor;
          visitedNodes[index] = true;
        }
      }

      current = queue.shift();
      i++;
    }
  }

  floodFill(x: number, y: number, currentColor: Color) {
    // 1. Get pixel array of the background canvas
    // 2. Get the color of the point (x,y)
    // 3. Use algorithm on pixel array
    // 4. Put the pixel array back

    const backgroundContext = this.#backgroundCanvas.getContext("2d");

    if (!backgroundContext) {
      console.warn("No backgroundContxt!");
      return;
    }

    const imageData = backgroundContext.getImageData(
      0,
      0,
      this.#width,
      this.#height,
    );

    const doFill = () => {
      imageData.data.set(buf8);
      backgroundContext.putImageData(imageData, 0, 0);
    };

    const imageDataArray = imageData.data;

    const buf = imageDataArray.buffer;
    const buf8 = new Uint8ClampedArray(buf);
    const data = new Uint32Array(buf);

    this.#fillArray(
      Math.round(x),
      Math.round(y),
      Color.to32BitRepresentation(currentColor),
      data,
    );
    doFill();
  }
}

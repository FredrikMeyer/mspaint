import { Color } from "./colors";

export default class FloodFiller {
  #backgroundCanvas: HTMLCanvasElement;

  constructor(backgroundCanvas: HTMLCanvasElement) {
    this.#backgroundCanvas = backgroundCanvas;
  }

  #neighboursOfPt(x: number, y: number): { x: number; y: number }[] {
    // Return neighbours in north/south/etc directions within the frame

    return [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ].filter(
      ({ x, y }) => x >= 0 && x < this.#width && y >= 0 && y <= this.#height,
    );
  }

  get #width() {
    return this.#backgroundCanvas.width;
  }

  get #height() {
    return this.#backgroundCanvas.height;
  }

  #ptToIndex(x: number, y: number): number {
    return Math.round(y) * this.#width + Math.round(x);
  }

  #shouldBeColored(
    x: number,
    y: number,
    startColor: number,
    dataArray: Uint32Array,
  ): boolean {
    // Check if point is the same color as start color

    const indexOfPt = this.#ptToIndex(x, y);

    const color = dataArray[indexOfPt];
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
          this.#shouldBeColored(n.x, n.y, startColor, dataArray)
        ) {
          queue.push(n);
          dataArray[this.#ptToIndex(n.x, n.y)] = newColor;
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

    const imageDataArray = imageData.data;

    const doFill = () => {
      imageData.data.set(buf8);
      backgroundContext.putImageData(imageData, 0, 0);
    };

    const buf = imageDataArray.buffer;
    const buf8 = new Uint8ClampedArray(buf);
    const data = new Uint32Array(buf);

    this.#fillArray(x, y, Color.to32BitRepresentation(currentColor), data);
    doFill();
  }
}

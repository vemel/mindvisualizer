import * as vectors from "./vectors.js";
import Color from "./color.js";
import Coords from "./coords.js";
import { CoordsData } from "./interfaces.js";

export default class BackCanvas {
  font = "Calibri";
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById("back");
    this.context = this.canvas.getContext("2d");
  }

  getFontSize(lines: Array<string>): number {
    let fontSize = 100;
    while (fontSize > 23) {
      this.context.font = `${fontSize}px ${this.font}`;
      const lineFits = lines.every(
        (line) => this.context.measureText(line).width < this.canvas.width - 40
      );
      if (lineFits) break;
      fontSize--;
    }
    return fontSize;
  }

  getTextGradient(): CanvasGradient {
    const gradient = this.context.createLinearGradient(
      0,
      vectors.randInt(0, this.canvas.height),
      this.canvas.width,
      vectors.randInt(0, this.canvas.height)
    );
    gradient.addColorStop(0, `hsl(${vectors.randInt(0, 255)}, 100%, 50%)`);
    gradient.addColorStop(0.4, `hsl(${vectors.randInt(0, 255)}, 100%, 50%)`);
    gradient.addColorStop(0.5, `hsl(${vectors.randInt(0, 255)}, 100%, 50%)`);
    gradient.addColorStop(0.6, `hsl(${vectors.randInt(0, 255)}, 100%, 50%)`);
    gradient.addColorStop(1, `hsl(${vectors.randInt(0, 255)}, 100%, 50%)`);
    return gradient;
  }

  drawText(text: string): void {
    this.context.textAlign = "center";
    const lines = text.split(",");
    console.log("Rendering", lines);
    this.context.fillStyle = this.getTextGradient();
    this.context.font = `${this.getFontSize(lines)}px ${this.font}`;
    const lineMeasures = this.context.measureText(text);
    const lineHeight = Math.floor(lineMeasures.actualBoundingBoxAscent * 1.5);

    lines.forEach((line, index) => {
      this.context.fillText(
        line,
        this.canvas.width / 2,
        this.canvas.height / 2 +
          lineHeight -
          (lines.length * lineHeight) / 2 +
          index * lineHeight
      );
    });
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCoords(): Map<string, CoordsData> {
    const imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const data = imageData.data;
    const result = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const coords = new Coords(
        ((i / 4) % this.canvas.width) / this.canvas.width,
        i / 4 / this.canvas.width / this.canvas.height
      );
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const alpha = data[i + 3];
      const color = new Color(...data.slice(i, i + 4));
      if (color.isTransparent()) continue;
      result.set(coords.toString(), {
        coords,
        color: new Color(red, green, blue, alpha),
      });
    }
    return result;
  }
}

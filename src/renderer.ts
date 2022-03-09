import BackCanvas from "./backCanvas.js";
import FrontCanvas from "./frontCanvas.js";
import * as vectors from "./vectors.js";

export default class Renderer {
  created: Date;
  lastUpdate: Date | null;
  texts: Array<string>;
  shuffle: boolean;
  random: boolean;
  textIndex: number;
  backCanvas: BackCanvas;
  frontCanvas: FrontCanvas;
  speed: number;

  constructor({
    texts,
    shuffle,
    random,
    backCanvas,
    frontCanvas,
    speed,
  }: {
    texts: Array<string>;
    shuffle: boolean;
    random: boolean;
    backCanvas: BackCanvas;
    frontCanvas: FrontCanvas;
    speed: number;
  }) {
    this.created = new Date();
    this.lastUpdate = null;
    this.texts = texts;
    this.shuffle = shuffle;
    this.random = random;
    this.textIndex = 0;
    this.backCanvas = backCanvas;
    this.frontCanvas = frontCanvas;
    this.speed = speed;
  }

  getUpdateInterval(): number {
    return (1000 * 60 * 1.5) / this.speed;
  }

  shouldUpdate(): boolean {
    if (!this.lastUpdate) return true;
    if (!this.shuffle) return false;
    return Date.now() - this.lastUpdate.getTime() > this.getUpdateInterval();
  }

  updateCoords(): void {
    const text = this.random
      ? vectors.choice(this.texts)
      : this.texts[this.textIndex];
    this.textIndex = (this.textIndex + 1) % this.texts.length;
    this.backCanvas.clear();
    this.backCanvas.drawText(text);
    const coordsData = this.backCanvas.getCoords();
    this.frontCanvas.setCoordsData(coordsData);
  }

  update(): void {
    if (!this.shouldUpdate()) return;
    this.lastUpdate = new Date();
    this.updateCoords();
  }
}

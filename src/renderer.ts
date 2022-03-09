import BackCanvas from "./backCanvas.js";
import FrontCanvas from "./frontCanvas.js";

class OrderedIterator<T> {
  readonly items: Array<T>;
  protected index: number;
  constructor(items: Array<T>) {
    this.items = items;
    this.index = 0;
  }
  next(): T {
    const result = this.items[this.index];
    this.index = (this.index + 1) % this.items.length;
    return result;
  }
}

class ShuffleIterator<T> extends OrderedIterator<T> {
  indexes: Array<number>;
  constructor(items: Array<T>) {
    super(items);
    this.indexes = this.getShuffledIndexes();
  }

  getShuffledIndexes(): Array<number> {
    const result = Array.from(Array(this.items.length).keys());
    let currentIndex: number = result.length;
    let randomIndex: number = 0;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [result[currentIndex], result[randomIndex]] = [
        result[randomIndex],
        result[currentIndex],
      ];
    }
    return result;
  }

  next(): T {
    if (this.items.length === 1) return this.items[0];
    const itemIndex = this.indexes[this.index];
    this.index++;
    if (this.index >= this.indexes.length) {
      this.index = 0;
      this.indexes = this.getShuffledIndexes();
      if (this.indexes[0] === itemIndex) {
        const randomIndex =
          Math.floor(Math.random() * (this.indexes.length - 2)) + 2;
        this.indexes.splice(randomIndex, 0, itemIndex);
        this.indexes.splice(0, 1);
      }
    }
    return this.items[itemIndex];
  }
}

export default class Renderer {
  created: Date;
  lastUpdate: Date | null;
  texts: Array<string>;
  shuffle: boolean;
  backCanvas: BackCanvas;
  frontCanvas: FrontCanvas;
  speed: number;
  iterator: OrderedIterator<string>;

  constructor({
    texts,
    shuffle,
    backCanvas,
    frontCanvas,
    speed,
  }: {
    texts: Array<string>;
    shuffle: boolean;
    backCanvas: BackCanvas;
    frontCanvas: FrontCanvas;
    speed: number;
  }) {
    this.created = new Date();
    this.lastUpdate = null;
    this.texts = texts;
    this.shuffle = shuffle;
    this.backCanvas = backCanvas;
    this.frontCanvas = frontCanvas;
    this.speed = speed;
    this.iterator = this.shuffle
      ? new ShuffleIterator(this.texts)
      : new OrderedIterator(this.texts);
  }

  getUpdateInterval(): number {
    return (1000 * 60 * 1.5) / this.speed;
  }

  shouldUpdate(): boolean {
    if (!this.lastUpdate) return true;
    if (this.texts.length === 1) return false;
    return Date.now() - this.lastUpdate.getTime() > this.getUpdateInterval();
  }

  updateCoords(): void {
    const text = this.iterator.next();
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

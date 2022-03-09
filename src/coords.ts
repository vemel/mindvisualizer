import { lerp } from "./vectors.js";

export default class Coords {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  lerp(coords: Coords, t: number): Coords {
    return new Coords(lerp(this.x, coords.x, t), lerp(this.y, coords.y, t));
  }

  distance(coords: Coords): number {
    return Math.pow(
      Math.pow(this.x - coords.x, 2) + Math.pow(this.y - coords.y, 2),
      0.5
    );
  }

  scale(mult: number, coords: Coords): Coords {
    return new Coords(
      coords.x + (this.x - coords.x) * mult,
      coords.y + (this.y - coords.y) * mult
    );
  }

  rotate(center: Coords, angle: number): Coords {
    const length = this.distance(center);
    const origAngle = Math.atan2(this.y - center.y, this.x - center.x);
    const newAngle = origAngle + angle;
    return new Coords(
      center.x + length * Math.sin(newAngle),
      center.y + length * Math.cos(newAngle)
    );
  }

  equal(coords: Coords): boolean {
    return this.x === coords.x && this.y === coords.y;
  }

  toString(): string {
    return `${this.x.toFixed(6)},${this.y.toFixed(6)}`;
  }
}

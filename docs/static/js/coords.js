import { lerp } from "./vectors.js";
export default class Coords {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    lerp(coords, t) {
        return new Coords(lerp(this.x, coords.x, t), lerp(this.y, coords.y, t));
    }
    distance(coords) {
        return Math.pow(Math.pow(this.x - coords.x, 2) + Math.pow(this.y - coords.y, 2), 0.5);
    }
    scale(mult, coords) {
        return new Coords(coords.x + (this.x - coords.x) * mult, coords.y + (this.y - coords.y) * mult);
    }
    rotate(center, angle) {
        const length = this.distance(center);
        const origAngle = Math.atan2(this.y - center.y, this.x - center.x);
        const newAngle = origAngle + angle;
        return new Coords(center.x + length * Math.sin(newAngle), center.y + length * Math.cos(newAngle));
    }
    equal(coords) {
        return this.x === coords.x && this.y === coords.y;
    }
    toString() {
        return `${this.x.toFixed(6)},${this.y.toFixed(6)}`;
    }
}

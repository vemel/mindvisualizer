import { randInt, lerp, divideNorm } from './utils.js';
export default class Color {
    constructor(r = 0, g = 0, b = 0, a = 1.0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toRGBA() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }
    lerp(color, t) {
        return new Color(lerp(this.r, color.r, t), lerp(this.g, color.g, t), lerp(this.b, color.b, t), lerp(this.a, color.a, t));
    }
    copy() {
        return new Color(this.r, this.g, this.b, this.a);
    }
    alpha(a) {
        return new Color(this.r, this.g, this.b, divideNorm(a));
    }
    isTransparent() {
        return this.a < 0.0001;
    }
    random() {
        return new Color(randInt(0, 255), randInt(0, 255), randInt(0, 255), 1.0);
    }
}

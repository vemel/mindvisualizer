import {
    randInt,
    lerp,
    divideNorm
} from './vectors.js'

export default class Color {
    constructor(r, g, b, a) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    toRGBA() {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`
    }

    lerp(color, t) {
        return new Color(
            lerp(this.r, color.r, t),
            lerp(this.g, color.g, t),
            lerp(this.b, color.b, t),
        )
    }

    copy() {
        return new Color(this.r, this.g, this.b, this.a)
    }

    alpha(a) {
        return new Color(this.r, this.g, this.b, divideNorm(a))
    }

    isTransparent() {
        return this.a < 0.0001
    }
}

Color.random = function () {
    return new Color(randInt(0, 255), randInt(0, 255), randInt(0, 255), 1.0)
};

Color.black = function () {
    return new Color(0, 0, 0, 1.0)
};
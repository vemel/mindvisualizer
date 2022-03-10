import { randInt, lerp, divideNorm } from './vectors.js'

export default class Color {
  readonly r: number
  readonly g: number
  readonly b: number
  readonly a: number

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1.0) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  toRGBA(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  lerp(color: Color, t: number): Color {
    return new Color(
      lerp(this.r, color.r, t),
      lerp(this.g, color.g, t),
      lerp(this.b, color.b, t),
      lerp(this.a, color.a, t)
    )
  }

  copy(): Color {
    return new Color(this.r, this.g, this.b, this.a)
  }

  alpha(a: number): Color {
    return new Color(this.r, this.g, this.b, divideNorm(a))
  }

  isTransparent(): boolean {
    return this.a < 0.0001
  }

  random(): Color {
    return new Color(randInt(0, 255), randInt(0, 255), randInt(0, 255), 1.0)
  }
}

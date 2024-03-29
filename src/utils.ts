export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a)
}

export function choice<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function divideNorm(x: number, y: number = 1.0): number {
  return Math.max(0.0, Math.min(1.0, x / (y || 0.000001)))
}

export function randInt(start: number, end: number): number {
  return start + Math.floor(Math.random() * (end - start + 1))
}

export function sum(items: Array<number>): number {
  return items.reduce((x, s) => s + x, 0)
}

export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export function sample<T>(items: Array<T>, count: number): Array<T> {
  const result = []
  count = Math.min(count, items.length)
  while (result.length < count) {
    const item = choice(items)
    if (result.includes(item)) continue
    result.push(item)
  }
  return result
}

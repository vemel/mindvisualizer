export function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

export function choice<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function divideNorm(x: number, y: number = 1.0): number {
  return Math.max(0.0, Math.min(1.0, x / (y || 0.000001)));
}

export function randInt(start: number, end: number): number {
  return start + Math.floor(Math.random() * (end - start + 1));
}

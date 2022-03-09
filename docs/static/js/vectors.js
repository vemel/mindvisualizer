export function lerp(a, b, t) {
    return a + t * (b - a);
}
export function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
export function divideNorm(x, y = 1.0) {
    return Math.max(0.0, Math.min(1.0, x / (y || 0.000001)));
}
export function randInt(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}

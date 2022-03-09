import { easeInOutQuad, lerp, divideNorm } from "./vectors.js";
import Color from "./color.js";
import Coords from "./coords.js";

export default class Thought {
  position: Coords;
  start: Coords;
  random: number;
  angle: number;
  speed: number;
  created: Date;
  died: Date | null;
  startColor: Color | null;
  started: Date | null;
  end: Coords | null;
  ended: Date | null;
  endColor: Color | null;
  constructor({ position, speed }: { position: Coords; speed: number }) {
    this.position = position;
    this.start = position;
    this.random = Math.random();
    this.angle =
      (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.5 + 0.25) * Math.PI;
    this.speed = speed;
    this.created = new Date();
    this.died = null;

    this.startColor = null;
    this.started = null;
    this.end = null;
    this.ended = null;
    this.endColor = null;
  }

  getTravelSeconds(): number {
    const distance = this.start.distance(this.end);
    return Math.max(distance / this.speed);
  }

  getEnded(): Date {
    return new Date(this.started.getTime() + this.getTravelSeconds() * 1000);
  }

  getAlpha(): number {
    const dieMod = this.died
      ? lerp(1.0, 0.0, easeInOutQuad(this.getDieLerpT()))
      : 1.0;
    const size =
      0.4 +
      Math.sin((Date.now() - this.created.getTime()) / 500 + this.random * 6) *
        0.2;
    return size * dieMod;
  }

  getDieLerpT(): number {
    return 1.0 - divideNorm(this.died.getTime() - Date.now(), 500.0);
  }

  getRadius(): number {
    const bornMod = Math.min((Date.now() - this.created.getTime()) / 1000, 1.0);
    const dieMod = this.died
      ? lerp(1.0, 0.2, easeInOutQuad(this.getDieLerpT()))
      : 1.0;
    const size =
      6.0 +
      Math.sin((Date.now() - this.created.getTime()) / 1000 + this.random * 6) *
        2.0;
    return bornMod * dieMod * size;
  }

  die(): void {
    this.died = new Date(Date.now() + 500 + Math.random() * 2000);
  }

  getColor(): Color {
    if (!this.startColor) return new Color().random();
    if (!this.endColor) return this.startColor.alpha(this.getAlpha());
    const t = divideNorm(this.getElapsedSeconds(), this.getTravelSeconds());
    return this.startColor.lerp(this.endColor, t).alpha(this.getAlpha());
  }

  move({
    coords,
    color,
    delay,
  }: {
    coords: Coords;
    color: Color;
    delay: number;
  }): void {
    this.start = this.position;
    this.end = coords;
    this.started = new Date(Date.now() + delay * 1000);
    this.startColor = this.endColor;
    this.ended = this.getEnded();
    this.endColor = color;
    if (!this.startColor) this.startColor = this.endColor;
  }

  isDying(): boolean {
    return this.died ? true : false;
  }

  isDead(): boolean {
    const now = new Date();
    return this.died && this.died < now;
  }

  getElapsedSeconds(): number {
    return (Date.now() - this.started.getTime()) / 1000;
  }

  update(): void {
    if (!this.end) return;
    if (this.isDead()) return;
    const now = new Date();
    const totalSeconds = this.getTravelSeconds();
    const elapsed = this.getElapsedSeconds();
    if (now > this.ended) {
      this.position = this.end;
      return;
    }
    const ease = easeInOutQuad(divideNorm(elapsed, totalSeconds));
    const bezierStart = this.start.lerp(
      this.start.rotate(this.end, this.angle),
      ease
    );
    const bezierEnd = this.end.lerp(
      this.end.rotate(this.start, -this.angle),
      1.0 - ease
    );
    this.position = bezierStart.lerp(bezierEnd, ease);
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.isDead()) return;
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.getRadius(),
      0,
      2 * Math.PI,
      false
    );
    context.fillStyle = this.getColor().toRGBA();
    context.fill();
    context.lineWidth = 0;
    context.strokeStyle = new Color().alpha(0.0).toRGBA();
    context.stroke();
  }
}

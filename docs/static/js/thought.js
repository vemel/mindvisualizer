import { easeInOutQuad, lerp, divideNorm } from "./vectors.js";
import Color from "./color.js";
export default class Thought {
    constructor({ position, speed }) {
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
    getTravelSeconds() {
        const distance = this.start.distance(this.end);
        return Math.max(distance / this.speed);
    }
    getEnded() {
        return new Date(this.started.getTime() + this.getTravelSeconds() * 1000);
    }
    getAlpha() {
        const dieMod = this.died
            ? lerp(1.0, 0.0, easeInOutQuad(this.getDieLerpT()))
            : 1.0;
        const size = 0.4 +
            Math.sin((Date.now() - this.created.getTime()) / 500 + this.random * 6) *
                0.2;
        return size * dieMod;
    }
    getDieLerpT() {
        return 1.0 - divideNorm(this.died.getTime() - Date.now(), 500.0);
    }
    getRadius() {
        const bornMod = Math.min((Date.now() - this.created.getTime()) / 1000, 1.0);
        const dieMod = this.died
            ? lerp(1.0, 0.2, easeInOutQuad(this.getDieLerpT()))
            : 1.0;
        const size = 6.0 +
            Math.sin((Date.now() - this.created.getTime()) / 1000 + this.random * 6) *
                2.0;
        return bornMod * dieMod * size;
    }
    die() {
        this.died = new Date(Date.now() + 500 + Math.random() * 2000);
    }
    getColor() {
        if (!this.startColor)
            return new Color().random();
        if (!this.endColor)
            return this.startColor.alpha(this.startColor.a * this.getAlpha());
        const t = divideNorm(this.getElapsedSeconds(), this.getTravelSeconds());
        const color = this.startColor.lerp(this.endColor, t);
        return color.alpha(color.a * this.getAlpha());
    }
    move({ coords, color, delay, }) {
        this.start = this.position;
        this.end = coords;
        this.started = new Date(Date.now() + delay * 1000);
        this.startColor = this.endColor;
        this.ended = this.getEnded();
        this.endColor = color;
        if (!this.startColor)
            this.startColor = this.endColor;
    }
    isDying() {
        return this.died ? true : false;
    }
    isDead() {
        const now = new Date();
        return this.died && this.died < now;
    }
    getElapsedSeconds() {
        return (Date.now() - this.started.getTime()) / 1000;
    }
    update() {
        if (!this.end)
            return;
        if (this.isDead())
            return;
        const now = new Date();
        const totalSeconds = this.getTravelSeconds();
        const elapsed = this.getElapsedSeconds();
        if (now > this.ended) {
            this.position = this.end;
            return;
        }
        const ease = easeInOutQuad(divideNorm(elapsed, totalSeconds));
        const bezierStart = this.start.lerp(this.start.rotate(this.end, this.angle), ease);
        const bezierEnd = this.end.lerp(this.end.rotate(this.start, -this.angle), 1.0 - ease);
        this.position = bezierStart.lerp(bezierEnd, ease);
    }
    draw(context) {
        if (this.isDead())
            return;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.getRadius(), 0, 2 * Math.PI, false);
        context.fillStyle = this.getColor().toRGBA();
        context.fill();
        context.lineWidth = 0;
        context.strokeStyle = new Color().alpha(0.0).toRGBA();
        context.stroke();
    }
}

import { easeInOutQuad, lerp, divideNorm } from "./vectors.js";
import Color from "./color.js";
export default class Thought {
    constructor(position, speed) {
        this.position = position;
        this.start = {
            coords: position,
            color: new Color().random()
        };
        this.end = {
            coords: position,
            color: new Color().random()
        };
        this.random = Math.random();
        this.angle = (Math.random() - 0.5) * 2 * Math.PI;
        this.speed = speed;
        this.created = new Date();
        this.died = null;
        this.started = null;
        this.ended = null;
    }
    getTravelSeconds() {
        const distance = this.start.coords.distance(this.end.coords);
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
        const t = divideNorm(this.getElapsedSeconds(), this.getTravelSeconds());
        const color = this.start.color.lerp(this.end.color, t);
        return color.alpha(color.a * this.getAlpha());
    }
    move({ coords, color, delay, }) {
        this.start.coords = this.position;
        this.end.coords = coords;
        this.started = new Date(Date.now() + delay * 1000);
        this.start.color = this.end.color;
        this.ended = this.getEnded();
        this.end.color = color;
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
            this.position = this.end.coords;
            return;
        }
        const ease = easeInOutQuad(divideNorm(elapsed, totalSeconds));
        const bezierStart = this.start.coords.lerp(this.start.coords.rotate(this.end.coords, this.angle).scale(1.5, this.start.coords), ease);
        const bezierEnd = this.end.coords.lerp(this.end.coords.rotate(this.start.coords, -this.angle).scale(1.5, this.start.coords), 1.0 - ease);
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

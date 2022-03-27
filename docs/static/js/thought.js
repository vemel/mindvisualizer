import { easeInOutQuad, lerp, divideNorm } from './utils.js';
import Color from './color.js';
import Timer from './timer.js';
export default class Thought extends Timer {
    constructor(position, speed) {
        super(true);
        this.position = position;
        this.start = {
            coords: position,
            color: new Color().random(),
        };
        this.end = {
            coords: position,
            color: new Color().random(),
        };
        this.random = Math.random();
        this.angle = (this.random - 0.5) * 2 * Math.PI;
        this.speed = 15.0 + this.random * 10.0;
        this.timers.set('started', new Timer(false));
        this.timers.set('died', new Timer(false));
        this.timers.set('ended', new Timer(false));
    }
    getTravelSeconds() {
        const distance = this.start.coords.distance(this.end.coords);
        return Math.max(distance / this.speed);
    }
    getEnded() {
        return this.getTimer('started').value + this.getTravelSeconds();
    }
    getAlpha() {
        const dieMod = lerp(1.0, 0.0, easeInOutQuad(this.getDieLerpT()));
        const size = 0.4 + Math.sin(this.value / 4 + this.random * 6) * 0.2;
        return size * dieMod;
    }
    getDieLerpT() {
        return divideNorm(this.getTimer('died').value, 2.0);
    }
    getRadius() {
        const bornMod = Math.min(this.value, 1.0);
        const dieMod = lerp(1.0, 0.2, easeInOutQuad(this.getDieLerpT()));
        const size = 6.0 + Math.sin(this.value + this.random * 6) * 2.0;
        return bornMod * dieMod * size;
    }
    die() {
        this.getTimer('died').startTimer(this.random * 2.0);
    }
    getColor() {
        const t = divideNorm(this.getElapsedSeconds(), this.getTravelSeconds());
        const color = this.start.color.lerp(this.end.color, t);
        return color.alpha(color.a * this.getAlpha());
    }
    move({ coords, color, delay, }) {
        this.start.coords = this.position;
        this.end.coords = coords;
        this.start.color = this.end.color;
        this.getTimer('started').startTimer(delay);
        this.getTimer('ended').stopTimer();
        this.end.color = color;
    }
    isDying() {
        return this.getTimer('died').isStarted();
    }
    isDead() {
        return this.getDieLerpT() > 0.999;
    }
    getElapsedSeconds() {
        return this.getTimer('started').value;
    }
    update(dt) {
        if (!super.update(dt))
            return false;
        if (!this.end)
            return false;
        if (this.isDead())
            return false;
        const totalSeconds = this.getTravelSeconds();
        const elapsed = this.getElapsedSeconds();
        if (this.getTimer('started').value > this.getTravelSeconds()) {
            this.position = this.end.coords;
            if (!this.getTimer('ended').isStarted())
                this.getTimer('ended').startTimer();
            return true;
        }
        const ease = easeInOutQuad(divideNorm(elapsed, totalSeconds));
        const bezierStart = this.start.coords.lerp(this.start.coords
            .rotate(this.end.coords, this.angle)
            .scaleTo(1.5, this.start.coords), ease);
        const bezierEnd = this.end.coords.lerp(this.end.coords
            .rotate(this.start.coords, -this.angle)
            .scaleTo(1.5, this.start.coords), 1.0 - ease);
        this.position = bezierStart.lerp(bezierEnd, ease);
        return true;
    }
    draw(context) {
        if (this.isDead())
            return;
        context.save();
        context.beginPath();
        context.translate(this.position.x, this.position.y);
        context.moveTo(0, 0);
        context.arc(0, 0, this.getRadius(), 0, 2 * Math.PI, false);
        context.fillStyle = this.getColor().toRGBA();
        context.strokeStyle = new Color().alpha(0.0).toRGBA();
        context.stroke();
        context.fill();
        context.restore();
    }
}

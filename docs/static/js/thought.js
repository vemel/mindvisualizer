import * as vectors from './vectors.js'


export default class Thought {
    constructor({
        position,
        frontCanvas,
        speed
    }) {
        this.frontCanvas = frontCanvas
        this.position = position
        this.start = position
        this.context = frontCanvas.context
        this.random = Math.random()
        this.angle = ((Math.random() > 0.5) ? 1 : -1) * (Math.random() * 0.5 + 0.25) * Math.PI
        this.speed = speed
        this.created = new Date()
        this.died = null

        this.startColor = null
        this.started = null
        this.end = null
        this.ended = null
        this.endColor = null
        this.rearranged = null

        this.disturb()
    }

    getTravelSeconds() {
        const distance = vectors.distance(this.start, this.end)
        return Math.max(distance / this.speed)
    }

    getEnded() {
        return new Date(this.started.getTime() + this.getTravelSeconds() * 1000)
    }

    getAlpha() {
        const now = new Date()
        const dieMod = this.died ? vectors.lerp(1.0, 0.0, vectors.Easing.easeInOutQuad(this.getDieLerpT())) : 1.0
        const size = 0.4 + Math.sin((now - this.created) / 500 + this.random * 6) * 0.2
        return size * dieMod
    }

    getNewRearranged() {
        return new Date(this.ended.getTime() + Math.floor((Math.random() * 120) * 1000))
    }

    getDieLerpT() {
        const now = new Date()
        return 1.0 - Math.min(1.0, (this.died - now) / 500);
    }

    getRadius() {
        const now = new Date()
        const bornMod = Math.min((now - this.created) / 1000, 1.0)
        const dieMod = this.died ? vectors.lerp(1.0, 0.2, vectors.Easing.easeInOutQuad(this.getDieLerpT())) : 1.0
        const size = 6.0 + Math.sin((now - this.created) / 1000 + this.random * 6) * 2.0;
        return bornMod * dieMod * size
    }

    die() {
        this.died = new Date(Date.now() + 500 + Math.random() * 2000)
    }

    getColor() {
        if (!this.endColor) return this.startColor;
        const t = vectors.normalize10(this.getElapsedSeconds() / this.getTravelSeconds())
        return vectors.lerpV3(this.startColor, this.endColor, t)
    }

    disturb() {
        this.start = this.position
        this.end = this.frontCanvas.pickRandomCoords()
        this.started = new Date()
        this.startColor = this.endColor
        this.ended = this.getEnded()
        this.endColor = this.frontCanvas.getCoordsColor(this.end)
        if (!this.startColor) this.startColor = this.endColor
        this.rearranged = this.getNewRearranged()
    }

    isDying() {
        return this.died ? true : false
    }

    isDead() {
        const now = new Date()
        return this.died && this.died < now
    }

    disturbDelayed() {
        this.rearranged = new Date(Date.now() + 1000 * Math.random() / this.speed)
    }

    getElapsedSeconds() {
        return (new Date() - this.started) / 1000
    }

    update() {
        if (!this.end) {
            console.log('no end')
            return
        }
        if (this.isDead()) return
        const now = new Date()
        const totalSeconds = this.getTravelSeconds()
        const elapsed = this.getElapsedSeconds()
        if (now > this.rearranged) {
            // console.log(now, this.changeEnd)
            this.disturb()
            return
        }
        if (now > this.ended) {
            // this.end = this.pickRandomCoords()
            // this.started = new Date()
            this.position = this.end;
            // console.log('reached')
            return
        }
        const ease = vectors.Easing.easeInOutQuad(elapsed / totalSeconds)
        const bezierStart = vectors.lerpV2(this.start, vectors.rotate(this.start, this.end, this.angle), ease)
        const bezierEnd = vectors.lerpV2(this.end, vectors.rotate(this.end, this.start, -this.angle), 1.0 - ease)
        this.position = vectors.lerpV2(bezierStart, bezierEnd, ease)
    }

    draw() {
        if (this.isDead()) return
        const context = this.context
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.getRadius(), 0, 2 * Math.PI, false);
        const color = this.getColor()
        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${this.getAlpha()})`;
        context.fill();
        context.lineWidth = 0;
        context.strokeStyle = 'rgba(0, 0, 0, 0.0)';
        context.stroke();
    }
}
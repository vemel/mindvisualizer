import * as vectors from "./vectors.js";
export default class Renderer {
    constructor({ texts, shuffle, random, backCanvas, frontCanvas, speed, }) {
        this.created = new Date();
        this.lastUpdate = null;
        this.texts = texts;
        this.shuffle = shuffle;
        this.random = random;
        this.textIndex = 0;
        this.backCanvas = backCanvas;
        this.frontCanvas = frontCanvas;
        this.speed = speed;
    }
    getUpdateInterval() {
        return (1000 * 60 * 1.5) / this.speed;
    }
    shouldUpdate() {
        if (!this.lastUpdate)
            return true;
        if (!this.shuffle)
            return false;
        return Date.now() - this.lastUpdate.getTime() > this.getUpdateInterval();
    }
    updateCoords() {
        const text = this.random
            ? vectors.choice(this.texts)
            : this.texts[this.textIndex];
        this.textIndex = (this.textIndex + 1) % this.texts.length;
        this.backCanvas.clear();
        this.backCanvas.drawText(text);
        const coordsData = this.backCanvas.getCoords();
        this.frontCanvas.setCoordsData(coordsData);
    }
    update() {
        if (!this.shouldUpdate())
            return;
        this.lastUpdate = new Date();
        this.updateCoords();
    }
}

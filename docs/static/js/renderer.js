import { ShuffleIterator, OrderedIterator } from './iterators.js';
export default class Renderer {
    constructor({ texts, shuffle, backCanvas, frontCanvas, speed, }) {
        this.created = new Date();
        this.lastUpdate = null;
        this.texts = texts;
        this.shuffle = shuffle;
        this.backCanvas = backCanvas;
        this.frontCanvas = frontCanvas;
        this.speed = speed;
        this.iterator = this.shuffle
            ? new ShuffleIterator(this.texts)
            : new OrderedIterator(this.texts);
    }
    getUpdateInterval() {
        return (1000 * 60 * 1.5) / this.speed;
    }
    shouldUpdate() {
        if (!this.lastUpdate)
            return true;
        if (this.texts.length === 1)
            return false;
        return Date.now() - this.lastUpdate.getTime() > this.getUpdateInterval();
    }
    updateCoords() {
        const text = this.iterator.next();
        this.backCanvas.clear();
        this.backCanvas.drawText(text);
        const getCoordsWorker = this.backCanvas.getCoordsWorker();
        getCoordsWorker.onmessage = (event) => {
            const data = event.data;
            this.frontCanvas.setCoordsData(data);
        };
    }
    update() {
        if (!this.shouldUpdate())
            return;
        this.lastUpdate = new Date();
        this.updateCoords();
    }
}

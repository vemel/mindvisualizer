class OrderedIterator {
    constructor(items) {
        this.items = items;
        this.index = 0;
    }
    next() {
        const result = this.items[this.index];
        this.index = (this.index + 1) % this.items.length;
        return result;
    }
}
class ShuffleIterator extends OrderedIterator {
    constructor(items) {
        super(items);
        this.indexes = this.getShuffledIndexes();
    }
    getShuffledIndexes() {
        const result = Array.from(Array(this.items.length).keys());
        let currentIndex = result.length;
        let randomIndex = 0;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [result[currentIndex], result[randomIndex]] = [
                result[randomIndex],
                result[currentIndex],
            ];
        }
        return result;
    }
    next() {
        if (this.items.length === 1)
            return this.items[0];
        const itemIndex = this.indexes[this.index];
        this.index++;
        if (this.index >= this.indexes.length) {
            this.index = 0;
            this.indexes = this.getShuffledIndexes();
            if (this.indexes[0] === itemIndex) {
                const randomIndex = Math.floor(Math.random() * (this.indexes.length - 2)) + 2;
                this.indexes.splice(randomIndex, 0, itemIndex);
                this.indexes.splice(0, 1);
            }
        }
        return this.items[itemIndex];
    }
}
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

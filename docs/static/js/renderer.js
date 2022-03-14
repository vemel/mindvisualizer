import { ShuffleIterator, OrderedIterator } from './iterators.js';
import Timer from './timer.js';
export default class Renderer extends Timer {
    constructor({ texts, shuffle, backCanvas, frontCanvas, }) {
        super(true, 60 * 1.5);
        this.texts = texts;
        this.shuffle = shuffle;
        this.backCanvas = backCanvas;
        this.frontCanvas = frontCanvas;
        this.iterator = this.shuffle
            ? new ShuffleIterator(this.texts)
            : new OrderedIterator(this.texts);
    }
    next() {
        if (this.texts.length < 2)
            return;
        const text = this.iterator.next();
        this.backCanvas.clear();
        this.backCanvas.drawText(text);
        const getCoordsWorker = this.backCanvas.getCoordsWorker();
        getCoordsWorker.onmessage = (event) => {
            const data = event.data;
            this.frontCanvas.setCoordsData(data);
        };
    }
    updateOnInterval() {
        this.next();
    }
}

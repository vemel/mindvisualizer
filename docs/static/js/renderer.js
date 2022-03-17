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
        const lastText = this.iterator.last;
        const text = this.iterator.next();
        if (text === lastText)
            return;
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

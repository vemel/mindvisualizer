import { ShuffleIterator, OrderedIterator } from './iterators.js';
import Timer from './timer.js';
export default class Renderer extends Timer {
    constructor(options) {
        super(true, 60 * 1.5);
        this.options = options;
        this.iterator = options.shuffle
            ? new ShuffleIterator(options.texts)
            : new OrderedIterator(options.texts);
    }
    next() {
        const lastText = this.iterator.last;
        const text = this.iterator.next();
        if (text === lastText)
            return;
        this.options.backCanvas.clear();
        this.options.backCanvas.drawText(text);
        const getCoordsWorker = this.options.backCanvas.getCoordsWorker();
        getCoordsWorker.onmessage = (event) => {
            const data = event.data;
            this.options.frontCanvas.setCoordsData(data);
        };
    }
    updateOnInterval() {
        this.next();
    }
}

import { IRawCoordsData } from './interfaces.js'
import { ShuffleIterator, OrderedIterator } from './iterators.js'
import Options from './options.js'
import Timer from './timer.js'

export default class Renderer extends Timer {
  options: Options
  iterator: OrderedIterator<string>

  constructor(options: Options) {
    super(true, 60 * 1.5)
    this.options = options
    this.iterator = options.shuffle
      ? new ShuffleIterator(options.texts)
      : new OrderedIterator(options.texts)
  }

  next() {
    const lastText = this.iterator.last
    const text = this.iterator.next()
    if (text === lastText) return
    this.options.backCanvas.clear()
    this.options.backCanvas.drawText(text)
    const getCoordsWorker = this.options.backCanvas.getCoordsWorker()
    getCoordsWorker.onmessage = (event) => {
      const data = event.data as Array<IRawCoordsData>
      this.options.frontCanvas.setCoordsData(data)
    }
  }

  updateOnInterval(): void {
    this.next()
  }
}

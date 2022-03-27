import { IRawCoordsData } from './interfaces.js'
import { ShuffleIterator, OrderedIterator } from './iterators.js'
import Options from './options.js'
import Timer from './timer.js'

export default class Renderer extends Timer {
  options: Options
  private iterators: Map<boolean, OrderedIterator<string>>

  constructor(options: Options) {
    super(true, 60 * 1.5)
    this.options = options
    this.iterators = new Map([
      [true, new ShuffleIterator(options.texts)],
      [false, new OrderedIterator(options.texts)],
    ])
  }

  get iterator(): OrderedIterator<string> {
    return this.iterators.get(this.options.params.shuffle.get())
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

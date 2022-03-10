import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import { IRawCoordsData } from './interfaces.js'
import { ShuffleIterator, OrderedIterator } from './iterators.js'
import Timer from './timer.js'

export default class Renderer extends Timer {
  texts: Array<string>
  shuffle: boolean
  backCanvas: BackCanvas
  frontCanvas: FrontCanvas
  iterator: OrderedIterator<string>

  constructor({
    texts,
    shuffle,
    backCanvas,
    frontCanvas,
  }: {
    texts: Array<string>
    shuffle: boolean
    backCanvas: BackCanvas
    frontCanvas: FrontCanvas
  }) {
    super(true, 60 * 1.5)
    this.texts = texts
    this.shuffle = shuffle
    this.backCanvas = backCanvas
    this.frontCanvas = frontCanvas
    this.iterator = this.shuffle
      ? new ShuffleIterator(this.texts)
      : new OrderedIterator(this.texts)
  }

  updateOnInterval(): void {
    const text = this.iterator.next()
    this.backCanvas.clear()
    this.backCanvas.drawText(text)
    const getCoordsWorker = this.backCanvas.getCoordsWorker()
    getCoordsWorker.onmessage = (event) => {
      const data = event.data as Array<IRawCoordsData>
      this.frontCanvas.setCoordsData(data)
    }
  }
}

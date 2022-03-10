import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import { IRawCoordsData } from './interfaces.js'
import { ShuffleIterator, OrderedIterator } from './iterators.js'

export default class Renderer {
  created: Date
  lastUpdate: Date | null
  texts: Array<string>
  shuffle: boolean
  backCanvas: BackCanvas
  frontCanvas: FrontCanvas
  speed: number
  iterator: OrderedIterator<string>

  constructor({
    texts,
    shuffle,
    backCanvas,
    frontCanvas,
    speed,
  }: {
    texts: Array<string>
    shuffle: boolean
    backCanvas: BackCanvas
    frontCanvas: FrontCanvas
    speed: number
  }) {
    this.created = new Date()
    this.lastUpdate = null
    this.texts = texts
    this.shuffle = shuffle
    this.backCanvas = backCanvas
    this.frontCanvas = frontCanvas
    this.speed = speed
    this.iterator = this.shuffle
      ? new ShuffleIterator(this.texts)
      : new OrderedIterator(this.texts)
  }

  getUpdateInterval(): number {
    return (1000 * 60 * 1.5) / this.speed
  }

  shouldUpdate(): boolean {
    if (!this.lastUpdate) return true
    if (this.texts.length === 1) return false
    return Date.now() - this.lastUpdate.getTime() > this.getUpdateInterval()
  }

  updateCoords(): void {
    const text = this.iterator.next()
    this.backCanvas.clear()
    this.backCanvas.drawText(text)
    const getCoordsWorker = this.backCanvas.getCoordsWorker()
    getCoordsWorker.onmessage = (event) => {
      const data = event.data as Array<IRawCoordsData>
      this.frontCanvas.setCoordsData(data)
    }
  }

  update(): void {
    if (!this.shouldUpdate()) return
    this.lastUpdate = new Date()
    this.updateCoords()
  }
}

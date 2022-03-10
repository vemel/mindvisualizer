import { randInt, sum } from './utils.js'

export default class BackCanvas {
  font = 'Ubuntu'
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  lineHeight: number = 1.2

  constructor() {
    this.canvas = <HTMLCanvasElement>document.getElementById('back')
    this.context = this.canvas.getContext('2d')
  }

  init(): void {
    this.canvas.height =
      (window.innerHeight * this.canvas.width) / window.innerWidth
  }

  getLineHeights(lineMeasures: Array<TextMetrics>): Array<number> {
    return lineMeasures.map((lineMeasure, index) => {
      const height =
        lineMeasure.actualBoundingBoxAscent +
        lineMeasure.actualBoundingBoxDescent
      return (index > 0 ? this.lineHeight : 1.0) * height
    })
  }

  getFontSize(lines: Array<string>): number {
    let fontSize = 200
    while (fontSize > 23) {
      this.context.font = `bold ${fontSize}px ${this.font}`
      const lineMeasures = lines.map((line) => this.context.measureText(line))
      const lineFitsHor = lineMeasures.every(
        (lineMeasure) => lineMeasure.width < this.canvas.width * 0.95
      )
      const totalHeight = sum(this.getLineHeights(lineMeasures))
      const lineFitsVer = totalHeight < this.canvas.height * 0.8
      if (lineFitsHor && lineFitsVer) break
      fontSize -= 2
    }
    return fontSize
  }

  getTextGradient(): CanvasGradient {
    const gradient = this.context.createLinearGradient(
      0,
      randInt(0, this.canvas.height),
      this.canvas.width,
      randInt(0, this.canvas.height)
    )
    gradient.addColorStop(0, `hsl(${randInt(0, 255)}, 100%, 50%)`)
    gradient.addColorStop(0.4, `hsl(${randInt(0, 255)}, 100%, 50%)`)
    gradient.addColorStop(0.5, `hsl(${randInt(0, 255)}, 100%, 50%)`)
    gradient.addColorStop(0.6, `hsl(${randInt(0, 255)}, 100%, 50%)`)
    gradient.addColorStop(1, `hsl(${randInt(0, 255)}, 100%, 50%)`)
    return gradient
  }

  drawText(text: string): void {
    this.context.textAlign = 'center'
    const lines = text.split(',')
    console.log('Rendering', lines)
    this.context.fillStyle = this.getTextGradient()
    this.context.font = `bold ${this.getFontSize(lines)}px ${this.font}`
    const lineMeasures = lines.map((line) => this.context.measureText(line))
    const lineHeights = this.getLineHeights(lineMeasures)

    lines.forEach((line, index) => {
      const lineMeasure = lineMeasures[index]
      const lineHeight = lineHeights[index]
      const lineOffset = lineHeight - lineMeasure.actualBoundingBoxDescent
      const y =
        this.canvas.height / 2 +
        lineOffset -
        sum(lineHeights) / 2 +
        sum(lineHeights.slice(0, index))
      this.context.fillText(line, this.canvas.width / 2, y)
    })
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  getCoordsWorker(): Worker {
    const canvas = <HTMLCanvasElement>document.getElementById('back')
    const context = canvas.getContext('2d')
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const worker = new Worker('static/js/getCoordsWorker.js')
    worker.postMessage({
      imageData,
      width: this.canvas.width,
      height: this.canvas.height,
    })
    return worker
  }

  registerEventListeners(): void {
    window.addEventListener('resize', () => {
      this.canvas.height =
        (window.innerHeight * this.canvas.width) / window.innerWidth
    })
  }
}

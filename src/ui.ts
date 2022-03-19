import Options from './options.js'
import Timer from './timer.js'
import UIControl from './uiControl.js'
import { sum } from './utils.js'

export default class UI extends Timer {
  readonly title: HTMLTitleElement
  readonly controls: HTMLDivElement
  readonly speed: UIControl
  readonly maxThoughts: UIControl
  readonly fps: HTMLDivElement
  readonly options: Options
  private dts: Array<number>
  constructor(options: Options) {
    super(true, 1.0)
    this.title = document.getElementById('title') as HTMLTitleElement
    this.controls = document.getElementById('controls') as HTMLDivElement
    this.speed = new UIControl(
      document.getElementById('speed') as HTMLInputElement
    )
    this.maxThoughts = new UIControl(
      document.getElementById('maxThoughts') as HTMLInputElement
    )
    this.fps = document.getElementById('fps') as HTMLDivElement
    this.options = options
    this.dts = []
  }

  get show(): boolean {
    return !this.options.hideUI
  }

  showUI(): void {
    this.title.classList.remove('hidden')
    this.controls.classList.remove('hidden')
    this.speed.set(this.options.speed.toString())
    this.maxThoughts.set(this.options.maxThoughts.toString())
  }

  registerEventListeners(): void {
    this.controls.querySelector('.reset').addEventListener('click', () => {
      this.options.frontCanvas.thoughts.forEach((thought) => thought.die())
    })
    this.controls.querySelector('.next').addEventListener('click', () => {
      if (this.options.renderer) this.options.renderer.next()
    })
    this.speed.registerEventListeners(
      (value) => (this.options.speed = Number(value))
    )
    this.maxThoughts.registerEventListeners(
      (value) => (this.options.maxThoughts = Number(value))
    )
  }

  update(dt: number): boolean {
    this.dts = [...this.dts.slice(-50), dt]
    return super.update(dt)
  }

  updateOnInterval(): void {
    if (!this.show) return
    const titleClassList = this.title.classList
    if (
      this.options.frontCanvas.thoughts.length >= 1000 &&
      !titleClassList.contains('glitch')
    ) {
      titleClassList.add('glitch')
      titleClassList.add('layers')
    }
    if (
      this.options.frontCanvas.thoughts.length < 1000 &&
      titleClassList.contains('glitch')
    ) {
      titleClassList.remove('glitch')
      titleClassList.remove('layers')
    }
    const avgDt = sum(this.dts) / this.dts.length
    this.fps.innerText = (1.0 / avgDt).toFixed(0)
  }
}

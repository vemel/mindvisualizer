import FrontCanvas from './frontCanvas.js'
import { IOptions } from './interfaces.js'

export default class UI {
  readonly title: HTMLTitleElement
  readonly controls: HTMLDivElement
  readonly speed: HTMLInputElement
  readonly frontCanvas: FrontCanvas
  readonly options: IOptions
  readonly show: boolean
  constructor(options: IOptions, frontCanvas: FrontCanvas) {
    this.title = document.getElementById('title') as HTMLTitleElement
    this.controls = document.getElementById('controls') as HTMLDivElement
    this.speed = document.getElementById('speed') as HTMLInputElement
    this.frontCanvas = frontCanvas
    this.options = options
  }

  showUI(): void {
    this.title.classList.remove('hidden')
    this.controls.classList.remove('hidden')
    this.speed.value = this.options.speed.toString()
  }

  registerEventListeners(): void {
    this.controls.querySelector('.reset').addEventListener('click', () => {
      this.frontCanvas.thoughts.forEach((thought) => thought.die())
    })
    this.controls.querySelector('.next').addEventListener('click', () => {
      if (this.options.renderer) this.options.renderer.next()
    })
    this.speed.addEventListener('input', () => {
      this.options.speed = Number(this.speed.value)
    })
  }

  update(): void {
    if (!this.show) return
    const titleClassList = this.title.classList
    if (
      this.frontCanvas.thoughts.length >= 1000 &&
      !titleClassList.contains('glitch')
    ) {
      titleClassList.add('glitch')
      titleClassList.add('layers')
    }
    if (
      this.frontCanvas.thoughts.length < 1000 &&
      titleClassList.contains('glitch')
    ) {
      titleClassList.remove('glitch')
      titleClassList.remove('layers')
    }
  }
}

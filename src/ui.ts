import Options from './options.js'
import Timer from './timer.js'
import UIInput from './controls/uiSlider.js'
import UICheckbox from './controls/uiCheckbox.js'
import { sum } from './utils.js'
import { IUIInputs } from './interfaces.js'

export default class UI extends Timer {
  readonly title: HTMLTitleElement
  readonly controls: HTMLDivElement
  readonly inputs: IUIInputs
  readonly fps: HTMLDivElement
  readonly options: Options
  private dts: Array<number>
  constructor(options: Options) {
    super(true, 1.0)
    this.title = document.getElementById('title') as HTMLTitleElement
    this.controls = document.getElementById('controls') as HTMLDivElement
    this.inputs = {
      speed: new UIInput(document.getElementById('speed') as HTMLInputElement),
      maxThoughts: new UIInput(
        document.getElementById('maxThoughts') as HTMLInputElement
      ),
      demo: new UICheckbox(
        document.getElementById('demoControl') as HTMLInputElement
      ),
      shuffle: new UICheckbox(
        document.getElementById('shuffleControl') as HTMLInputElement
      ),
    }
    this.fps = document.getElementById('fps') as HTMLDivElement
    this.options = options
    this.dts = []
    if (this.show) this.showUI()
  }

  get show(): boolean {
    return !this.options.params.hideUI.get()
  }

  showUI(): void {
    this.title.classList.remove('hidden')
    this.controls.classList.remove('hidden')
    Object.entries(this.inputs).forEach(([key, input]) => {
      input.set(this.options.params[key].get())
    })
  }

  registerEventListeners(): void {
    this.controls.querySelector('.reset').addEventListener('click', () => {
      this.options.frontCanvas.thoughts.forEach((thought) => thought.die())
    })
    this.controls.querySelector('.next').addEventListener('click', () => {
      if (this.options.renderer) this.options.renderer.next()
    })
    Object.entries(this.inputs).forEach(([key, input]) => {
      input.registerEventListeners((value) => {
        this.options.params[key].set(value)
        this.options.saveToLocalStorage()
      })
    })
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

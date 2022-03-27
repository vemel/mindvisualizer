import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import TEXTS from './texts.js'
import { IOptionsState, IParameters } from './interfaces.js'
import {
  BooleanParameter,
  NumberParameter,
  Parameter,
  TextsParameter,
} from './parameters.js'

export default class Options {
  params: IParameters
  renderer: Renderer | null
  frontCanvas: FrontCanvas | null
  backCanvas: BackCanvas | null
  readonly localStorageKey = 'mindvisualizer'

  constructor() {
    this.params = {
      textQuery: new TextsParameter('textQuery', 'emoji'),
      maxThoughts: new NumberParameter('maxThoughts', 2500),
      speed: new NumberParameter('speed', 2.0),
      shuffle: new BooleanParameter('shuffle', false),
      demo: new BooleanParameter('demo', false),
      hideUI: new BooleanParameter('hideUI', false),
    }
    this.renderer = null
    this.frontCanvas = null
    this.backCanvas = null
  }

  updateFromLocalStorage(): void {
    const stateStr = localStorage.getItem(this.localStorageKey)
    if (!stateStr) return
    const state = JSON.parse(stateStr) as IOptionsState
    Object.values(this.params).forEach((x) => x.setFromState(state))
  }

  saveToLocalStorage(): void {
    const state = Object.fromEntries(
      Object.values(this.params).map((x) => [x.key, x.get()])
    )
    localStorage.setItem(this.localStorageKey, JSON.stringify(state))
  }

  toObject(): IOptionsState {
    return Object.fromEntries(
      Object.values(this.params).map((x) => [x.key, x.get()])
    )
  }

  set(state: IOptionsState): void {
    Object.values(this.params).forEach((x: Parameter<any>) =>
      x.setFromState(state)
    )
    this.saveToLocalStorage()
  }

  updateFromQuery() {
    const params = new URLSearchParams(window.location.search)
    Object.values(this.params).forEach((x: Parameter<any>) =>
      x.setFromURL(params)
    )
  }

  get texts(): Array<string> {
    const textQuery = this.params.textQuery.get()
    if (Object.keys(TEXTS).includes(textQuery)) {
      return TEXTS[textQuery].map((x: string) => x.toUpperCase())
    }
    return textQuery.split('.').map((x) => x.toUpperCase())
  }
}

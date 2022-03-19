import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import TEXTS from './texts.js'
import { IOptionsState } from './interfaces.js'

export default class Options {
  maxThoughts: number
  speed: number
  shuffle: boolean
  demo: boolean
  hideUI: boolean
  textsQuery: string
  renderer: Renderer | null
  frontCanvas: FrontCanvas | null
  backCanvas: BackCanvas | null
  readonly localStorageKey = 'mindvisualizer'

  constructor() {
    this.textsQuery = 'emoji'
    this.maxThoughts = 2500
    this.speed = 2.0
    this.shuffle = true
    this.demo = false
    this.hideUI = false
    this.renderer = null
    this.frontCanvas = null
    this.backCanvas = null
  }

  updateFromLocalStorage(): void {
    const stateStr = localStorage.getItem(this.localStorageKey)
    if (!stateStr) return
    const state = JSON.parse(stateStr) as IOptionsState
    this.fromObject(state)
  }

  saveToLocalStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.toObject()))
  }

  toObject(): IOptionsState {
    return {
      maxThoughts: this.maxThoughts,
      demo: this.demo,
      speed: this.speed,
      shuffle: this.shuffle,
      textsQuery: this.textsQuery,
      hideUI: this.hideUI,
    }
  }

  fromObject(state: IOptionsState): void {
    if (state.demo !== undefined) this.demo = state.demo
    if (state.speed !== undefined) this.speed = state.speed
    if (state.shuffle !== undefined) this.shuffle = state.shuffle
    if (state.textsQuery !== undefined) this.textsQuery = state.textsQuery
    if (state.hideUI !== undefined) this.hideUI = state.hideUI
    if (state.maxThoughts !== undefined) this.maxThoughts = state.maxThoughts
  }

  set(state: IOptionsState): void {
    this.fromObject(state)
    this.saveToLocalStorage()
  }

  updateFromQuery() {
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo')) this.demo = params.get('demo') === 'true'
    if (params.get('speed')) this.speed = Number(params.get('speed'))
    if (params.get('shuffle')) this.shuffle = params.get('shuffle') === 'true'
    if (params.get('ui')) this.hideUI = params.get('ui') === 'false'
    if (params.get('max')) this.maxThoughts = Number(params.get('maxThoughts'))
    if (params.get('q')) {
      const encoded = window.btoa(unescape(encodeURIComponent(params.get('q'))))
      console.log(`bq=${encoded}`)
      this.textsQuery = params.get('q')
    }
    if (params.get('bq')) {
      const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))))
      this.textsQuery = decoded
    }
  }

  get texts(): Array<string> {
    if (Object.keys(TEXTS).includes(this.textsQuery)) {
      return TEXTS[this.textsQuery].map((x: string) => x.toUpperCase())
    }
    return this.textsQuery.split('.').map((x) => x.toUpperCase())
  }
}

import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import TEXTS from './texts.js'

export default class Options {
  maxThoughts: number
  speed: number
  shuffle: boolean
  demo: boolean
  hideUI: boolean
  texts: Array<string>
  renderer: Renderer | null
  frontCanvas: FrontCanvas | null
  backCanvas: BackCanvas | null

  constructor() {
    this.texts = TEXTS.emoji
    this.maxThoughts = 2500
    this.speed = 2.0
    this.shuffle = true
    this.demo = false
    this.hideUI = false
    this.renderer = null
    this.frontCanvas = null
    this.backCanvas = null
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
      this.texts = this.getTexts(params.get('q'))
    }
    if (params.get('bq')) {
      const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))))
      this.texts = this.getTexts(decoded)
    }
  }

  private getTexts(queryString: string) {
    if (Object.keys(TEXTS).includes(queryString)) {
      return TEXTS[queryString].map((x: string) => x.toUpperCase())
    }
    return queryString.split('.').map((x) => x.toUpperCase())
  }
}

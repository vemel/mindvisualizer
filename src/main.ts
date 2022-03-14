import TEXTS from './texts.js'
import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import UI from './ui.js'
import { IOptions } from './interfaces.js'

function getTexts() {
  const params = new URLSearchParams(window.location.search)
  let result = ''
  if (params.get('q')) {
    const encoded = window.btoa(unescape(encodeURIComponent(params.get('q'))))
    console.log(`bq=${encoded}`)
    result = params.get('q')
  }
  if (params.get('bq')) {
    const decoded = decodeURIComponent(escape(window.atob(params.get('bq'))))
    result = decoded
  }
  if (!result.length) {
    return TEXTS.emoji
  }
  if (Object.keys(TEXTS).includes(result)) {
    return TEXTS[result].map((x) => x.toUpperCase())
  }
  return result.split('.').map((x) => x.toUpperCase())
}

function updateOptions(options: IOptions) {
  const params = new URLSearchParams(window.location.search)
  if (params.get('demo')) options.demo = params.get('demo') === 'true'
  if (params.get('speed')) options.speed = Number(params.get('speed'))
  if (params.get('shuffle')) options.shuffle = params.get('shuffle') === 'true'
  if (params.get('ui')) options.hideUI = params.get('ui') === 'false'
}

function loadFonts() {
  const WebFont = (window as any).WebFont
  WebFont.load({
    google: {
      families: ['Ubuntu'],
    },
  })
}

const main = () => {
  loadFonts()
  const options: IOptions = {
    maxThoughts: 2500,
    speed: 2.0,
    shuffle: true,
    demo: false,
    hideUI: false,
    text: '',
    renderer: null,
  }
  updateOptions(options)

  const backCanvas = new BackCanvas()
  backCanvas.init()
  backCanvas.registerEventListeners()

  const frontCanvas = new FrontCanvas()
  frontCanvas.init()
  frontCanvas.registerEventListeners()

  const renderer = new Renderer({
    frontCanvas,
    backCanvas,
    shuffle: options.shuffle,
    texts: getTexts(),
  })

  options.renderer = renderer

  const ui = new UI(options, frontCanvas)
  if (!options.hideUI) ui.showUI()
  ui.registerEventListeners()

  let started = Date.now()
  setInterval(() => {
    const now = Date.now()
    const dt = ((now - started) / 1000) * options.speed
    started = now
    renderer.update(dt)
    frontCanvas.update(dt)
    if (options.demo) frontCanvas.updateDemo()
    ui.update()
  }, 10)
}

window.onload = () => {
  main()
}

import TEXTS from './texts.js'
import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import UI from './ui.js'
import Options from './options.js'

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
  const options = new Options()
  options.updateFromQuery()

  const backCanvas = new BackCanvas()
  backCanvas.init()
  backCanvas.registerEventListeners()

  const frontCanvas = new FrontCanvas()
  frontCanvas.init()
  frontCanvas.registerEventListeners()

  options.frontCanvas = frontCanvas
  options.backCanvas = backCanvas

  const renderer = new Renderer(options)

  options.renderer = renderer

  const ui = new UI(options)
  if (!options.hideUI) ui.showUI()
  ui.registerEventListeners()

  let started = Date.now()
  setInterval(() => {
    const now = Date.now()
    const secondsPassed = (now - started) / 1000
    const dt = secondsPassed * options.speed
    started = now
    renderer.update(dt)
    frontCanvas.update(dt)
    if (options.demo) frontCanvas.updateDemo()
    ui.update(secondsPassed)
  }, 10)
}

window.onload = () => {
  main()
}

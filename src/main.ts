import TEXTS from './texts.js'
import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import UI from './ui.js'
import Options from './options.js'

declare global {
  interface Window {
    options: Options
    requestAnimationFrame: () => null
  }
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
  const options = new Options()
  window.options = options
  options.updateFromLocalStorage()
  options.updateFromQuery()
  options.saveToLocalStorage()

  const backCanvas = new BackCanvas()
  backCanvas.init()
  backCanvas.registerEventListeners()

  const frontCanvas = new FrontCanvas(options)
  frontCanvas.init()
  frontCanvas.registerEventListeners()

  options.frontCanvas = frontCanvas
  options.backCanvas = backCanvas

  const renderer = new Renderer(options)

  options.renderer = renderer

  const ui = new UI(options)
  ui.registerEventListeners()

  let started = Date.now()

  const update = () => {
    const now = Date.now()
    const secondsPassed = (now - started) / 1000
    const dt = secondsPassed * options.params.speed.get()
    started = now
    renderer.update(dt)
    frontCanvas.update(dt)
    ui.update(secondsPassed)
    frontCanvas.drawThoughts(dt)
    window.requestAnimationFrame(update)
  }

  window.requestAnimationFrame(update)
}

window.onload = () => {
  main()
}

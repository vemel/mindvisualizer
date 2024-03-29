import { choice, divideNorm } from './utils.js'
import Thought from './thought.js'
import Color from './color.js'
import Coords from './coords.js'
import Timer from './timer.js'
import Options from './options.js'
import { Renderer, Context2DRenderer } from './renderers.js'
import { ICoordsData, IClickEvent, IRawCoordsData } from './interfaces.js'

export default class FrontCanvas extends Timer {
  canvas: HTMLCanvasElement
  renderer: Renderer
  gl: WebGL2RenderingContext
  thoughts: Array<Thought>
  coordsData: Array<IRawCoordsData>
  emitterCoords: Map<string, Coords>
  options: Options

  constructor(options: Options) {
    super(true)
    this.canvas = <HTMLCanvasElement>document.getElementById('front')
    this.renderer = new Context2DRenderer(this.canvas)
    this.thoughts = []
    this.coordsData = []
    this.emitterCoords = new Map()
    this.options = options
    this.timers.set('coordsUpdated', new Timer(false))
  }

  init(): void {
    this.canvas.height =
      (window.innerHeight * this.canvas.width) / window.innerWidth

    this.renderer.init()
  }

  createThought(position: Coords): Thought {
    const thought = new Thought(position)
    this.thoughts.push(thought)
    this.moveThought(thought, 1.0)
    thought.start.color = thought.end.color
    return thought
  }

  getCursorPosition(event: IClickEvent): Coords {
    const rect = this.canvas.getBoundingClientRect()
    const x = Math.floor(
      ((event.clientX - rect.left) / window.innerWidth) * this.canvas.width
    )
    const y = Math.floor(
      ((event.clientY - rect.top) / window.innerHeight) * this.canvas.height
    )
    return new Coords(x, y)
  }

  generateThoughts({
    coords,
    chance,
    particles,
  }: {
    coords: Coords
    chance: number
    particles: number
  }): void {
    for (let i = 0; i < particles; i++) {
      if (Math.random() > chance) continue
      const radius = 30 * Math.random()
      const angle = 2 * Math.PI * Math.random()
      const position = new Coords(
        Math.floor(coords.x + radius * Math.sin(angle)),
        Math.floor(coords.y + radius * Math.cos(angle))
      )
      this.createThought(position)
    }
  }

  get maxThoughts(): number {
    return this.options.params.maxThoughts.get()
  }

  killOldest(): void {
    if (this.thoughts.length < this.maxThoughts) return
    this.thoughts
      .slice(0, this.thoughts.length - this.maxThoughts)
      .filter((thought) => !thought.isDying())
      .forEach((thought) => thought.die())
  }

  disturbThoughts(coords: Coords): void {
    const radius = 50.0
    this.thoughts.forEach((thought) => {
      if (thought.position.distance(coords) < radius) {
        this.moveThought(thought)
      }
    })
  }

  updateThought(thought: Thought, dt: number): void {
    if (thought.isDead()) {
      this.thoughts.splice(this.thoughts.indexOf(thought), 1)
      return
    }
    if (this.shouldMove(thought)) this.moveThought(thought, 5.0)
    thought.update(dt)
  }

  drawThoughts(dt: number): void {
    if (dt < 0.0001) return
    const alpha = Math.min(4.0 * dt, 1.0)
    const thoughtAlpha = Math.min(12.0 * dt, 1.0)
    this.renderer.clear(new Color(0, 0, 0, alpha))
    for (const thought of this.thoughts) {
      if (thought.isDead()) continue
      const color = thought.getColor()
      const drawColor = color.alpha(color.a * thoughtAlpha)
      this.renderer.drawCircle(thought.position, thought.getRadius(), drawColor)
    }
  }

  shouldMove(thought: Thought): boolean {
    const coordsUpdatedTimer = this.getTimer('coordsUpdated')
    if (
      thought.getTimer('started').value - coordsUpdatedTimer.value >
      thought.random * 60.0
    )
      return true
    if (thought.getTimer('ended').value > thought.random * 120) return true
    return false
  }

  update(dt: number): boolean {
    if (!super.update(dt)) return false
    this.killOldest()
    this.updateDemo()
    this.updateEmitters()
    for (const thought of this.thoughts) {
      this.updateThought(thought, dt)
    }
    return true
  }

  updateEmitters(): void {
    for (const coords of this.emitterCoords.values()) {
      this.generateThoughts({
        coords,
        chance: 0.2,
        particles: this.dt * 200,
      })
    }
  }

  scaleCoords(coords: Coords, newHeight: number, oldHeight: number): Coords {
    const yOffset = coords.y - oldHeight / 2
    return new Coords(coords.x, newHeight / 2 + yOffset)
  }

  registerEventListeners(): void {
    window.addEventListener('resize', () => {
      const newHeight =
        (window.innerHeight * this.canvas.width) / window.innerWidth
      const oldHeight = this.canvas.height
      this.thoughts.forEach((thought) => {
        thought.start.coords = this.scaleCoords(
          thought.start.coords,
          newHeight,
          oldHeight
        )
        thought.end.coords = this.scaleCoords(
          thought.end.coords,
          newHeight,
          oldHeight
        )
        thought.position = this.scaleCoords(
          thought.position,
          newHeight,
          oldHeight
        )
      })
      this.canvas.height = newHeight
    })
    this.canvas.addEventListener('mousedown', (event) => {
      const coords = this.getCursorPosition(event)
      this.disturbThoughts(coords)
      this.emitterCoords.set('mouse', coords)
    })
    this.canvas.addEventListener('mouseup', () => {
      this.emitterCoords.delete('mouse')
    })

    this.canvas.addEventListener('mousemove', (event) => {
      if (!this.emitterCoords.has('mouse')) return
      const coords = this.getCursorPosition(event)
      this.emitterCoords.set('mouse', coords)
    })

    this.canvas.addEventListener('touchstart', (event) => {
      for (const touchEvent of event.changedTouches) {
        const key = `touch${touchEvent.identifier}`
        const coords = this.getCursorPosition(touchEvent)
        this.disturbThoughts(coords)
        this.emitterCoords.set(key, coords)
      }
    })

    this.canvas.addEventListener('touchmove', (event) => {
      for (const touchEvent of event.changedTouches) {
        const key = `touch${touchEvent.identifier}`
        const coords = this.getCursorPosition(touchEvent)
        this.emitterCoords.set(key, coords)
      }
    })

    this.canvas.addEventListener('touchend', (event) => {
      for (const touchEvent of event.changedTouches) {
        const key = `touch${touchEvent.identifier}`
        this.emitterCoords.delete(key)
      }
    })
  }

  updateDemo(): void {
    if (!this.options.params.demo.get()) {
      this.emitterCoords.delete('demo')
      return
    }
    // if (this.thoughts.length >= this.maxThoughts) return;
    const center = new Coords(this.canvas.width / 2, this.canvas.height / 2)
    const radius = Math.min(this.canvas.height, this.canvas.width) * 0.4
    const start = new Coords(
      window.innerWidth / 2 - radius,
      window.innerHeight / 2
    )
    const angle = (this.value / 5) * Math.PI

    const coords = start.rotate(center, angle)
    this.emitterCoords.set('demo', coords)
  }

  setCoordsData(coordsData: Array<IRawCoordsData>): void {
    this.coordsData = coordsData
    this.getTimer('coordsUpdated').startTimer()
  }

  getRandomCoordsData(): ICoordsData {
    if (!this.coordsData.length) {
      return {
        color: new Color().random(),
        coords: new Coords(Math.random(), Math.random()),
      }
    }
    const { color, coords } = choice(this.coordsData)
    return {
      color: new Color(...color),
      coords: new Coords(...coords),
    }
  }

  moveThought(thought: Thought, delay: number = 0.0): void {
    const coordsData = this.getRandomCoordsData()
    const localCoords = new Coords(
      coordsData.coords.x * this.canvas.width,
      coordsData.coords.y * this.canvas.height
    )
    thought.move({
      coords: localCoords,
      color: coordsData.color,
      delay: delay * thought.random,
    })
  }
}

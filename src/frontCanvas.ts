import { randInt, choice } from './utils.js'
import Thought from './thought.js'
import Color from './color.js'
import Coords from './coords.js'
import { ICoordsData, IClickEvent, IRawCoordsData } from './interfaces.js'

export default class FrontCanvas {
  maxThoughts = 5000
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  created: Date
  coordsUpdated: Date
  thoughts: Array<Thought>
  speed: number
  demo: boolean
  coordsData: Array<IRawCoordsData>

  constructor({ speed = 1.0, demo = false }: { speed: number; demo: boolean }) {
    this.canvas = <HTMLCanvasElement>document.getElementById('front')
    this.context = this.canvas.getContext('2d')
    this.created = new Date()
    this.coordsUpdated = new Date()
    this.thoughts = []
    this.speed = speed
    this.demo = demo
    this.coordsData = []
  }

  init(): void {
    this.canvas.height =
      (window.innerHeight * this.canvas.width) / window.innerWidth
  }

  createThought(position: Coords): Thought {
    const thought = new Thought(
      position,
      (15.0 + Math.random() * 10.0) * this.speed
    )
    this.thoughts.push(thought)
    this.moveThought(thought, 1.0 / this.speed)
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
    event,
    chance,
    particles = 10,
  }: {
    event: IClickEvent
    chance: number
    particles: number
  }): void {
    const clickPosition = this.getCursorPosition(event)
    for (let i = 0; i < particles; i++) {
      if (Math.random() > chance) continue
      const radius = 10 * Math.random()
      const angle = Math.PI * Math.random()
      const position = new Coords(
        Math.floor(clickPosition.x + radius * Math.sin(angle)),
        Math.floor(clickPosition.y + radius * Math.cos(angle))
      )
      this.createThought(position)
    }
  }

  killOldest(): void {
    if (this.thoughts.length < this.maxThoughts) return
    this.thoughts
      .slice(0, this.thoughts.length - this.maxThoughts)
      .forEach((thought) => {
        if (!thought.isDying()) thought.die()
      })
  }

  disturbThoughts(event: IClickEvent): void {
    const radius = 50.0
    const clickPosition = this.getCursorPosition(event)
    this.thoughts.forEach((thought) => {
      if (thought.position.distance(clickPosition) < radius) {
        this.moveThought(thought)
      }
    })
  }

  updateThought(thought: Thought): void {
    if (thought.isDead()) {
      this.thoughts.splice(this.thoughts.indexOf(thought), 1)
      return
    }
    if (this.shouldMove(thought)) this.moveThought(thought)
    thought.update()
    thought.draw(this.context)
  }

  shouldMove(thought: Thought): boolean {
    if (Math.random() < 0.001) return true
    if (thought.started > this.coordsUpdated) return false
    return Math.random() < 0.02
  }

  update(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.killOldest()
    if (this.demo) this.updateDemo()
    for (const thought of this.thoughts) {
      this.updateThought(thought)
    }
  }

  scaleCoords(coords: Coords, newHeight: number, oldHeight: number): Coords {
    const yOffset = coords.y - oldHeight / 2
    return new Coords(coords.x, newHeight / 2 + yOffset)
  }

  registerEventListeners(): void {
    let isDrawing = false
    let resizedFinished: number
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
      isDrawing = true
      this.disturbThoughts(event)
      this.generateThoughts({
        event,
        chance: 0.5,
        particles: Math.floor(10 * this.speed),
      })
    })
    this.canvas.addEventListener('mouseup', () => {
      isDrawing = false
    })

    this.canvas.addEventListener('mousemove', (event) => {
      if (!isDrawing) return
      this.generateThoughts({
        event,
        chance: 0.03,
        particles: Math.floor(10 * this.speed),
      })
    })

    this.canvas.addEventListener('touchstart', (event) => {
      for (const touchEvent of event.changedTouches) {
        this.disturbThoughts(touchEvent)
        this.generateThoughts({
          event: touchEvent,
          chance: 0.5,
          particles: Math.floor(10 * this.speed),
        })
      }
    })

    this.canvas.addEventListener(
      'touchmove',
      (event) => {
        for (const touchEvent of event.changedTouches) {
          this.generateThoughts({
            event: touchEvent,
            chance: 0.03,
            particles: Math.floor(10 * this.speed),
          })
        }
      },
      false
    )
  }

  updateDemo(): void {
    // if (this.thoughts.length >= this.maxThoughts) return;
    const center = new Coords(window.innerWidth / 2, window.innerHeight / 2)
    const radius = Math.min(window.innerHeight, window.innerWidth) * 0.4
    const start = new Coords(
      window.innerWidth / 2 - radius,
      window.innerHeight / 2
    )
    const angle = ((Date.now() - this.created.getTime()) / 1000) * Math.PI
    const emitter = start.rotate(center, angle)
    this.generateThoughts({
      event: {
        clientX: emitter.x,
        clientY: emitter.y,
      },
      chance: this.speed / 20,
      particles: 10,
    })
  }

  setCoordsData(coordsData: Array<IRawCoordsData>): void {
    this.coordsData = coordsData
    this.coordsUpdated = new Date()
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
      delay,
    })
  }
}

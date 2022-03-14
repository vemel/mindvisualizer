import Coords from './coords.js'
import Color from './color.js'
import FrontCanvas from './frontCanvas.js'
import BackCanvas from './backCanvas.js'
import Renderer from './renderer.js'

export interface ICoordsData {
  coords: Coords
  color: Color
}

export interface IClickEvent {
  clientX: number
  clientY: number
}

export interface IRawCoordsData {
  coords: [number, number]
  color: [number, number, number, number]
}

export interface IOptions {
  maxThoughts: number
  speed: number
  shuffle: boolean
  demo: boolean
  hideUI: boolean
  text: string
  renderer: Renderer | null
}

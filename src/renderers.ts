import Coords from './coords.js'
import Color from './color.js'

export class Renderer {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  init(): void {}

  clear(color: Color): void {}

  drawCircle(position: Coords, radius: number, color: Color): void {}
}

export class Context2DRenderer extends Renderer {
  context: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.context = this.canvas.getContext('2d')
  }

  init(): void {}

  clear(color: Color): void {
    this.context.fillStyle = color.toRGBA()
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawCircle(position: Coords, radius: number, color: Color): void {
    const context = this.context
    context.beginPath()
    context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false)

    context.fillStyle = color.toRGBA()
    context.fill()
  }
}

export class WebGLRenderer extends Renderer {
  gl: WebGL2RenderingContext

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.gl = this.canvas.getContext('webgl2')
  }

  init(): void {
    this.linkProgram()

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    this.gl.clearColor(...new Color().toArray())
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  linkProgram(): void {
    const gl = this.gl

    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, this.getVertexShader())
    gl.compileShader(vs)

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, this.getFragmentShader())
    gl.compileShader(fs)

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
  }

  getVertexShader(): string {
    return document.getElementById('vertex_shader').firstChild.nodeValue
  }

  getFragmentShader(): string {
    return document.getElementById('fragment_shader').firstChild.nodeValue
  }
}

import Color from './color.js';
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }
    init() { }
    clear(color) { }
    drawCircle(position, radius, color) { }
}
export class Context2DRenderer extends Renderer {
    constructor(canvas) {
        super(canvas);
        this.context = this.canvas.getContext('2d');
    }
    init() { }
    clear(color) {
        this.context.fillStyle = color.toRGBA();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    drawCircle(position, radius, color) {
        const context = this.context;
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
        context.fillStyle = color.toRGBA();
        context.fill();
    }
}
export class WebGLRenderer extends Renderer {
    constructor(canvas) {
        super(canvas);
        this.gl = this.canvas.getContext('webgl2');
    }
    init() {
        this.linkProgram();
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(...new Color().toArray());
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    linkProgram() {
        const gl = this.gl;
        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, this.getVertexShader());
        gl.compileShader(vs);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, this.getFragmentShader());
        gl.compileShader(fs);
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
    }
    getVertexShader() {
        return document.getElementById('vertex_shader').firstChild.nodeValue;
    }
    getFragmentShader() {
        return document.getElementById('fragment_shader').firstChild.nodeValue;
    }
}

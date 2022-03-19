import Timer from './timer.js';
import { sum } from './utils.js';
export default class UI extends Timer {
    constructor(options) {
        super(true, 1.0);
        this.title = document.getElementById('title');
        this.controls = document.getElementById('controls');
        this.speed = document.getElementById('speed');
        this.fps = document.getElementById('fps');
        this.options = options;
        this.dts = [];
    }
    get show() {
        return !this.options.hideUI;
    }
    showUI() {
        this.title.classList.remove('hidden');
        this.controls.classList.remove('hidden');
        this.speed.value = this.options.speed.toString();
    }
    registerEventListeners() {
        this.controls.querySelector('.reset').addEventListener('click', () => {
            this.options.frontCanvas.thoughts.forEach((thought) => thought.die());
        });
        this.controls.querySelector('.next').addEventListener('click', () => {
            if (this.options.renderer)
                this.options.renderer.next();
        });
        this.speed.addEventListener('input', () => {
            this.options.speed = Number(this.speed.value);
        });
    }
    update(dt) {
        this.dts = [...this.dts.slice(-10), dt];
        return super.update(dt);
    }
    updateOnInterval() {
        if (!this.show)
            return;
        const titleClassList = this.title.classList;
        if (this.options.frontCanvas.thoughts.length >= 1000 &&
            !titleClassList.contains('glitch')) {
            titleClassList.add('glitch');
            titleClassList.add('layers');
        }
        if (this.options.frontCanvas.thoughts.length < 1000 &&
            titleClassList.contains('glitch')) {
            titleClassList.remove('glitch');
            titleClassList.remove('layers');
        }
        const avgDt = sum(this.dts) / this.dts.length;
        this.fps.innerText = (1.0 / avgDt).toFixed(0);
    }
}

import Timer from './timer.js';
import UIInput from './controls/uiInput.js';
import UICheckbox from './controls/uiCheckbox.js';
import { sum } from './utils.js';
export default class UI extends Timer {
    constructor(options) {
        super(true, 1.0);
        this.title = document.getElementById('title');
        this.controls = document.getElementById('controls');
        this.speed = new UIInput(document.getElementById('speed'));
        this.maxThoughts = new UIInput(document.getElementById('maxThoughts'));
        this.demo = new UICheckbox(document.getElementById('demoControl'));
        this.shuffle = new UICheckbox(document.getElementById('shuffleControl'));
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
        this.speed.set(this.options.speed.toString());
        this.maxThoughts.set(this.options.maxThoughts.toString());
        this.demo.set(this.options.demo);
        this.shuffle.set(this.options.shuffle);
    }
    registerEventListeners() {
        this.controls.querySelector('.reset').addEventListener('click', () => {
            this.options.frontCanvas.thoughts.forEach((thought) => thought.die());
        });
        this.controls.querySelector('.next').addEventListener('click', () => {
            if (this.options.renderer)
                this.options.renderer.next();
        });
        this.speed.registerEventListeners((value) => this.options.set(Object.assign(Object.assign({}, this.options.toObject()), { speed: Number(value) })));
        this.maxThoughts.registerEventListeners((value) => this.options.set(Object.assign(Object.assign({}, this.options.toObject()), { maxThoughts: Number(value) })));
        this.demo.registerEventListeners((demo) => this.options.set(Object.assign(Object.assign({}, this.options.toObject()), { demo })));
        this.shuffle.registerEventListeners((shuffle) => this.options.set(Object.assign(Object.assign({}, this.options.toObject()), { shuffle })));
    }
    update(dt) {
        this.dts = [...this.dts.slice(-50), dt];
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

import Timer from './timer.js';
import UIInput from './controls/uiSlider.js';
import UICheckbox from './controls/uiCheckbox.js';
import { sum } from './utils.js';
export default class UI extends Timer {
    constructor(options) {
        super(true, 1.0);
        this.title = document.getElementById('title');
        this.controls = document.getElementById('controls');
        this.inputs = {
            speed: new UIInput(document.getElementById('speed')),
            maxThoughts: new UIInput(document.getElementById('maxThoughts')),
            demo: new UICheckbox(document.getElementById('demoControl')),
            shuffle: new UICheckbox(document.getElementById('shuffleControl')),
        };
        this.fps = document.getElementById('fps');
        this.options = options;
        this.dts = [];
        if (this.show)
            this.showUI();
    }
    get show() {
        return !this.options.params.hideUI.get();
    }
    showUI() {
        this.title.classList.remove('hidden');
        this.controls.classList.remove('hidden');
        Object.entries(this.inputs).forEach(([key, input]) => {
            input.set(this.options.params[key].get());
        });
    }
    registerEventListeners() {
        this.controls.querySelector('.reset').addEventListener('click', () => {
            this.options.frontCanvas.thoughts.forEach((thought) => thought.die());
        });
        this.controls.querySelector('.next').addEventListener('click', () => {
            if (this.options.renderer)
                this.options.renderer.next();
        });
        Object.entries(this.inputs).forEach(([key, input]) => {
            input.registerEventListeners((value) => {
                this.options.params[key].set(value);
                this.options.saveToLocalStorage();
            });
        });
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

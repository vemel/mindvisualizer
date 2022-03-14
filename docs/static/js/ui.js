export default class UI {
    constructor(options, frontCanvas) {
        this.title = document.getElementById('title');
        this.controls = document.getElementById('controls');
        this.speed = document.getElementById('speed');
        this.frontCanvas = frontCanvas;
        this.options = options;
    }
    showUI() {
        this.title.classList.remove('hidden');
        this.controls.classList.remove('hidden');
        this.speed.value = this.options.speed.toString();
    }
    registerEventListeners() {
        this.controls.querySelector('.reset').addEventListener('click', () => {
            this.frontCanvas.thoughts.forEach((thought) => thought.die());
        });
        this.controls.querySelector('.next').addEventListener('click', () => {
            if (this.options.renderer)
                this.options.renderer.next();
        });
        this.speed.addEventListener('input', () => {
            this.options.speed = Number(this.speed.value);
        });
    }
    update() {
        if (!this.show)
            return;
        const titleClassList = this.title.classList;
        if (this.frontCanvas.thoughts.length >= 1000 &&
            !titleClassList.contains('glitch')) {
            titleClassList.add('glitch');
            titleClassList.add('layers');
        }
        if (this.frontCanvas.thoughts.length < 1000 &&
            titleClassList.contains('glitch')) {
            titleClassList.remove('glitch');
            titleClassList.remove('layers');
        }
    }
}

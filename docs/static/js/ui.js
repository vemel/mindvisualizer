export default class UI {
    constructor({ frontCanvas, show, }) {
        this.title = document.getElementById('title');
        this.controls = document.getElementById('controls');
        this.frontCanvas = frontCanvas;
        this.show = show;
        if (show)
            this.showUI();
    }
    showUI() {
        document.getElementById('title').classList.remove('hidden');
        document.getElementById('controls').classList.remove('hidden');
    }
    registerEventListeners() {
        document.getElementById('reset').addEventListener('click', () => {
            this.frontCanvas.thoughts.forEach((thought) => thought.die());
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

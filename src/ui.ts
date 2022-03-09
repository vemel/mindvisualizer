import FrontCanvas from "./frontCanvas.js";

export default class UI {
  readonly title: HTMLElement;
  readonly controls: HTMLElement;
  readonly frontCanvas: FrontCanvas;
  readonly show: boolean;
  constructor({
    frontCanvas,
    show,
  }: {
    frontCanvas: FrontCanvas;
    show: boolean;
  }) {
    this.title = document.getElementById("title");
    this.controls = document.getElementById("controls");
    this.frontCanvas = frontCanvas;
    this.show = show;
    if (show) this.showUI();
  }

  showUI(): void {
    document.getElementById("title").classList.remove("hidden");
    document.getElementById("controls").classList.remove("hidden");
  }

  registerEventListeners(): void {
    document.getElementById("reset").addEventListener("click", () => {
      this.frontCanvas.thoughts.forEach((thought) => thought.die());
    });
  }

  update(): void {
    if (!this.show) return;
    const titleClassList = this.title.classList;
    if (
      this.frontCanvas.thoughts.length >= 1000 &&
      !titleClassList.contains("glitch")
    ) {
      titleClassList.add("glitch");
      titleClassList.add("layers");
    }
    if (
      this.frontCanvas.thoughts.length < 1000 &&
      titleClassList.contains("glitch")
    ) {
      titleClassList.remove("glitch");
      titleClassList.remove("layers");
    }
  }
}

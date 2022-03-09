import TEXTS from "./texts.js";
import BackCanvas from "./backCanvas.js";
import FrontCanvas from "./frontCanvas.js";
import Renderer from "./renderer.js";
import UI from "./ui.js";

const OPTS = {
  maxThoughts: 2500,
  speed: 2.0,
  shuffle: true,
  demo: false,
  hideUI: false,
  text: "",
};

function getTexts() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) {
    const encoded = window.btoa(unescape(encodeURIComponent(params.get("q"))));
    // console.log(params.q, encoded)
    console.log(`http://localhost:8089/?bq=${encoded}`);
    localStorage.setItem("mindtext", params.get("q"));
  }
  if (params.get("bq")) {
    const decoded = decodeURIComponent(escape(window.atob(params.get("bq"))));
    localStorage.setItem("mindtext", decoded);
  }
  let result = "";
  if (localStorage.getItem("mindtext")) {
    result = localStorage.getItem("mindtext");
  }
  if (!result.length) {
    return TEXTS.emoji;
  }
  if (Object.keys(TEXTS).includes(result)) {
    return TEXTS[result].map((x) => x.toUpperCase());
  }
  return result.split(".").map((x) => x.toUpperCase());
}

function updateOpts() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("demo")) OPTS.demo = params.get("demo") === "true";
  if (params.get("speed")) OPTS.speed = Number(params.get("speed"));
  if (params.get("shuffle")) OPTS.shuffle = params.get("shuffle") === "true";
  if (params.get("ui")) OPTS.hideUI = params.get("ui") === "false";
}

function loadFonts() {
  const WebFont = (window as any).WebFont;
  WebFont.load({
    google: {
      families: ['Ubuntu']
    }
  });
}

const main = () => {
  loadFonts();
  updateOpts();

  const backCanvas = new BackCanvas();

  const frontCanvas = new FrontCanvas({
    speed: OPTS.speed,
    demo: OPTS.demo,
  });
  frontCanvas.init();
  frontCanvas.registerEventListeners();

  const ui = new UI({
    show: !OPTS.hideUI,
    frontCanvas,
  });
  ui.registerEventListeners();

  const renderer = new Renderer({
    speed: OPTS.speed,
    frontCanvas,
    backCanvas,
    shuffle: OPTS.shuffle,
    texts: getTexts(),
  });

  setInterval(() => {
    const now = new Date();
    renderer.update();
    frontCanvas.update();
    ui.update();
  }, 10);
};

window.onload = () => {
  main();
};

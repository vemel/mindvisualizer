import * as vectors from './vectors.js'
import TEXTS from './texts.js'
import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'


window.OPTS = {
    maxThoughts: 2500,
    speed: 2.0,
    randomText: true,
    shuffle: true,
    demo: false,
    hideUI: false,
}
window.TIME_DELTA = 0.0

function getTexts() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.q) {
        const encoded = window.btoa(unescape(encodeURIComponent(params.q)));
        // console.log(params.q, encoded)
        console.log(`http://localhost:8089/?bq=${encoded}`)
        localStorage.setItem("mindtext", params.q)
    }
    if (params.bq) {
        console.log(params.bq)
        const decoded = decodeURIComponent(escape(window.atob(params.bq)));
        localStorage.setItem("mindtext", decoded)
    }
    let result = ""
    if (localStorage.getItem("mindtext")) {
        result = localStorage.getItem("mindtext")
    }
    if (!result.length) {
        return TEXTS.emoji
    }
    if (Object.keys(TEXTS).includes(result)) {
        return TEXTS[result].map(x => x.toUpperCase())
    }
    return result.split(".").map(x => x.toUpperCase())
}

function updateEffects(frontCanvas) {
    const title = document.getElementById('title')
    if (frontCanvas.thoughts.length >= 1000 && !title.classList.contains("glitch")) {
        title.classList.add("glitch")
        title.classList.add("layers")
    }
    if (frontCanvas.thoughts.length < 1000 && title.classList.contains("glitch")) {
        title.classList.remove("glitch")
        title.classList.remove("layers")
    }
}

function initCanvas() {
    const frontCanvas = new FrontCanvas({
        speed: OPTS.speed,
        demo: OPTS.demo
    })
    window.frontCanvas = frontCanvas
    frontCanvas.init()
    frontCanvas.registerEventListeners()
    return frontCanvas
}

function initControls() {
    if (!OPTS.hideUI) {
        document.getElementById('title').classList.remove("hidden")
        document.getElementById('controls').classList.remove("hidden")
    }
    document.getElementById('reset').addEventListener('click', () => {
        THOUGHTS.forEach(thought => thought.die())
    })
}

function updateOpts() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.demo) OPTS.demo = params.demo === "true"
    if (params.speed) OPTS.speed = parseFloat(params.speed)
    if (params.random) OPTS.randomText = params.random === "true"
    if (params.shuffle) OPTS.shuffle = params.shuffle === "true"
    if (params.ui) OPTS.hideUI = params.ui === "false"
}

const showTextLines = (frontCanvas) => {
    const backCanvas = new BackCanvas()

    const textLines = getTexts()
    let counter = 0;
    if (textLines.length > 1 && OPTS.shuffle) {
        setInterval(() => {
            const text = OPTS.randomText ? vectors.choice(textLines) : textLines[counter]
            console.log("Rendering", [text])
            backCanvas.clear()
            backCanvas.drawText(text)
            counter = (counter + 1) % textLines.length
            const coordsData = backCanvas.getCoords(frontCanvas.canvas)
            frontCanvas.setCoordsData(coordsData)
            frontCanvas.disturbAll()
        }, 1000 * 60 * 1.5 / OPTS.speed)
    }

    const text = OPTS.randomText ? vectors.choice(textLines) : textLines[counter]
    counter = (counter + 1) % textLines.length
    backCanvas.clear()
    backCanvas.drawText(text)
    console.log("Rendering", [text])
    const coordsData = backCanvas.getCoords(frontCanvas.canvas)
    frontCanvas.setCoordsData(coordsData)
}

const main = () => {
    updateOpts()
    initControls()


    const frontCanvas = initCanvas()
    showTextLines(frontCanvas)

    // debugThoughts()
    let lastUpdate = new Date()
    setInterval(() => {
        const now = new Date()
        window.TIME_DELTA = (now - lastUpdate) / 1000
        lastUpdate = now
        frontCanvas.update();
        updateEffects(frontCanvas)
    }, 10)
    // console.log(COORDS)
}

window.onload = () => {
    main()
}
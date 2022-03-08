import TEXTS from './texts.js'
import BackCanvas from './backCanvas.js'
import FrontCanvas from './frontCanvas.js'
import Renderer from './renderer.js'
import UI from './ui.js'


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

const main = () => {
    updateOpts()

    const backCanvas = new BackCanvas()

    const frontCanvas = new FrontCanvas({
        speed: OPTS.speed,
        demo: OPTS.demo
    })
    // window.frontCanvas = frontCanvas
    frontCanvas.init()
    frontCanvas.registerEventListeners()

    const ui = new UI({
        show: !OPTS.hideUI,
        frontCanvas
    })
    ui.registerEventListeners()

    const renderer = new Renderer({
        speed: OPTS.speed,
        frontCanvas,
        backCanvas,
        random: OPTS.random,
        shuffle: OPTS.shuffle,
        texts: getTexts()
    })

    let lastUpdate = new Date()
    setInterval(() => {
        const now = new Date()
        window.TIME_DELTA = (now - lastUpdate) / 1000
        lastUpdate = now
        renderer.update()
        frontCanvas.update()
        ui.update()
    }, 10)
}

window.onload = () => {
    main()
}
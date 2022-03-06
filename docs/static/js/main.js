import * as vectors from './vectors.js'
import TEXTS from './texts.js'
import Thought from './thought.js'


window.OPTS = {
    maxThoughts: 2500,
    speed: 2.0,
    randomText: true,
    shuffle: true,
    demo: false,
    hideUI: false,
}
window.THOUGHTS = []
window.COORDS = {}

function fitTextOnCanvas(text, canvas) {
    let fontsize=100;
    const context = canvas.getContext('2d');

    // lower the font size until the text fits the canvas
    do{
        fontsize--;
        context.font = `bold ${fontsize}px Calibri`;
    }while(context.measureText(text).width > canvas.width - 40)

    // draw the text
    context.fillText(text, canvas.width / 2, canvas.height / 2 + context.measureText(text).fontBoundingBoxAscent / 2);
}

function getTexts() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    if (params.q) {
        const encoded = window.btoa(unescape(encodeURIComponent( params.q )));
        // console.log(params.q, encoded)
        console.log(`http://localhost:8089/?bq=${encoded}`)
        localStorage.setItem("mindtext", params.q)
    }
    if (params.bq) {
        console.log(params.bq)
        const decoded = decodeURIComponent(escape(window.atob( params.bq )));
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

function getCoords({ text }) {
    const canvas = document.getElementById('back');
    const frontCanvas = document.getElementById('front');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.font = 'bold 24px Calibri';
    context.textAlign = "center";
    if (text.length) {
        const spacedText = [...text.toUpperCase()].join(' ')
        fitTextOnCanvas(spacedText, canvas);
    }
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    const result = {}
    for(let i = 0; i < data.length; i += 4) {
        const coords = [
            Math.floor((i / 4) % canvas.width / canvas.width * frontCanvas.width),
            Math.floor((i / 4) / canvas.width / canvas.height * frontCanvas.height),
        ]
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];
        if (!alpha) continue;
        // console.log(coords)
        result[`${coords[0]},${coords[1]}`] = {
            free: true,
            color: [red, green, blue],
            isBlack: red == green && green == blue && red < 10
        }
    }
    return result
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) / window.innerWidth * canvas.width)
    const y = Math.floor((event.clientY - rect.top) / window.innerHeight * canvas.height)
    // console.log("x: " + x + " y: " + y)
    return [x, y]
}

function drawThoughts() {
    const canvas = document.getElementById('front');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (const thought of THOUGHTS) {
        thought.update();
        thought.draw();
    }
}

function generateThoughts({ canvas, event, chance, particles = 10 }) {
    const clickPosition = getCursorPosition(canvas, event)
    const context = canvas.getContext('2d')
    for (let i = 0; i < particles; i++) {
        if (Math.random() > chance) continue;
        const radius = 10 * Math.random()
        const angle = Math.PI * Math.random()
        const position = [
            Math.floor(clickPosition[0] + radius * Math.sin(angle)),
            Math.floor(clickPosition[1] + radius * Math.cos(angle)),
        ]
        const thought = new Thought({position, context});
        THOUGHTS.push(thought)
    }
    updateEffects()
    if (THOUGHTS.length > OPTS.maxThoughts) {
        THOUGHTS.slice(0, THOUGHTS.length - OPTS.maxThoughts).forEach(thought => {
            if (!thought.isDying()) thought.die()
        })
    }
}

function updateEffects() {
    const title = document.getElementById('title')
    // if (THOUGHTS.length >= 2000 && !title.classList.contains("hidden")) {
        //     title.classList.add("hidden")
        // }
        // if (THOUGHTS.length < 2000 && title.classList.contains("hidden")) {
            //     title.classList.remove("hidden")
            // }
            if (THOUGHTS.length >= 1000 && !title.classList.contains("glitch")) {
                title.classList.add("glitch")
                title.classList.add("layers")
            }
            if (THOUGHTS.length < 1000 && title.classList.contains("glitch")) {
                title.classList.remove("glitch")
                title.classList.remove("layers")
            }
    // const plasmaCanvas = document.getElementById('plasma')
    // plasmaCanvas.style.opacity = Math.max(0.0, Math.min(0.8, (THOUGHTS.length - 1500) / 1000))
}

function initCanvas() {
    const canvas = document.getElementById('front');
    let isDrawing = false;
    canvas.addEventListener('mousedown', function(event) {
        isDrawing = true;
        const clickPosition = getCursorPosition(canvas, event)
        THOUGHTS.forEach(thought => {
            if (vectors.distance(thought.position, clickPosition) < 50.0) {
                thought.disturb()
            }
        })
        generateThoughts({ canvas, event, chance: 0.5, particles: 10 * OPTS.speed })
    })
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    })

    canvas.addEventListener('mousemove', function(event) {
        if (!isDrawing) return;
        generateThoughts({ canvas, event, chance: 0.03, particles: 10 * OPTS.speed })
    })

    canvas.addEventListener('touchstart', function(event) {
        const clickPosition = getCursorPosition(canvas, event)
        THOUGHTS.forEach(thought => {
            if (vectors.distance(thought.position, clickPosition) < 50.0) {
                thought.disturb()
            }
        })
        generateThoughts({ canvas, event, chance: 0.5, particles: 10 * OPTS.speed })
    })

    canvas.addEventListener("touchmove", (event) => {
        console.log('touchmove',event)
        for (const touchEvent of event.changedTouches) {
            generateThoughts({ canvas, event: touchEvent, chance: 0.03, particles: 10 * OPTS.speed })
        }
    }, false);
}

function initControls() {
    if (!OPTS.hideUI) {
        document.getElementById('title').classList.remove("hidden")
        document.getElementById('reset').classList.remove("hidden")
    }
    document.getElementById('reset').addEventListener('click', () => {
        THOUGHTS.forEach(thought => thought.die())
    })
}

function debugThoughts() {
    const canvas = document.getElementById('front');
    const context = canvas.getContext('2d');
    for (const coordsStr of Object.keys(COORDS)) {
        const position = coordsStr.split(',').map(x => parseInt(x));
        const thought = new Thought({position, context});
        THOUGHTS.push(thought)
    }
}

function initFrontCanvas() {
    const canvas = document.getElementById('front');
    canvas.height = window.innerHeight * canvas.width / window.innerWidth
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

function maybeDemo() {
    if (!OPTS.demo) return

    const canvas = document.getElementById('front');
    const started = new Date()
    const center = [window.innerWidth / 2, window.innerHeight / 2]
    const start = [window.innerWidth / 2 - window.innerHeight * 0.4, window.innerHeight / 2]
    setInterval(function() {
        const angle = (new Date() - started) / 1000 * Math.PI
        const emitter = vectors.rotate(start, center, angle)
        generateThoughts({
            canvas,
            event: {
                clientX: emitter[0],
                clientY: emitter[1],
            },
            chance: 0.2,
            particles: 10 * OPTS.speed
        })
    }, 10)
}

const showTextLines = () => {
    const textLines = getTexts()
    let counter = 0;
    if (textLines.length > 1 && OPTS.shuffle) {
        setInterval(() => {
            const text = OPTS.randomText ? vectors.choice(textLines): textLines[counter]
            console.log("Rendering", [text])
            counter = (counter + 1) % textLines.length
            COORDS = getCoords({ text })
            THOUGHTS.forEach(thought => thought.disturbDelayed())
        }, 1000 * 60 * 1.5 / OPTS.speed)
    }

    const text = OPTS.randomText ? vectors.choice(textLines): textLines[counter]
    counter = (counter + 1) % textLines.length
    COORDS = getCoords({ text })
}

const main = () => {
    updateOpts()
    initControls()
    initFrontCanvas()
    showTextLines()
    initCanvas()
    // debugThoughts()
    setInterval(() => {
        drawThoughts();
    }, 10)
    maybeDemo()
    // console.log(COORDS)
}

const prefab = () => {
    const imageUrl = getImageUrl()
    if (imageUrl.length) {
        const backImg = new Image();
        backImg.onload = function() {
            main({ image: backImg })
        };
        backImg.src = imageUrl;
    } else {
        main()
    }
}

window.onload = () => {
    main()
}
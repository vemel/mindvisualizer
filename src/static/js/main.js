window.OPTS = {
    maxThoughts: 2500,
    speed: 10.0,
    randomText: true,
    shuffle: false,
    demo: false
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


const DEMO_TEXT = [
    "✌💗",
    "🐈👈",
    "♋?",
    "секс",
    "убить путина",
    "влад - гений",
    "всё вижу",
    "🍆👍",
    "🧁",
    "💊",
    "как это?!",
    "ебать секс",
    "срааааааать",
    "¡завтра!",
    "вкусная еда",
    "🌴лето🌴",
    "🪙 энергия 💳"
]

const MARCH_TEXT = [
    ": : : :",
    "дорогие девушки",

    "!!!"
]

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
    let result = '?'
    if (localStorage.getItem("mindtext")) {
        result = localStorage.getItem("mindtext")
    }
    if (result == "demo") {
        return DEMO_TEXT.map(x => x.toUpperCase())
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
            isBlack: red == green && green == blue
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


function getRandomColor() {
    return [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
    ]
}

class Thought {
    constructor({position, context}) {
      this.position = position
      this.start = position
      this.context = context
      this.random = Math.random()
      this.angle = (Math.random() - 0.5) * Math.PI
      this.speed = (20.0 + Math.random() * 10.0) * OPTS.speed
      this.created = new Date()
      this.died = null
      
      this.startColor = null
      this.started = null
      this.end = null
      this.ended = null
      this.endColor = null
      this.rearranged = null

      this.disturb()
    }

    getTravelSeconds() {
        const distance = vectors.distance(this.start, this.end)
        return Math.max(distance / this.speed, 1.0)
    }

    getEnded() {
        return new Date(this.started.getTime() + this.getTravelSeconds() * 1000)
    }

    getAlpha() {
        const now = new Date()
        const dieMod = this.died ? vectors.lerp(1.0, 0.0, vectors.Easing.easeInOutQuad(this.getDieLerpT())): 1.0
        const size = 0.4 + Math.sin((now - this.created) / 500 + this.random * 6) * 0.2
        return size * dieMod
    }

    getNewRearranged() {
        return new Date(this.ended.getTime() + Math.floor((Math.random() * 120) * 1000))
    }

    getDieLerpT() {
        const now = new Date()
        return 1.0 - Math.min(1.0, (this.died - now) / 400);
    }

    getRadius() {
        const now = new Date()
        const bornMod = Math.min((now - this.created) / 1000, 1.0)
        const dieMod = this.died ? vectors.lerp(1.0, 4.0, vectors.Easing.easeInQuad(this.getDieLerpT())): 1.0
        const size = 6.0 + Math.sin((now - this.created) / 1000 + this.random * 6) * 2.0;
        return bornMod * dieMod * size
    }

    die() {
        this.died = new Date(Date.now() + 400 + Math.random() * 1000)
    }

    destroy() {
        const index = THOUGHTS.indexOf(this)
        THOUGHTS.splice(index, 1)
    }

    pickRandomCoords() {
        const coords = Object.keys(COORDS)
        if (!coords.length) return null

        const coordsStr = vectors.choice(coords)
        return coordsStr.split(',').map(x => parseInt(x))
    }

    getEndColor() {
        const coordsStr = this.end.map(x => x.toString()).join(',')
        const coordsData = COORDS[coordsStr]
        if (!coordsData) return getRandomColor()
        if (coordsData.isBlack) return getRandomColor()
        return coordsData.color
    }

    getColor() {
        if (!this.endColor) return this.startColor;
        const t = this.getElapsedSeconds() / this.getTravelSeconds()
        return vectors.lerpV3(this.startColor, this.endColor, t)
    }

    disturb() {
        this.start = this.position
        this.end = this.pickRandomCoords()
        this.started = new Date()
        this.startColor = this.endColor
        this.ended = this.getEnded()
        this.endColor = this.getEndColor()
        if (!this.startColor) this.startColor = this.endColor
        this.rearranged = this.getNewRearranged()
    }

    isDying() {
        return this.died ? true : false
    }

    disturbDelayed() {
        this.rearranged = new Date(Date.now() + 1000 * 10 * Math.random())
    }

    getElapsedSeconds() {
        return (new Date() - this.started) / 1000
    }

    update() {
        const now = new Date()
        if (this.died && this.died < now) {
            this.destroy()
            return
        }
        if (!this.end) return
        const totalSeconds = this.getTravelSeconds()
        const elapsed = this.getElapsedSeconds()
        if (now > this.rearranged) {
            // console.log(now, this.changeEnd)
            this.disturb()
            return
        }
        if (now > this.ended) {
            // this.end = this.pickRandomCoords()
            // this.started = new Date()
            this.position = this.end;
            // console.log('reached')
            return
        }
        const ease = vectors.Easing.easeInOutQuad(elapsed / totalSeconds)
        const bezierStart = vectors.lerpV2(this.start, rotate(this.start, this.end, this.angle), ease)
        const bezierEnd = vectors.lerpV2(this.end, rotate(this.end, this.start, -this.angle), 1.0 - ease)
        this.position = vectors.lerpV2(bezierStart, bezierEnd, ease)
    }

    draw() {
        const context = this.context
        context.beginPath();
        context.arc(this.position[0], this.position[1], this.getRadius(), 0, 2 * Math.PI, false);
        const color = this.getColor()
        context.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${this.getAlpha()})`;
        context.fill();
        context.lineWidth = 0;
        context.strokeStyle = 'rgba(0, 0, 0, 0.0)';
        context.stroke();
    }
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
        const thought = new Thought({position, color: getRandomColor(), context});
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
        generateThoughts({ canvas, event, chance: 0.5, particles: 20 })
    })
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    })

    canvas.addEventListener('mousemove', function(event) {
        if (!isDrawing) return;
        generateThoughts({ canvas, event, chance: 0.03 })
    })    
}

function initControls() {
    document.getElementById('reset').addEventListener('click', () => {
        THOUGHTS.forEach(thought => thought.die())
    })
}

function debugThoughts() {
    const canvas = document.getElementById('front');
    const context = canvas.getContext('2d');
    for (const coordsStr of Object.keys(COORDS)) {
        const position = coordsStr.split(',').map(x => parseInt(x));
        const thought = new Thought({position, color: getRandomColor(), context});
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
            particles: 10
        })
    }, 10)
}

const showTextLines = () => {
    const textLines = getTexts()
    console.log(textLines)
    let counter = 0;
    if (textLines.length > 1 && OPTS.shuffle) {
        setInterval(() => {
            console.log("trigger")
            const text = OPTS.randomText ? vectors.choice(textLines): textLines[counter]
            counter = (counter + 1) % textLines.length
            COORDS = getCoords({ text })
            THOUGHTS.forEach(thought => thought.disturbDelayed())
        }, 1000 * 60 * 3/ OPTS.speed)
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
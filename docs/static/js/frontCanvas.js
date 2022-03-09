import * as vectors from './vectors.js'
import Thought from './thought.js'
import Color from './color.js'

export default class FrontCanvas {
    maxThoughts = 5000

    constructor({
        speed = 1.0,
        demo = false
    }) {
        this.canvas = document.getElementById('front')
        this.context = this.canvas.getContext('2d')
        this.created = new Date()
        this.coordsUpdated = new Date()
        this.thoughts = []
        this.speed = speed
        this.demo = demo
        this.coordsData = {}
        this.coordsKeys = []
    }

    init() {
        this.canvas.height = window.innerHeight * this.canvas.width / window.innerWidth
    }

    createThought(position) {
        const thought = new Thought({
            position,
            frontCanvas: this,
            speed: (15.0 + Math.random() * 10.0) * this.speed
        })
        this.thoughts.push(thought)
        this.moveThought({
            thought,
            delay: 1.0 / this.speed
        })
    }

    getCursorPosition(event) {
        const rect = this.canvas.getBoundingClientRect()
        const x = Math.floor((event.clientX - rect.left) / window.innerWidth * this.canvas.width)
        const y = Math.floor((event.clientY - rect.top) / window.innerHeight * this.canvas.height)
        return [
            x,
            y
        ]
    }

    generateThoughts({
        event,
        chance,
        particles = 10
    }) {
        const clickPosition = this.getCursorPosition(event)
        for (let i = 0; i < particles; i++) {
            if (Math.random() > chance) continue;
            const radius = 10 * Math.random()
            const angle = Math.PI * Math.random()
            const position = [
                Math.floor(clickPosition[0] + radius * Math.sin(angle)),
                Math.floor(clickPosition[1] + radius * Math.cos(angle)),
            ]
            this.createThought(position);
        }
    }

    killOldest() {
        if (this.thoughts.length < this.maxThoughts) return
        this.thoughts.slice(0, this.thoughts.length - this.maxThoughts).forEach(thought => {
            if (!thought.isDying()) thought.die()
        })
    }

    disturbThoughts(event) {
        const radius = 50.0;
        const clickPosition = this.getCursorPosition(event)
        this.thoughts.forEach(thought => {
            if (vectors.distance(thought.position, clickPosition) < radius) {
                this.moveThought({
                    thought,
                    delay: 0.0
                })
            }
        })
    }

    updateThought(thought) {
        if (thought.isDead()) {
            this.thoughts.splice(this.thoughts.indexOf(thought), 1)
            return
        }
        if (this.shouldMove(thought)) this.moveThought({
            thought
        })
        thought.update()
        thought.draw(this.context)
    }

    shouldMove(thought) {
        if (Math.random() < 0.001) return true
        if (thought.started > this.coordsUpdated) return false
        return Math.random() < 0.03
    }

    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.killOldest()
        if (this.demo) this.updateDemo()
        for (const thought of this.thoughts) {
            this.updateThought(thought)
        }
    }

    registerEventListeners() {
        let isDrawing = false;
        const _this = this
        this.canvas.addEventListener('mousedown', function (event) {
            isDrawing = true;
            _this.disturbThoughts(event)
            _this.generateThoughts({
                event,
                chance: 0.5,
                particles: Math.floor(10 * _this.speed)
            })
        })
        this.canvas.addEventListener('mouseup', function () {
            isDrawing = false;
        })

        this.canvas.addEventListener('mousemove', function (event) {
            if (!isDrawing) return;
            _this.generateThoughts({
                event,
                chance: 0.03,
                particles: Math.floor(10 * _this.speed)
            })
        })

        this.canvas.addEventListener('touchstart', function (event) {
            _this.disturbThoughts(event)
            _this.generateThoughts({
                event,
                chance: 0.5,
                particles: Math.floor(10 * _this.speed)
            })
        })

        this.canvas.addEventListener("touchmove", (event) => {
            console.log('touchmove', event)
            for (const touchEvent of event.changedTouches) {
                _this.generateThoughts({
                    event: touchEvent,
                    chance: 0.03,
                    particles: Math.floor(10 * _this.speed)
                })
            }
        }, false);
    }

    updateDemo() {
        // if (this.thoughts.length >= this.maxThoughts) return;
        const center = [window.innerWidth / 2, window.innerHeight / 2]
        const start = [window.innerWidth / 2 - window.innerHeight * 0.4, window.innerHeight / 2]
        const angle = (new Date() - this.created) / 1000 * Math.PI
        const emitter = vectors.rotate(start, center, angle)
        this.generateThoughts({
            event: {
                clientX: emitter[0],
                clientY: emitter[1],
            },
            chance: TIME_DELTA * this.speed * 10,
            particles: 10
        })
    }

    setCoordsData(coordsData) {
        this.coordsData = coordsData
        this.coordsKeys = Object.keys(coordsData)
        this.coordsUpdated = new Date()
    }

    moveThought({
        thought,
        delay = 0.0
    }) {
        const coords = this.pickRandomCoords()
        if (!coords) return
        const color = this.getCoordsColor(coords)
        thought.move({
            coords,
            color,
            delay
        })
    }

    disturbAll() {
        // this.thoughts.forEach(thought => {
        //     this.moveThought({
        //         thought,
        //         delay: Math.random() * 10.0 / this.speed
        //     })
        // })
    }

    pickRandomCoords() {
        if (!this.coordsKeys.length) return null

        const coordsStr = vectors.choice(this.coordsKeys)
        return coordsStr.split(',').map(x => parseInt(x))
    }

    getCoordsColor(coords) {
        const coordsStr = coords.map(x => x.toString()).join(',')
        // console.log(coordsStr)
        const coordsData = this.coordsData[coordsStr]
        if (!coordsData) return Color.random()
        return coordsData.color
    }
}
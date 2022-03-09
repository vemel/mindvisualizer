import * as vectors from "./vectors.js";
import Thought from "./thought.js";
import Color from "./color.js";
import Coords from "./coords.js";
export default class FrontCanvas {
    constructor({ speed = 1.0, demo = false }) {
        this.maxThoughts = 5000;
        this.canvas = document.getElementById("front");
        this.context = this.canvas.getContext("2d");
        this.created = new Date();
        this.coordsUpdated = new Date();
        this.thoughts = [];
        this.speed = speed;
        this.demo = demo;
        this.coordsData = new Map();
        this.coordsKeys = [];
    }
    init() {
        this.canvas.height =
            (window.innerHeight * this.canvas.width) / window.innerWidth;
    }
    createThought(position) {
        const thought = new Thought({
            position,
            speed: (15.0 + Math.random() * 10.0) * this.speed,
        });
        this.thoughts.push(thought);
        this.moveThought({
            thought,
            delay: 1.0 / this.speed,
        });
        return thought;
    }
    getCursorPosition({ clientX, clientY, }) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(((clientX - rect.left) / window.innerWidth) * this.canvas.width);
        const y = Math.floor(((clientY - rect.top) / window.innerHeight) * this.canvas.height);
        return new Coords(x, y);
    }
    generateThoughts({ event, chance, particles = 10, }) {
        const clickPosition = this.getCursorPosition(event);
        for (let i = 0; i < particles; i++) {
            if (Math.random() > chance)
                continue;
            const radius = 10 * Math.random();
            const angle = Math.PI * Math.random();
            const position = new Coords(Math.floor(clickPosition.x + radius * Math.sin(angle)), Math.floor(clickPosition.y + radius * Math.cos(angle)));
            this.createThought(position);
        }
    }
    killOldest() {
        if (this.thoughts.length < this.maxThoughts)
            return;
        this.thoughts
            .slice(0, this.thoughts.length - this.maxThoughts)
            .forEach((thought) => {
            if (!thought.isDying())
                thought.die();
        });
    }
    disturbThoughts(event) {
        const radius = 50.0;
        const clickPosition = this.getCursorPosition(event);
        this.thoughts.forEach((thought) => {
            if (thought.position.distance(clickPosition) < radius) {
                this.moveThought({
                    thought,
                    delay: 0.0,
                });
            }
        });
    }
    updateThought(thought) {
        if (thought.isDead()) {
            this.thoughts.splice(this.thoughts.indexOf(thought), 1);
            return;
        }
        if (this.shouldMove(thought))
            this.moveThought({
                thought,
                delay: 0.0,
            });
        thought.update();
        thought.draw(this.context);
    }
    shouldMove(thought) {
        if (Math.random() < 0.001)
            return true;
        if (thought.started > this.coordsUpdated)
            return false;
        return Math.random() < 0.03;
    }
    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.killOldest();
        if (this.demo)
            this.updateDemo();
        for (const thought of this.thoughts) {
            this.updateThought(thought);
        }
    }
    registerEventListeners() {
        let isDrawing = false;
        const _this = this;
        this.canvas.addEventListener("mousedown", function (event) {
            isDrawing = true;
            _this.disturbThoughts(event);
            _this.generateThoughts({
                event,
                chance: 0.5,
                particles: Math.floor(10 * _this.speed),
            });
        });
        this.canvas.addEventListener("mouseup", function () {
            isDrawing = false;
        });
        this.canvas.addEventListener("mousemove", function (event) {
            if (!isDrawing)
                return;
            _this.generateThoughts({
                event,
                chance: 0.03,
                particles: Math.floor(10 * _this.speed),
            });
        });
        this.canvas.addEventListener("touchstart", function (event) {
            for (const touchEvent of event.changedTouches) {
                _this.disturbThoughts(touchEvent);
                _this.generateThoughts({
                    event: touchEvent,
                    chance: 0.5,
                    particles: Math.floor(10 * _this.speed),
                });
            }
        });
        this.canvas.addEventListener("touchmove", (event) => {
            for (const touchEvent of event.changedTouches) {
                _this.generateThoughts({
                    event: touchEvent,
                    chance: 0.03,
                    particles: Math.floor(10 * _this.speed),
                });
            }
        }, false);
    }
    updateDemo() {
        // if (this.thoughts.length >= this.maxThoughts) return;
        const center = new Coords(window.innerWidth / 2, window.innerHeight / 2);
        const start = new Coords(window.innerWidth / 2 - window.innerHeight * 0.4, window.innerHeight / 2);
        const angle = ((Date.now() - this.created.getTime()) / 1000) * Math.PI;
        const emitter = start.rotate(center, angle);
        this.generateThoughts({
            event: {
                clientX: emitter.x,
                clientY: emitter.y,
            },
            chance: this.speed / 20,
            particles: 10,
        });
    }
    setCoordsData(coordsData) {
        this.coordsData.clear();
        for (const data of coordsData.values()) {
            const localCoords = new Coords(data.coords.x * this.canvas.width, data.coords.y * this.canvas.height);
            this.coordsData.set(localCoords.toString(), data);
        }
        this.coordsKeys = [...this.coordsData.keys()];
        this.coordsUpdated = new Date();
    }
    moveThought({ thought, delay }) {
        const coordsKey = this.pickRandomCoordsKey();
        if (!coordsKey)
            return;
        const coords = new Coords(0, 0).fromString(coordsKey);
        const color = this.getCoordsColor(coordsKey);
        thought.move({
            coords,
            color,
            delay,
        });
    }
    pickRandomCoordsKey() {
        if (!this.coordsKeys.length)
            return null;
        return vectors.choice(this.coordsKeys);
    }
    getCoordsColor(coordsKey) {
        const coordsData = this.coordsData.get(coordsKey);
        if (!coordsData)
            return new Color().random();
        return coordsData.color;
    }
}

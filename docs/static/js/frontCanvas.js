import { choice } from './utils.js';
import Thought from './thought.js';
import Color from './color.js';
import Coords from './coords.js';
import Timer from './timer.js';
export default class FrontCanvas extends Timer {
    constructor(options) {
        super(true);
        this.canvas = document.getElementById('front');
        this.context = this.canvas.getContext('2d');
        this.thoughts = [];
        this.coordsData = [];
        this.emitterCoords = new Map();
        this.options = options;
        this.timers.set('coordsUpdated', new Timer(false));
    }
    init() {
        this.canvas.height =
            (window.innerHeight * this.canvas.width) / window.innerWidth;
    }
    createThought(position) {
        const thought = new Thought(position, 15.0 + Math.random() * 10.0);
        this.thoughts.push(thought);
        this.moveThought(thought, 1.0);
        thought.start.color = thought.end.color;
        return thought;
    }
    getCursorPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(((event.clientX - rect.left) / window.innerWidth) * this.canvas.width);
        const y = Math.floor(((event.clientY - rect.top) / window.innerHeight) * this.canvas.height);
        return new Coords(x, y);
    }
    generateThoughts({ coords, chance, particles, }) {
        for (let i = 0; i < particles; i++) {
            if (Math.random() > chance)
                continue;
            const radius = 30 * Math.random();
            const angle = 2 * Math.PI * Math.random();
            const position = new Coords(Math.floor(coords.x + radius * Math.sin(angle)), Math.floor(coords.y + radius * Math.cos(angle)));
            this.createThought(position);
        }
    }
    get maxThoughts() {
        return this.options.params.maxThoughts.get();
    }
    killOldest() {
        if (this.thoughts.length < this.maxThoughts)
            return;
        this.thoughts
            .slice(0, this.thoughts.length - this.maxThoughts)
            .filter((thought) => !thought.isDying())
            .forEach((thought) => thought.die());
    }
    disturbThoughts(coords) {
        const radius = 50.0;
        this.thoughts.forEach((thought) => {
            if (thought.position.distance(coords) < radius) {
                this.moveThought(thought);
            }
        });
    }
    updateThought(thought, dt) {
        if (thought.isDead()) {
            this.thoughts.splice(this.thoughts.indexOf(thought), 1);
            return;
        }
        if (this.shouldMove(thought))
            this.moveThought(thought, 5.0);
        thought.update(dt);
    }
    drawThoughts(dt) {
        if (dt < 0.0001)
            return;
        const alpha = Math.min(4.0 * dt, 1.0);
        const thoughtAlpha = Math.min(12.0 * dt, 1.0);
        this.context.fillStyle = new Color(0, 0, 0, alpha).toRGBA();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (const thought of this.thoughts) {
            thought.draw(this.context, thoughtAlpha);
        }
    }
    shouldMove(thought) {
        if (thought.getTimer('started').value > this.getTimer('coordsUpdated').value)
            return this.dt / 4 > Math.random();
        if (thought.getTimer('started').value > thought.random * 1200.0)
            return true;
        if (thought.getTimer('ended').value > thought.random * 120.0)
            return true;
        return false;
    }
    update(dt) {
        if (!super.update(dt))
            return false;
        this.killOldest();
        this.updateDemo();
        this.updateEmitters();
        for (const thought of this.thoughts) {
            this.updateThought(thought, dt);
        }
        return true;
    }
    updateEmitters() {
        for (const coords of this.emitterCoords.values()) {
            this.generateThoughts({
                coords,
                chance: 0.2,
                particles: this.dt * 200,
            });
        }
    }
    scaleCoords(coords, newHeight, oldHeight) {
        const yOffset = coords.y - oldHeight / 2;
        return new Coords(coords.x, newHeight / 2 + yOffset);
    }
    registerEventListeners() {
        window.addEventListener('resize', () => {
            const newHeight = (window.innerHeight * this.canvas.width) / window.innerWidth;
            const oldHeight = this.canvas.height;
            this.thoughts.forEach((thought) => {
                thought.start.coords = this.scaleCoords(thought.start.coords, newHeight, oldHeight);
                thought.end.coords = this.scaleCoords(thought.end.coords, newHeight, oldHeight);
                thought.position = this.scaleCoords(thought.position, newHeight, oldHeight);
            });
            this.canvas.height = newHeight;
        });
        this.canvas.addEventListener('mousedown', (event) => {
            const coords = this.getCursorPosition(event);
            this.disturbThoughts(coords);
            this.emitterCoords.set('mouse', coords);
        });
        this.canvas.addEventListener('mouseup', () => {
            this.emitterCoords.delete('mouse');
        });
        this.canvas.addEventListener('mousemove', (event) => {
            if (!this.emitterCoords.has('mouse'))
                return;
            const coords = this.getCursorPosition(event);
            this.emitterCoords.set('mouse', coords);
        });
        this.canvas.addEventListener('touchstart', (event) => {
            for (const touchEvent of event.changedTouches) {
                const key = `touch${touchEvent.identifier}`;
                const coords = this.getCursorPosition(touchEvent);
                this.disturbThoughts(coords);
                this.emitterCoords.set(key, coords);
            }
        });
        this.canvas.addEventListener('touchmove', (event) => {
            for (const touchEvent of event.changedTouches) {
                const key = `touch${touchEvent.identifier}`;
                const coords = this.getCursorPosition(touchEvent);
                this.emitterCoords.set(key, coords);
            }
        });
        this.canvas.addEventListener('touchend', (event) => {
            for (const touchEvent of event.changedTouches) {
                const key = `touch${touchEvent.identifier}`;
                this.emitterCoords.delete(key);
            }
        });
    }
    updateDemo() {
        if (!this.options.params.demo.get()) {
            this.emitterCoords.delete('demo');
            return;
        }
        // if (this.thoughts.length >= this.maxThoughts) return;
        const center = new Coords(this.canvas.width / 2, this.canvas.height / 2);
        const radius = Math.min(this.canvas.height, this.canvas.width) * 0.4;
        const start = new Coords(window.innerWidth / 2 - radius, window.innerHeight / 2);
        const angle = (this.value / 5) * Math.PI;
        const coords = start.rotate(center, angle);
        this.emitterCoords.set('demo', coords);
    }
    setCoordsData(coordsData) {
        this.coordsData = coordsData;
        this.getTimer('coordsUpdated').startTimer();
    }
    getRandomCoordsData() {
        if (!this.coordsData.length) {
            return {
                color: new Color().random(),
                coords: new Coords(Math.random(), Math.random()),
            };
        }
        const { color, coords } = choice(this.coordsData);
        return {
            color: new Color(...color),
            coords: new Coords(...coords),
        };
    }
    moveThought(thought, delay = 0.0) {
        const coordsData = this.getRandomCoordsData();
        const localCoords = new Coords(coordsData.coords.x * this.canvas.width, coordsData.coords.y * this.canvas.height);
        thought.move({
            coords: localCoords,
            color: coordsData.color,
            delay: delay * thought.random,
        });
    }
}

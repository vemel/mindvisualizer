import { randInt, sum } from "./vectors.js";
import Color from "./color.js";
import Coords from "./coords.js";
export default class BackCanvas {
    constructor() {
        this.font = "Calibri";
        this.canvas = document.getElementById("back");
        this.context = this.canvas.getContext("2d");
    }
    getFontSize(lines) {
        let fontSize = 100;
        while (fontSize > 23) {
            this.context.font = `${fontSize}px ${this.font}`;
            const lineFits = lines.every((line) => this.context.measureText(line).width < this.canvas.width - 40);
            if (lineFits)
                break;
            fontSize--;
        }
        return fontSize;
    }
    getTextGradient() {
        const gradient = this.context.createLinearGradient(0, randInt(0, this.canvas.height), this.canvas.width, randInt(0, this.canvas.height));
        gradient.addColorStop(0, `hsl(${randInt(0, 255)}, 100%, 50%)`);
        gradient.addColorStop(0.4, `hsl(${randInt(0, 255)}, 100%, 50%)`);
        gradient.addColorStop(0.5, `hsl(${randInt(0, 255)}, 100%, 50%)`);
        gradient.addColorStop(0.6, `hsl(${randInt(0, 255)}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${randInt(0, 255)}, 100%, 50%)`);
        return gradient;
    }
    drawText(text) {
        this.context.textAlign = "center";
        const lines = text.split(",");
        console.log("Rendering", lines);
        this.context.fillStyle = this.getTextGradient();
        this.context.font = `${this.getFontSize(lines)}px ${this.font}`;
        const lineHeights = lines.map((line) => Math.floor(this.context.measureText(line).actualBoundingBoxAscent * 1.3));
        lines.forEach((line, index) => {
            this.context.fillText(line, this.canvas.width / 2, this.canvas.height / 2 +
                lineHeights[index] -
                sum(lineHeights) / 2 +
                sum(lineHeights.slice(0, index)));
        });
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    getCoords() {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const result = new Map();
        for (let i = 0; i < data.length; i += 4) {
            const coords = new Coords(((i / 4) % this.canvas.width) / this.canvas.width, i / 4 / this.canvas.width / this.canvas.height);
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const alpha = data[i + 3];
            const color = new Color(...data.slice(i, i + 4));
            if (color.isTransparent())
                continue;
            result.set(coords.toString(), {
                coords,
                color: new Color(red, green, blue, alpha),
            });
        }
        return result;
    }
}

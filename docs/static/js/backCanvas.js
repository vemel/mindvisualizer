import { randInt, sum } from "./vectors.js";
import Color from "./color.js";
import Coords from "./coords.js";
export default class BackCanvas {
    constructor() {
        this.font = "Ubuntu";
        this.lineHeight = 1.5;
        this.canvas = document.getElementById("back");
        this.context = this.canvas.getContext("2d");
    }
    getFontSize(lines) {
        let fontSize = 200;
        while (fontSize > 23) {
            this.context.font = `bold ${fontSize}px ${this.font}`;
            const lineMeasures = lines.map((line) => this.context.measureText(line));
            const lineFitsHor = lineMeasures.every((lineMeasure) => lineMeasure.width < this.canvas.width - 40);
            const totalHeight = sum(lineMeasures.map((lineMeasure) => lineMeasure.actualBoundingBoxAscent * this.lineHeight));
            const lineFitsVer = totalHeight < this.canvas.height - 60;
            if (lineFitsHor && lineFitsVer)
                break;
            fontSize -= 2;
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
        this.context.font = `bold ${this.getFontSize(lines)}px ${this.font}`;
        const lineHeights = lines.map((line) => Math.floor(this.context.measureText(line).actualBoundingBoxAscent * this.lineHeight));
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
            const color = new Color(...data.slice(i, i + 3), data[i + 3] / 255.0);
            if (color.isTransparent())
                continue;
            result.set(coords.toString(), {
                localCoords: new Coords(coords.x * this.canvas.width, coords.y * this.canvas.height),
                coords,
                color,
            });
        }
        return result;
    }
}

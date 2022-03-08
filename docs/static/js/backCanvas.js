export default class BackCanvas {
    font = 'Calibri'

    constructor() {
        this.canvas = document.getElementById('back')
        this.context = this.canvas.getContext('2d')
    }

    getFontSize(lines) {
        let fontSize = 100
        while (fontSize > 23) {
            this.context.font = `bold ${fontSize}px ${this.font}`;
            const lineFits = lines.every(line => this.context.measureText(line).width < this.canvas.width - 40)
            if (lineFits) break
            fontSize--
        }
        return fontSize
    }

    drawText(text) {
        this.context.textAlign = "center"
        const lines = text.split(',')
        this.context.font = `bold ${this.getFontSize(lines)}px ${this.font}`
        const lineMeasures = this.context.measureText(text)
        const lineHeight = lineMeasures.fontBoundingBoxAscent

        lines.forEach((line, index) => {
            this.context.fillText(
                line,
                this.canvas.width / 2,
                this.canvas.height / 2 + lineHeight - lines.length * lineHeight / 2 + index * lineHeight
            );
        })
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    getCoords(frontCanvas) {
        const imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
        const data = imgData.data
        const result = {}
        for (let i = 0; i < data.length; i += 4) {
            const coords = [
                Math.floor((i / 4) % this.canvas.width / this.canvas.width * frontCanvas.width),
                Math.floor((i / 4) / this.canvas.width / this.canvas.height * frontCanvas.height),
            ]
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            const alpha = data[i + 3];
            if (!alpha) continue;
            result[`${coords[0]},${coords[1]}`] = {
                free: true,
                color: [red, green, blue],
                isBlack: red == green && green == blue && red < 10
            }
        }
        return result
    }
}
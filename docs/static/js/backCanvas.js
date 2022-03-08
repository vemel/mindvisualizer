export default class BackCanvas {
    font = 'Calibri'

    constructor() {
        this.canvas = document.getElementById('back')
        this.context = this.canvas.getContext('2d')
    }

    drawText(text, canvas) {
        this.context.textAlign = "center"
        let fontsize = 100
        do {
            fontsize--;
            this.context.font = `bold ${fontsize}px ${this.font}`;
        } while (this.context.measureText(text).width > this.canvas.width - 40)

        this.context.fillText(
            text,
            this.canvas.width / 2,
            this.canvas.height / 2 + this.context.measureText(text).fontBoundingBoxAscent / 2
        );
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
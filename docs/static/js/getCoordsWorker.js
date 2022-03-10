self.onmessage = (message) => {
    const { imageData, width, height } = message.data;
    const data = imageData.data;
    const result = [];
    for (let i = 0; i < data.length; i += 4) {
        const coords = [
            ((i / 4) % width) / width,
            i / 4 / width / height
        ];
        const color = [...data.slice(i, i + 3), data[i + 3] / 255.0];
        if (color[3] < 0.0001)
            continue;
        result.push({
            coords,
            color,
        });
    }
    console.log(result.length);
    postMessage(result);
};

interface IRawCoordsData {
  coords: [number, number];
  color: [number, number, number, number];
}

self.onmessage = (message: any): void => {
  const { imageData, width, height }: { imageData: ImageData; width: number; height: number } = message.data;
  const data = imageData.data;
  const result: Array<IRawCoordsData> = [];
  for (let i = 0; i < data.length; i += 4) {
    const coords = [
      ((i / 4) % width) / width,
      i / 4 / width / height
    ] as [number, number];
    const color = [...data.slice(i, i + 3), data[i + 3] / 255.0] as [number, number, number, number];
    if (color[3] < 0.0001) continue;
    result.push({
      coords,
      color,
    });
  }
  console.log(result.length)
  postMessage(result);
}

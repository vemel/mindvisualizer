# Mind Visualizer

Just a regular mind visualizer, you know. I dunno what to add.
Use your mouse or fingers to visualize your thoughts.

[Live Demo](https://vemel.github.io/mindvisualizer/)

## Usage

Query parameters:

- `q` - Output text, dot-separated
- `bq` - Base64-encoded output text
- `speed` - Speed of visualization, float
- `shuffle` - Switch to next text line, `true/false`
- `random` - Randomize next text line, `true/false`
- `demo` - Generate thoughts automatically
- `ui` - Show header and reset button, `true/false`

Set `q` to one of these values for predefined texts:

- `demo` - Random stuff
- `emoji` - Emoji pairs and triplets

## Development

```bash
npm install
npm run start
```

import express from 'express';
import path from 'path';

const app = express();
const PORT = 8089;
const ROOT_PATH = path.resolve(path.dirname(''));
const STATIC_PATH = path.join(ROOT_PATH, 'docs', 'static');
console.log(ROOT_PATH)

app.get('/', function(req, res) {
    res.sendFile(path.join(ROOT_PATH, 'docs', 'index.html'));
});

app.use('/static', express.static(STATIC_PATH))

app.listen(PORT);
console.log('Server started at http://localhost:' + PORT);

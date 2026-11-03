const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = 3456;
const PUBLIC_DIR = path.join(__dirname, '..', 'src');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';
    const filePath = path.join(PUBLIC_DIR, reqUrl);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, async () => {
    console.log(`Server listening on ${PORT}`);
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const outCeldas = path.join(__dirname, '..', 'docs', 'mockups', '7_gestion_celdas.png');
    const outUsuarios = path.join(__dirname, '..', 'docs', 'mockups', '5_gestion_usuarios.png');

    const runChrome = (url, outFile) => new Promise((resolve, reject) => {
        const args = [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            '--window-size=1400,900',
            `--screenshot=${outFile}`,
            url
        ];
        execFile(chromePath, args, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });

    try {
        console.log('Capturando celdas...');
        await runChrome(`http://localhost:${PORT}/celdas.html`, outCeldas);
        console.log('Celdas capturado exitosamente!');

        console.log('Capturando usuarios...');
        await runChrome(`http://localhost:${PORT}/usuarios.html`, outUsuarios);
        console.log('Usuarios capturado exitosamente!');
    } catch (e) {
        console.error('Error al capturar:', e.message);
    } finally {
        server.close();
        process.exit(0);
    }
});

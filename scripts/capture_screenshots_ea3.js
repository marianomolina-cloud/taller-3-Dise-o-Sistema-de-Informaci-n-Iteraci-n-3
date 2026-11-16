const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = 3457;
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

    const mockupsDir = path.join(__dirname, '..', 'docs', 'mockups');
    if (!fs.existsSync(mockupsDir)) {
        fs.mkdirSync(mockupsDir, { recursive: true });
    }

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
        console.log('Capturando 8_gestion_pagos.png...');
        await runChrome(`http://localhost:${PORT}/pagos.html`, path.join(mockupsDir, '8_gestion_pagos.png'));

        console.log('Capturando 9_registro_pago.png...');
        await runChrome(`http://localhost:${PORT}/pagos.html?view=modal`, path.join(mockupsDir, '9_registro_pago.png'));

        console.log('Capturando 10_recibo_digital.png...');
        await runChrome(`http://localhost:${PORT}/pagos.html?view=recibo`, path.join(mockupsDir, '10_recibo_digital.png'));

        console.log('Capturando 11_cartera_morosos.png...');
        await runChrome(`http://localhost:${PORT}/pagos.html?view=morosos`, path.join(mockupsDir, '11_cartera_morosos.png'));

        console.log('Capturando 12_tarifas_mensualidad.png...');
        await runChrome(`http://localhost:${PORT}/pagos.html?view=tarifas`, path.join(mockupsDir, '12_tarifas_mensualidad.png'));

        console.log('¡Todos los mockups de pagos capturados exitosamente!');
    } catch (e) {
        console.error('Error al capturar mockups:', e.message);
    } finally {
        server.close();
        process.exit(0);
    }
});

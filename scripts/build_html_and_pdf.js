const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const mdPath = path.join(__dirname, '..', 'MOLINA_MARIANO_EA2.md');
const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Convertidor básico de Markdown a HTML optimizado para reporte ejecutivo PDF
function markdownToHtml(md) {
    let html = md;

    // Escapar etiquetas si es necesario, pero conservar estructura
    // Títulos
    html = html.replace(/^# (.*$)/gim, '<h1 class="doc-h1">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="doc-h2">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="doc-h3">$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4 class="doc-h4">$1</h4>');

    // Negrita y cursiva
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Citas / Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

    // Regla horizontal
    html = html.replace(/^---$/gim, '<hr class="section-divider">');

    // Bloques de código Mermaid
    html = html.replace(/```mermaid([\s\S]*?)```/gim, (match, p1) => {
        return `<div class="mermaid-container"><div class="mermaid">\n${p1.trim()}\n</div></div>`;
    });

    // Bloques de código estándar
    html = html.replace(/```([a-z]*)([\s\S]*?)```/gim, (match, lang, code) => {
        return `<pre class="code-block"><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Código en línea
    html = html.replace(/`([^`]+)`/gim, '<code class="inline-code">$1</code>');

    // Tablas
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    let newLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableHtml = '<div class="table-responsive"><table class="styled-table">';
                // Header
                const ths = line.split('|').filter(c => c.trim().length > 0);
                tableHtml += '<thead><tr>' + ths.map(th => `<th>${th.trim()}</th>`).join('') + '</tr></thead><tbody>';
                i++; // Skip delimiter line (|-...-|)
            } else {
                const tds = line.split('|').filter(c => c !== '');
                tableHtml += '<tr>' + tds.map(td => {
                    let text = td.trim();
                    if (text === 'PASÓ') text = '<span class="badge badge-success">PASÓ</span>';
                    else if (text === 'FALLÓ') text = '<span class="badge badge-danger">FALLÓ</span>';
                    else if (text === 'ACTIVO' || text === 'Al Día' || text === 'LIBRE') text = `<span class="badge badge-success">${text}</span>`;
                    else if (text === 'SUSPENDIDO' || text === 'En Mora' || text === 'OCUPADA') text = `<span class="badge badge-danger">${text}</span>`;
                    else if (text === 'Inhabilitada') text = `<span class="badge badge-neutral">${text}</span>`;
                    return `<td>${text}</td>`;
                }).join('') + '</tr>';
            }
        } else {
            if (inTable) {
                tableHtml += '</tbody></table></div>';
                newLines.push(tableHtml);
                inTable = false;
                tableHtml = '';
            }
            newLines.push(lines[i]);
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        newLines.push(tableHtml);
    }

    html = newLines.join('\n');

    // Párrafos
    html = html.split('\n\n').map(p => {
        p = p.trim();
        if (!p) return '';
        if (p.startsWith('<h') || p.startsWith('<div') || p.startsWith('<hr') || p.startsWith('<blockquote') || p.startsWith('<pre') || p.startsWith('<ul') || p.startsWith('<ol')) {
            return p;
        }
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

const bodyHtml = markdownToHtml(mdContent);

// Rutas de imágenes base64 para embeber en el documento
const imgMockupUsersPath = path.join(__dirname, '..', 'docs', 'mockups', '5_gestion_usuarios.png');
const imgMockupCeldasPath = path.join(__dirname, '..', 'docs', 'mockups', '7_gestion_celdas.png');

let imgUsersBase64 = '';
let imgCeldasBase64 = '';

if (fs.existsSync(imgMockupUsersPath)) {
    imgUsersBase64 = 'data:image/png;base64,' + fs.readFileSync(imgMockupUsersPath).toString('base64');
}
if (fs.existsSync(imgMockupCeldasPath)) {
    imgCeldasBase64 = 'data:image/png;base64,' + fs.readFileSync(imgMockupCeldasPath).toString('base64');
}

// Inyectar imágenes reales en las secciones de mockups
let finalBody = bodyHtml.replace(
    /docs\/mockups\/5_gestion_usuarios\.png/g,
    `<div class="mockup-img-wrap"><img src="${imgUsersBase64}" alt="Mockup Gestión de Usuarios" class="mockup-img"><div class="caption">Figura 1: Interfaz interactiva de Gestión de Usuarios y Clientes (Iteración 2)</div></div>`
);

finalBody = finalBody.replace(
    /docs\/mockups\/7_gestion_celdas\.png/g,
    `<div class="mockup-img-wrap"><img src="${imgCeldasBase64}" alt="Mockup Gestión de Celdas" class="mockup-img"><div class="caption">Figura 2: Interfaz interactiva de Gestión de Celdas y Mapa del Parqueadero (Iteración 2)</div></div>`
);

const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Molina_Mariano_EA2</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {
                content: counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 9pt;
                color: #64748b;
            }
        }

        *, *:before, *:after {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #1e293b;
            background: #ffffff;
            line-height: 1.55;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        /* PORTADA */
        .cover-page {
            height: 98vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
            padding: 2.5rem 2rem;
            border: 2px solid #0f172a;
            border-radius: 8px;
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
        }

        .cover-header {
            text-align: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 1.5rem;
        }

        .cover-header h1 {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 0.5rem 0;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .cover-header h2 {
            font-size: 12pt;
            font-weight: 600;
            color: #0284c7;
            margin: 0;
        }

        .cover-body {
            text-align: center;
            margin: auto 0;
        }

        .cover-badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            padding: 0.4rem 1.2rem;
            border-radius: 9999px;
            font-size: 10pt;
            font-weight: 700;
            margin-bottom: 1.5rem;
            text-transform: uppercase;
        }

        .cover-title {
            font-size: 22pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.25;
            margin-bottom: 1rem;
        }

        .cover-subtitle {
            font-size: 13pt;
            font-weight: 500;
            color: #475569;
            margin-bottom: 2rem;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 1.5rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            font-size: 9.5pt;
        }

        .cover-footer-left { text-align: left; }
        .cover-footer-right { text-align: right; }

        /* TITULOS */
        h1.doc-h1 {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #0284c7;
            padding-bottom: 0.4rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            page-break-before: always;
        }

        .cover-page + h1.doc-h1 {
            page-break-before: avoid;
        }

        h2.doc-h2 {
            font-size: 13pt;
            font-weight: 700;
            color: #0369a1;
            margin-top: 1.5rem;
            margin-bottom: 0.6rem;
            border-left: 4px solid #0284c7;
            padding-left: 0.5rem;
        }

        h3.doc-h3 {
            font-size: 11pt;
            font-weight: 600;
            color: #0f172a;
            margin-top: 1.2rem;
            margin-bottom: 0.4rem;
        }

        h4.doc-h4 {
            font-size: 10pt;
            font-weight: 600;
            color: #334155;
            margin-top: 0.8rem;
            margin-bottom: 0.3rem;
        }

        p {
            margin-bottom: 0.75rem;
            text-align: justify;
        }

        blockquote {
            background: #f1f5f9;
            border-left: 4px solid #0284c7;
            margin: 0.8rem 0;
            padding: 0.6rem 1rem;
            color: #334155;
            font-style: italic;
            border-radius: 0 4px 4px 0;
        }

        hr.section-divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 1.5rem 0;
        }

        /* TABLAS ESTILIZADAS */
        .table-responsive {
            width: 100%;
            margin: 1rem 0;
            overflow-x: auto;
        }

        .styled-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5pt;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            page-break-inside: avoid;
        }

        .styled-table th {
            background: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 6px 8px;
            border: 1px solid #1e293b;
        }

        .styled-table td {
            padding: 6px 8px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }

        .styled-table tr:nth-child(even) td {
            background: #f8fafc;
        }

        /* BADGES */
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
        .badge-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
        .badge-warning { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
        .badge-neutral { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }

        /* CODIGO */
        code.inline-code {
            background: #f1f5f9;
            color: #0284c7;
            padding: 1px 4px;
            border-radius: 3px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8.5pt;
        }

        pre.code-block {
            background: #0f172a;
            color: #f8fafc;
            padding: 0.8rem;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8pt;
            overflow-x: auto;
            page-break-inside: avoid;
        }

        /* MOCKUPS E IMAGENES */
        .mockup-img-wrap {
            margin: 1.2rem 0;
            text-align: center;
            page-break-inside: avoid;
        }

        .mockup-img {
            max-width: 95%;
            height: auto;
            border-radius: 6px;
            border: 1px solid #cbd5e1;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        .caption {
            font-size: 8.5pt;
            color: #64748b;
            font-style: italic;
            margin-top: 0.4rem;
        }

        /* MERMAID */
        .mermaid-container {
            margin: 1rem 0;
            text-align: center;
            background: #f8fafc;
            padding: 1rem;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            page-break-inside: avoid;
        }

        .mermaid {
            display: flex;
            justify-content: center;
        }

        /* ALERTA / CALLOUT */
        .callout {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 0.8rem;
            border-radius: 6px;
            margin: 1rem 0;
            font-size: 9pt;
        }
    </style>
</head>
<body>

<div class="cover-page">
    <div class="cover-header">
        <h1>Institución Universitaria Digital de Antioquia</h1>
        <h2>Facultad de Ingeniería – Tecnología en Desarrollo de Software</h2>
    </div>

    <div class="cover-body">
        <span class="cover-badge">Evidencia de Aprendizaje 2 (EA2)</span>
        <div class="cover-title">DISEÑO DEL SISTEMA DE INFORMACIÓN<br>PARQUEADERO "AUTOS COLOMBIA"</div>
        <div class="cover-subtitle">Iteración 2: Gestión de Usuarios y Gestión de Celdas</div>
        <div style="font-size:11pt; color:#334155; font-weight:600;">Asignatura: Ingeniería de Software (PREICA2602B020081)</div>
    </div>

    <div class="cover-footer">
        <div class="cover-footer-left">
            <strong>Estudiante:</strong> Mariano Molina Monsalve<br>
            <strong>Programa:</strong> Tecnología en Desarrollo de Software<br>
            <strong>Modalidad:</strong> Virtual – Campus IU Digital
        </div>
        <div class="cover-footer-right">
            <strong>Docente / Asesor:</strong> Esteban Montoya<br>
            <strong>Fecha de Entrega:</strong> Noviembre 2026<br>
            <strong>Medellín, Antioquia, Colombia</strong>
        </div>
    </div>
</div>

<div class="document-content">
    ${finalBody}
</div>

<script>
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        flowchart: { curve: 'basis', htmlLabels: true },
        sequence: { showSequenceNumbers: true, actorMargin: 50 }
    });
</script>
</body>
</html>`;

const outHtmlPath = path.join(__dirname, '..', 'Molina_Mariano_EA2.html');
fs.writeFileSync(outHtmlPath, fullHtml, 'utf-8');
console.log(`Documento HTML renderizado en: ${outHtmlPath}`);

// Compilar a PDF usando Chrome Headless
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outPdfPath = path.join(__dirname, '..', 'Molina_Mariano_EA2.pdf');

const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=4000',
    `--print-to-pdf=${outPdfPath}`,
    `file:///${outHtmlPath.replace(/\\/g, '/')}`
];

console.log('Generando archivo PDF con Chrome headless...');
execFile(chromePath, args, (err) => {
    if (err) {
        console.error('Error generando PDF:', err.message);
        process.exit(1);
    }
    console.log(`Archivo PDF generado exitosamente en: ${outPdfPath}`);
});

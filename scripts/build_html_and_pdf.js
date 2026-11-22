const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const mdPath = path.join(__dirname, '..', 'MOLINA_MARIANO_EA3.md');
const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Convertidor básico de Markdown a HTML optimizado para reporte ejecutivo PDF
function markdownToHtml(md) {
    let html = md;

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

    // Bloques de código estándar (gherkin, etc.)
    html = html.replace(/```([a-z]*)([\s\S]*?)```/gim, (match, lang, code) => {
        return `<pre class="code-block"><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Código en línea
    html = html.replace(/`([^`]+)`/gim, '<code class="inline-code">$1</code>');

    // Imágenes Markdown ![alt](src) (DEBE IR ANTES DE ENLACES)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<div class="md-img-tag" data-src="$2" data-alt="$1"></div>');

    // Enlaces Markdown [texto](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="doc-link" target="_blank">$1</a>');

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
                i++; // Salta delimitador (|---|)
            } else {
                const tds = line.split('|').filter(c => c !== '');
                tableHtml += '<tr>' + tds.map(td => {
                    let text = td.trim();
                    if (text === 'PASÓ') text = '<span class="badge badge-success">PASÓ</span>';
                    else if (text === 'FALLÓ') text = '<span class="badge badge-danger">FALLÓ</span>';
                    else if (text === 'ACTIVO' || text === 'Al Día' || text === 'LIBRE' || text === 'VIGENTE') text = `<span class="badge badge-success">${text}</span>`;
                    else if (text === 'SUSPENDIDO' || text === 'En Mora' || text === 'OCUPADA' || text === 'VENCIDO') text = `<span class="badge badge-danger">${text}</span>`;
                    else if (text === 'ANULADO') text = `<span class="badge badge-neutral" style="text-decoration:line-through;">${text}</span>`;
                    else if (text === 'Inhabilitada' || text === 'INHABILITADA') text = `<span class="badge badge-neutral">${text}</span>`;
                    else if (text.startsWith('Alta') || text.startsWith('Crítica')) text = `<span class="badge badge-danger">${text}</span>`;
                    else if (text.startsWith('Media')) text = `<span class="badge badge-warning">${text}</span>`;
                    else if (text.startsWith('Baja')) text = `<span class="badge badge-neutral">${text}</span>`;
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

let cleanedMd = mdContent;
const introIndex = cleanedMd.indexOf('# INTRODUCCIÓN');
if (introIndex !== -1) {
    cleanedMd = cleanedMd.substring(introIndex);
}

let finalBody = markdownToHtml(cleanedMd);

// Cargar y embeber mockups en Base64
const mockups = [
    { key: 'docs/mockups/8_gestion_pagos.png', caption: 'Figura 1: Tablero Central de Gestión de Pagos, KPIs de Recaudación y Transacciones (Iteración 3)' },
    { key: 'docs/mockups/9_registro_pago.png', caption: 'Figura 2: Formulario Modal de Registro de Pago de Mensualidad con Asistente de Caja y Tarifas (Iteración 3)' },
    { key: 'docs/mockups/10_recibo_digital.png', caption: 'Figura 3: Comprobante y Recibo de Pago Digital Oficial con Consecutivo y Membrete Institucional (Iteración 3)' },
    { key: 'docs/mockups/11_cartera_morosos.png', caption: 'Figura 4: Panel de Monitoreo de Cartera y Cobranza a Suscriptores Morosos (Iteración 3)' },
    { key: 'docs/mockups/12_tarifas_mensualidad.png', caption: 'Figura 5: Matriz de Configuración de Tarifas Parametrizadas por Categoría Vehicular (Iteración 3)' }
];

mockups.forEach(m => {
    const fullPath = path.join(__dirname, '..', m.key.replace(/\//g, path.sep));
    if (fs.existsSync(fullPath)) {
        const b64 = 'data:image/png;base64,' + fs.readFileSync(fullPath).toString('base64');
        const pattern = new RegExp(`<div class="md-img-tag" data-src="${m.key}"[^>]*><\\/div>`, 'g');
        finalBody = finalBody.replace(pattern, `
            <div class="mockup-img-wrap">
                <img src="${b64}" alt="${m.caption}" class="mockup-img">
                <div class="caption">${m.caption}</div>
            </div>
        `);
    }
});

// Cargar y embeber diagramas UML en Base64
const diagramDefs = [
    { file: 'diagrama_casos_de_uso_pagos.png', caption: 'Figura 6: Diagrama de Casos de Uso - Subsistema de Pagos (Modelado en StarUML)' },
    { file: 'diagrama_casos_de_uso.png', caption: 'Figura 7: Diagrama de Casos de Uso Global Integrado - Iteraciones 1, 2 y 3 (Modelado en StarUML)' },
    { file: 'secuencia_1_entrada_vehiculo.png', caption: 'Figura 8: Diagrama de Secuencia 1 - Registrar Entrada de Vehículo con Validación de Pago (Modelado en StarUML)' },
    { file: 'secuencia_2_salida_vehiculo.png', caption: 'Figura 9: Diagrama de Secuencia 2 - Registrar Salida de Vehículo y Liberación de Celda (Modelado en StarUML)' },
    { file: 'secuencia_3_gestion_usuarios.png', caption: 'Figura 10: Diagrama de Secuencia 3 - Gestión de Suscriptores y Vinculación Vehicular (Modelado en StarUML)' },
    { file: 'secuencia_4_mantenimiento_celdas.png', caption: 'Figura 11: Diagrama de Secuencia 4 - Mantenimiento e Inhabilitación de Celdas (Modelado en StarUML)' },
    { file: 'secuencia_5_registro_pago.png', caption: 'Figura 12: Diagrama de Secuencia 5 - Registro de Pago y Emisión de Recibo Digital (Modelado en StarUML)' },
    { file: 'secuencia_6_validacion_acceso_pago.png', caption: 'Figura 13: Diagrama de Secuencia 6 - Validación Transaccional de Pago en Garita de Acceso (Modelado en StarUML)' },
    { file: 'diagrama_componentes.png', caption: 'Figura 14: Diagrama de Componentes Integral - Arquitectura en 3 Capas (Modelado en StarUML)' }
];

// Reemplazar contenedores mermaid o imágenes por diagramas renderizados
diagramDefs.forEach(d => {
    const imgPath = path.join(__dirname, '..', 'docs', 'diagramas', d.file);
    if (fs.existsSync(imgPath)) {
        const b64 = 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');
        const pattern = new RegExp(`<div class="md-img-tag" data-src="docs/diagramas/${d.file}"[^>]*><\\/div>`, 'g');
        finalBody = finalBody.replace(pattern, `
            <div class="mockup-img-wrap">
                <img src="${b64}" alt="${d.caption}" class="mockup-img" style="max-height:550px;">
                <div class="caption">${d.caption}</div>
            </div>
        `);
    }
});

// Reemplazar mermaid-container sobrantes si quedaron
let dIdx = 0;
finalBody = finalBody.replace(/<div class="mermaid-container">[\s\S]*?<\/div><\/div>/gim, () => {
    if (dIdx < diagramDefs.length) {
        const d = diagramDefs[dIdx++];
        const imgPath = path.join(__dirname, '..', 'docs', 'diagramas', d.file);
        if (fs.existsSync(imgPath)) {
            const b64 = 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');
            return `<div class="mockup-img-wrap"><img src="${b64}" alt="${d.caption}" class="mockup-img" style="max-height:550px;"><div class="caption">${d.caption}</div></div>`;
        }
    }
    return '';
});

const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Molina_Mariano_EA3</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        @page {
            size: letter;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {
                content: "Página " counter(page);
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
            @bottom-left {
                content: "Parqueadero Autos Colombia – EA3: Gestión de Pagos";
                font-family: 'Inter', sans-serif;
                font-size: 8pt;
                color: #64748b;
            }
        }

        *, *::before, *::after {
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background-color: #ffffff;
            line-height: 1.6;
            font-size: 10pt;
            margin: 0;
            padding: 0;
        }

        /* PORTADA EDITORIAL */
        .cover-page {
            height: 100vh;
            min-height: 850px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px;
            border: 2px solid #e2e8f0;
            background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
            page-break-after: always;
            position: relative;
        }

        .cover-page::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 100%;
            background: linear-gradient(180deg, #1d4ed8 0%, #2563eb 50%, #38bdf8 100%);
        }

        .cover-header {
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
        }

        .cover-header h1 {
            font-size: 16pt;
            font-weight: 800;
            color: #1e3a8a;
            margin: 0 0 6px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .cover-header h2 {
            font-size: 11pt;
            font-weight: 500;
            color: #475569;
            margin: 0;
        }

        .cover-body {
            margin: auto 0;
        }

        .cover-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1d4ed8;
            font-size: 9pt;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 9999px;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .cover-title {
            font-size: 26pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin: 0 0 12px 0;
        }

        .cover-subtitle {
            font-size: 15pt;
            font-weight: 600;
            color: #2563eb;
            margin: 0 0 24px 0;
        }

        .cover-footer {
            border-top: 1px solid #cbd5e1;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 9.5pt;
            color: #475569;
            line-height: 1.5;
        }

        .cover-footer strong {
            color: #1e293b;
        }

        /* CONTENIDO DEL DOCUMENTO */
        .document-content {
            padding: 10px 0;
        }

        h1.doc-h1 {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 6px;
            margin-top: 36px;
            margin-bottom: 18px;
            page-break-after: avoid;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        h2.doc-h2 {
            font-size: 13.5pt;
            font-weight: 700;
            color: #1e3a8a;
            border-left: 4px solid #2563eb;
            padding-left: 10px;
            margin-top: 26px;
            margin-bottom: 12px;
            page-break-after: avoid;
        }

        h3.doc-h3 {
            font-size: 11pt;
            font-weight: 700;
            color: #334155;
            margin-top: 18px;
            margin-bottom: 8px;
            page-break-after: avoid;
        }

        p {
            margin: 0 0 10px 0;
            text-align: justify;
        }

        blockquote {
            margin: 12px 0;
            padding: 10px 16px;
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            color: #334155;
            font-style: italic;
            border-radius: 0 6px 6px 0;
        }

        hr.section-divider {
            border: 0;
            height: 1px;
            background: #e2e8f0;
            margin: 24px 0;
        }

        /* TABLAS ESTILIZADAS */
        .table-responsive {
            margin: 14px 0;
            page-break-inside: avoid;
        }

        .styled-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 8.5pt;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
        }

        .styled-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: 700;
            text-align: left;
            padding: 7px 10px;
            border-bottom: 2px solid #94a3b8;
            font-size: 8.5pt;
        }

        .styled-table td {
            padding: 6px 10px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: middle;
        }

        .styled-table tr:nth-child(even) {
            background-color: #f8fafc;
        }

        /* BADGES */
        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 7.5pt;
            font-weight: 700;
            text-transform: uppercase;
        }

        .badge-success { background-color: #dcfce7; color: #15803d; }
        .badge-danger { background-color: #fee2e2; color: #b91c1c; }
        .badge-warning { background-color: #fef3c7; color: #b45309; }
        .badge-neutral { background-color: #f1f5f9; color: #475569; }

        /* CÓDIGO GHERKIN / BLOQUES */
        .code-block {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 12px 16px;
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8pt;
            line-height: 1.45;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-x: hidden;
            margin: 12px 0;
            page-break-inside: avoid;
            border-left: 4px solid #38bdf8;
        }

        .inline-code {
            background-color: #f1f5f9;
            color: #0284c7;
            padding: 1px 4px;
            border-radius: 3px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 8.5pt;
            font-weight: 600;
        }

        /* IMÁGENES Y MOCKUPS */
        .mockup-img-wrap {
            margin: 16px 0;
            text-align: center;
            page-break-inside: avoid;
            background: #ffffff;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .mockup-img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            border: 1px solid #cbd5e1;
        }

        .caption {
            font-size: 8pt;
            font-weight: 600;
            color: #64748b;
            margin-top: 6px;
        }

        .doc-link {
            color: #2563eb;
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="cover-page">
    <div class="cover-header">
        <h1>Institución Universitaria Digital de Antioquia</h1>
        <h2>Programa Académico: Tecnología en Desarrollo de Software</h2>
    </div>

    <div class="cover-body">
        <span class="cover-badge">Evidencia de Aprendizaje 3 (EA3)</span>
        <div class="cover-title">DISEÑO DEL SISTEMA DE INFORMACIÓN<br>PARQUEADERO "AUTOS COLOMBIA"</div>
        <div class="cover-subtitle">Iteración 3: Gestión de Pagos</div>
        <div style="font-size:11pt; color:#334155; font-weight:600;">Asignatura: Ingeniería de Software – PREICA2602B020081</div>
    </div>

    <div class="cover-footer">
        <div class="cover-footer-left">
            <strong>Estudiante:</strong> Mariano Molina Monsalve<br>
            <strong>Programa Académico:</strong> Tecnología en Desarrollo de Software
        </div>
        <div class="cover-footer-right">
            <strong>Docente / Asesor:</strong> Esteban Montoya<br>
            <strong>Fecha de Presentación:</strong> Noviembre 2026
        </div>
    </div>
</div>

<div class="document-content">
    ${finalBody}
</div>

</body>
</html>`;

const outHtmlPath = path.join(__dirname, '..', 'Molina_Mariano_EA3.html');
fs.writeFileSync(outHtmlPath, fullHtml, 'utf-8');
console.log(`Documento HTML renderizado en: ${outHtmlPath}`);

// Compilar a PDF usando Chrome Headless
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const tempPdfPath = path.join(__dirname, '..', 'Molina_Mariano_EA3_temp.pdf');
const outPdfPath = path.join(__dirname, '..', 'Molina_Mariano_EA3.pdf');

const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${tempPdfPath}`,
    `file:///${outHtmlPath.replace(/\\/g, '/')}`
];

console.log('Generando archivo PDF con Chrome headless...');
execFile(chromePath, args, (err) => {
    if (err) {
        console.error('Error generando PDF:', err.message);
        process.exit(1);
    }
    console.log(`Archivo PDF temporal generado exitosamente en: ${tempPdfPath}`);

    try {
        fs.copyFileSync(tempPdfPath, outPdfPath);
        fs.unlinkSync(tempPdfPath);
        console.log(`Archivo generado exitosamente:\n - ${outPdfPath}`);
    } catch (copyErr) {
        console.error('Error copiando PDF definitivo:', copyErr.message);
    }
});

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const mockupsDir = path.join(__dirname, '..', 'docs', 'mockups');
const cssPath = path.join(__dirname, '..', 'src', 'css', 'main.css');
const cssContent = fs.readFileSync(cssPath, 'utf-8');

if (!fs.existsSync(mockupsDir)) {
    fs.mkdirSync(mockupsDir, { recursive: true });
}

const mockupsData = [
    {
        name: '8_gestion_pagos.png',
        title: 'Módulo de Gestión de Pagos – Tablero de Control',
        body: `
        <div class="app-layout" style="display:flex;min-height:100vh;">
            <aside class="sidebar" style="width:260px;background:#0f172a;color:#f8fafc;padding:20px;">
                <div style="font-size:18px;font-weight:800;color:#38bdf8;margin-bottom:24px;">🚗 AUTOS COLOMBIA</div>
                <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;">
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">📊 Dashboard</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">🟢 Registro Entrada</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">🔴 Registro Salida</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">👥 Gestión Usuarios</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">🅿️ Gestión Celdas</div>
                    <div style="padding:10px 14px;border-radius:6px;background:#2563eb;color:#ffffff;font-weight:700;">💳 Gestión Pagos (EA3)</div>
                </div>
            </aside>
            <div class="main-content" style="flex:1;background:#f8fafc;padding:24px;">
                <header class="topbar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <div>
                        <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 4px 0;">💳 Gestión de Pagos de Mensualidad</h1>
                        <p style="color:#64748b;margin:0;font-size:14px;">Control de recaudo, emisión de recibos y vigencia de suscriptores</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" style="background:#2563eb;color:#ffffff;padding:10px 18px;border-radius:6px;border:none;font-weight:600;cursor:pointer;">➕ Registrar Pago</button>
                    </div>
                </header>

                <div class="stats-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;">
                    <div class="stat-card" style="background:#ffffff;padding:18px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #10b981;">
                        <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;">Recaudado Este Mes</div>
                        <div style="font-size:22px;font-weight:800;color:#10b981;margin-top:6px;">$ 440.000 COP</div>
                    </div>
                    <div class="stat-card" style="background:#ffffff;padding:18px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #3b82f6;">
                        <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;">Suscriptores Al Día</div>
                        <div style="font-size:22px;font-weight:800;color:#3b82f6;margin-top:6px;">4 / 5 (80%)</div>
                    </div>
                    <div class="stat-card" style="background:#ffffff;padding:18px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #f59e0b;">
                        <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;">Suscriptores En Mora</div>
                        <div style="font-size:22px;font-weight:800;color:#f59e0b;margin-top:6px;">1 Cliente</div>
                    </div>
                    <div class="stat-card" style="background:#ffffff;padding:18px;border-radius:8px;border:1px solid #e2e8f0;border-left:4px solid #8b5cf6;">
                        <div style="font-size:12px;color:#64748b;font-weight:600;text-transform:uppercase;">Total Recibos Expedidos</div>
                        <div style="font-size:22px;font-weight:800;color:#8b5cf6;margin-top:6px;">5 Transacciones</div>
                    </div>
                </div>

                <div class="card" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;padding:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                        <div>
                            <div style="font-size:16px;font-weight:700;color:#1e293b;">Historial de Pagos y Transacciones</div>
                            <div style="font-size:12px;color:#64748b;">Mostrando 5 recibo(s) registrado(s)</div>
                        </div>
                        <div style="display:flex;gap:10px;">
                            <input type="text" value="" placeholder="🔍 Buscar por propietario o recibo..." style="padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;width:240px;font-size:13px;">
                            <select style="padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;"><option>Todos los Estados</option></select>
                        </div>
                    </div>

                    <table style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="background:#f1f5f9;color:#334155;border-bottom:2px solid #cbd5e1;text-align:left;">
                                <th style="padding:10px;">N° Recibo</th>
                                <th style="padding:10px;">Suscriptor</th>
                                <th style="padding:10px;">Vehículo</th>
                                <th style="padding:10px;">Período Cubierto</th>
                                <th style="padding:10px;">Fecha Pago</th>
                                <th style="padding:10px;">Monto</th>
                                <th style="padding:10px;">Método</th>
                                <th style="padding:10px;">Estado</th>
                                <th style="padding:10px;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:10px;font-weight:700;color:#2563eb;">REC-2026-0001</td>
                                <td style="padding:10px;"><strong>Carlos Martínez López</strong><br><small style="color:#64748b;">C.C. 10234567</small></td>
                                <td style="padding:10px;"><span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;">ABC123</span> (CARRO)</td>
                                <td style="padding:10px;font-size:12px;">2026-11-01 al 2026-11-30</td>
                                <td style="padding:10px;">2026-11-01</td>
                                <td style="padding:10px;font-weight:700;">$ 120.000</td>
                                <td style="padding:10px;"><span style="background:#f1f5f9;color:#334155;padding:2px 8px;border-radius:4px;font-size:11px;">EFECTIVO</span></td>
                                <td style="padding:10px;"><span style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:4px;font-weight:700;font-size:11px;">VIGENTE</span></td>
                                <td style="padding:10px;"><button style="background:none;border:1px solid #cbd5e1;padding:4px 8px;border-radius:4px;cursor:pointer;">🧾</button></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                                <td style="padding:10px;font-weight:700;color:#2563eb;">REC-2026-0002</td>
                                <td style="padding:10px;"><strong>Ana García Torres</strong><br><small style="color:#64748b;">C.C. 20345678</small></td>
                                <td style="padding:10px;"><span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;">DEF456</span> (CARRO)</td>
                                <td style="padding:10px;font-size:12px;">2026-11-01 al 2026-11-30</td>
                                <td style="padding:10px;">2026-11-01</td>
                                <td style="padding:10px;font-weight:700;">$ 120.000</td>
                                <td style="padding:10px;"><span style="background:#f1f5f9;color:#334155;padding:2px 8px;border-radius:4px;font-size:11px;">TRANSFERENCIA</span></td>
                                <td style="padding:10px;"><span style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:4px;font-weight:700;font-size:11px;">VIGENTE</span></td>
                                <td style="padding:10px;"><button style="background:none;border:1px solid #cbd5e1;padding:4px 8px;border-radius:4px;cursor:pointer;">🧾</button></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:10px;font-weight:700;color:#2563eb;">REC-2026-0003</td>
                                <td style="padding:10px;"><strong>Luis Rodríguez Peña</strong><br><small style="color:#64748b;">C.C. 30456789</small></td>
                                <td style="padding:10px;"><span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;">GH12B</span> (MOTO)</td>
                                <td style="padding:10px;font-size:12px;">2026-11-01 al 2026-11-30</td>
                                <td style="padding:10px;">2026-11-01</td>
                                <td style="padding:10px;font-weight:700;">$ 80.000</td>
                                <td style="padding:10px;"><span style="background:#f1f5f9;color:#334155;padding:2px 8px;border-radius:4px;font-size:11px;">TARJETA</span></td>
                                <td style="padding:10px;"><span style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:4px;font-weight:700;font-size:11px;">VIGENTE</span></td>
                                <td style="padding:10px;"><button style="background:none;border:1px solid #cbd5e1;padding:4px 8px;border-radius:4px;cursor:pointer;">🧾</button></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                                <td style="padding:10px;font-weight:700;color:#2563eb;">REC-2026-0004</td>
                                <td style="padding:10px;"><strong>Jorge Hernández Díaz</strong><br><small style="color:#64748b;">C.C. 50678901</small></td>
                                <td style="padding:10px;"><span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:4px;font-weight:700;font-size:11px;">MNO012</span> (CARRO)</td>
                                <td style="padding:10px;font-size:12px;">2026-11-01 al 2026-11-30</td>
                                <td style="padding:10px;">2026-11-01</td>
                                <td style="padding:10px;font-weight:700;">$ 120.000</td>
                                <td style="padding:10px;"><span style="background:#f1f5f9;color:#334155;padding:2px 8px;border-radius:4px;font-size:11px;">EFECTIVO</span></td>
                                <td style="padding:10px;"><span style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:4px;font-weight:700;font-size:11px;">VIGENTE</span></td>
                                <td style="padding:10px;"><button style="background:none;border:1px solid #cbd5e1;padding:4px 8px;border-radius:4px;cursor:pointer;">🧾</button></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:10px;font-weight:700;color:#64748b;">REC-2026-0005</td>
                                <td style="padding:10px;"><strong>María Sánchez Ruiz</strong><br><small style="color:#64748b;">C.C. 40567890</small></td>
                                <td style="padding:10px;"><span style="color:#94a3b8;">General</span></td>
                                <td style="padding:10px;font-size:12px;">2026-10-01 al 2026-10-31</td>
                                <td style="padding:10px;">2026-10-01</td>
                                <td style="padding:10px;font-weight:700;">$ 120.000</td>
                                <td style="padding:10px;"><span style="background:#f1f5f9;color:#334155;padding:2px 8px;border-radius:4px;font-size:11px;">EFECTIVO</span></td>
                                <td style="padding:10px;"><span style="background:#fee2e2;color:#b91c1c;padding:3px 8px;border-radius:4px;font-weight:700;font-size:11px;">VENCIDO</span></td>
                                <td style="padding:10px;"><button style="background:none;border:1px solid #cbd5e1;padding:4px 8px;border-radius:4px;cursor:pointer;">🧾</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `
    },
    {
        name: '9_registro_pago.png',
        title: 'Formulario Modal de Registro de Pago de Mensualidad',
        body: `
        <div style="background:rgba(15,23,42,0.6);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;">
            <div style="background:#ffffff;border-radius:12px;width:560px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.2);overflow:hidden;">
                <div style="padding:18px 24px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;">
                    <div style="font-size:18px;font-weight:800;color:#0f172a;">💵 Registrar Nuevo Pago de Mensualidad</div>
                    <span style="font-size:20px;color:#94a3b8;cursor:pointer;">✕</span>
                </div>
                <div style="padding:24px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:13px;">
                        <div style="grid-column:1/-1;">
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Suscriptor / Propietario *</label>
                            <select style="width:100%;padding:9px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;background:#f8fafc;font-weight:600;">
                                <option>Carlos Martínez López (C.C. 10234567)</option>
                            </select>
                        </div>
                        <div style="grid-column:1/-1;">
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Vehículo Vinculado (Detección Automática de Tarifa)</label>
                            <select style="width:100%;padding:9px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;background:#ffffff;">
                                <option>ABC123 - Chevrolet Spark (CARRO)</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Mes de Cobertura *</label>
                            <input type="month" value="2026-11" style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;">
                        </div>
                        <div>
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Monto Liquidado ($ COP) *</label>
                            <input type="number" value="120000" style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;font-weight:700;color:#2563eb;">
                        </div>
                        <div>
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Medio de Pago *</label>
                            <select style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;">
                                <option selected>Efectivo</option>
                                <option>Transferencia Bancaria / PSE</option>
                                <option>Tarjeta Débito / Crédito</option>
                            </select>
                        </div>
                        <div>
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Fecha de Transacción</label>
                            <input type="date" value="2026-11-16" style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;">
                        </div>
                        <div style="background:#f1f5f9;padding:12px;border-radius:6px;grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div>
                                <label style="font-weight:600;color:#334155;display:block;margin-bottom:4px;font-size:12px;">Efectivo Recibido ($)</label>
                                <input type="number" value="150000" style="width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;font-weight:700;">
                            </div>
                            <div>
                                <label style="font-weight:600;color:#334155;display:block;margin-bottom:4px;font-size:12px;">Cambio a Entregar ($)</label>
                                <input type="text" value="$ 30.000" readonly style="width:100%;padding:8px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;font-weight:800;color:#10b981;background:#ffffff;">
                            </div>
                        </div>
                        <div style="grid-column:1/-1;">
                            <label style="font-weight:600;color:#334155;display:block;margin-bottom:6px;">Observaciones / Notas</label>
                            <input type="text" value="Pago oportuno de mensualidad para automóvil ABC123" style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;">
                        </div>
                    </div>
                </div>
                <div style="padding:16px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;display:flex;justify-content:flex-end;gap:10px;">
                    <button style="background:none;border:1px solid #cbd5e1;padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Cancelar</button>
                    <button style="background:#2563eb;color:#ffffff;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;">Confirmar y Emitir Recibo</button>
                </div>
            </div>
        </div>
        `
    },
    {
        name: '10_recibo_digital.png',
        title: 'Comprobante y Recibo de Pago Digital Oficial',
        body: `
        <div style="background:#e2e8f0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;">
            <div style="background:#ffffff;border:1px dashed #94a3b8;border-radius:8px;width:440px;padding:28px;font-family:'Courier New',Courier,monospace;color:#0f172a;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
                <div style="text-align:center;border-bottom:1px dashed #64748b;padding-bottom:14px;margin-bottom:14px;">
                    <div style="font-size:18px;font-weight:900;">AUTOS COLOMBIA S.A.S</div>
                    <div style="font-size:12px;color:#475569;margin-top:2px;">NIT: 900.823.114-1 | Régimen Común</div>
                    <div style="font-size:11px;color:#475569;">Calle 45 # 12-34 – Medellín, Colombia</div>
                    <div style="font-size:11px;color:#475569;">Tel: (604) 444-2390 | soporte@autoscolombia.com</div>
                    <div style="margin-top:12px;font-weight:800;font-size:13px;background:#f1f5f9;padding:4px;border-radius:4px;">COMPROBANTE DE PAGO MENSUALIDAD</div>
                    <div style="font-size:13px;font-weight:900;color:#2563eb;margin-top:4px;">REC-2026-0001</div>
                </div>

                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Fecha Emisión:</span><strong>2026-11-01 08:30:15</strong></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Cajero Responsable:</span><span>Administrador Principal</span></div>
                <div style="border-top:1px dashed #cbd5e1;margin:10px 0;"></div>

                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Suscriptor:</span><strong>Carlos Martínez López</strong></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Cédula / Documento:</span><span>10234567</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Vehículo Vinculado:</span><strong>ABC123 (Spark GT)</strong></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Período Cubierto:</span><strong>2026-11-01 al 2026-11-30</strong></div>
                <div style="border-top:1px dashed #cbd5e1;margin:10px 0;"></div>

                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Concepto:</span><span>Mensualidad Estándar Carro</span></div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;"><span>Forma de Pago:</span><strong>EFECTIVO</strong></div>
                <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:900;color:#2563eb;margin:12px 0 6px 0;padding:6px 0;border-top:1px solid #0f172a;border-bottom:1px solid #0f172a;">
                    <span>TOTAL PAGADO:</span>
                    <span>$ 120.000 COP</span>
                </div>

                <div style="font-size:10px;color:#64748b;text-align:center;margin-top:14px;line-height:1.4;">
                    Este recibo certifica la vigencia del servicio de parqueadero mensual en nuestras instalaciones. Conserve este comprobante ante cualquier reclamación.
                </div>
                <div style="text-align:center;letter-spacing:6px;font-size:18px;font-weight:900;margin-top:14px;border-top:1px dashed #cbd5e1;padding-top:10px;">
                    |||| | |||||| || | |||||
                </div>
                <div style="text-align:center;font-size:10px;color:#94a3b8;margin-top:2px;">*REC20260001*</div>
                <div style="text-align:center;margin-top:16px;">
                    <button style="background:#2563eb;color:#ffffff;border:none;padding:8px 18px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;">🖨️ Imprimir Recibo POS (80mm)</button>
                </div>
            </div>
        </div>
        `
    },
    {
        name: '11_cartera_morosos.png',
        title: 'Panel de Control de Cartera y Clientes Morosos',
        body: `
        <div class="app-layout" style="display:flex;min-height:100vh;">
            <aside class="sidebar" style="width:260px;background:#0f172a;color:#f8fafc;padding:20px;">
                <div style="font-size:18px;font-weight:800;color:#38bdf8;margin-bottom:24px;">🚗 AUTOS COLOMBIA</div>
                <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;">
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">📊 Dashboard</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">🟢 Registro Entrada</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">👥 Gestión Usuarios</div>
                    <div style="padding:10px 14px;border-radius:6px;background:#2563eb;color:#ffffff;font-weight:700;">💳 Gestión Pagos (EA3)</div>
                </div>
            </aside>
            <div class="main-content" style="flex:1;background:#f8fafc;padding:24px;">
                <header class="topbar" style="margin-bottom:20px;">
                    <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 4px 0;">💳 Control de Cartera y Suscriptores Morosos</h1>
                    <p style="color:#64748b;margin:0;font-size:14px;">Supervisión de clientes con mensualidad vencida que tienen bloqueado el acceso en garita</p>
                </header>

                <div style="display:flex;gap:10px;margin-bottom:20px;border-bottom:2px solid #e2e8f0;padding-bottom:10px;">
                    <button style="background:none;border:none;font-weight:600;color:#64748b;padding:8px 16px;cursor:pointer;">📋 Historial de Pagos</button>
                    <button style="background:none;border:none;font-weight:700;color:#2563eb;border-bottom:3px solid #2563eb;padding:8px 16px;cursor:pointer;">⚠️ Cartera y Morosos (1)</button>
                    <button style="background:none;border:none;font-weight:600;color:#64748b;padding:8px 16px;cursor:pointer;">⚙️ Tarifas Parametrizadas</button>
                </div>

                <div class="card" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;padding:20px;">
                    <div style="margin-bottom:16px;">
                        <div style="font-size:16px;font-weight:700;color:#1e293b;">Suscriptores con Mensualidad Vencida o Pendiente</div>
                        <div style="font-size:12px;color:#64748b;">Clientes que no cuentan con un pago vigente para Noviembre 2026. No podrán autorizarse en garita.</div>
                    </div>

                    <table style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="background:#fef2f2;color:#991b1b;border-bottom:2px solid #fecaca;text-align:left;">
                                <th style="padding:10px;">Documento</th>
                                <th style="padding:10px;">Suscriptor</th>
                                <th style="padding:10px;">Contacto</th>
                                <th style="padding:10px;">Vehículos Registrados</th>
                                <th style="padding:10px;">Último Período Pagado</th>
                                <th style="padding:10px;">Estado Actual</th>
                                <th style="padding:10px;">Acción Inmediata</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:12px;font-weight:700;">40567890</td>
                                <td style="padding:12px;"><strong>María Sánchez Ruiz</strong><br><small style="color:#64748b;">Calle 30 #5-67</small></td>
                                <td style="padding:12px;font-size:12px;">📞 3119876543<br>✉️ maria@email.com</td>
                                <td style="padding:12px;"><span style="background:#f1f5f9;color:#475569;padding:2px 6px;border-radius:4px;font-size:11px;">JKL789 (CAMIONETA)</span></td>
                                <td style="padding:12px;font-size:12px;color:#ef4444;font-weight:600;">2026-10-01 al 2026-10-31</td>
                                <td style="padding:12px;"><span style="background:#fee2e2;color:#b91c1c;padding:3px 10px;border-radius:4px;font-weight:800;font-size:11px;">EN MORA</span></td>
                                <td style="padding:12px;">
                                    <button style="background:#2563eb;color:#ffffff;border:none;padding:7px 14px;border-radius:6px;font-weight:700;font-size:12px;cursor:pointer;">💵 Cobrar Mensualidad</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `
    },
    {
        name: '12_tarifas_mensualidad.png',
        title: 'Matriz de Configuración de Tarifas Parametrizadas',
        body: `
        <div class="app-layout" style="display:flex;min-height:100vh;">
            <aside class="sidebar" style="width:260px;background:#0f172a;color:#f8fafc;padding:20px;">
                <div style="font-size:18px;font-weight:800;color:#38bdf8;margin-bottom:24px;">🚗 AUTOS COLOMBIA</div>
                <div style="display:flex;flex-direction:column;gap:10px;font-size:14px;">
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">📊 Dashboard</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">🟢 Registro Entrada</div>
                    <div style="padding:10px 14px;border-radius:6px;background:rgba(255,255,255,0.05);color:#94a3b8;">👥 Gestión Usuarios</div>
                    <div style="padding:10px 14px;border-radius:6px;background:#2563eb;color:#ffffff;font-weight:700;">💳 Gestión Pagos (EA3)</div>
                </div>
            </aside>
            <div class="main-content" style="flex:1;background:#f8fafc;padding:24px;">
                <header class="topbar" style="margin-bottom:20px;">
                    <h1 style="font-size:24px;font-weight:800;color:#0f172a;margin:0 0 4px 0;">⚙️ Configuración Paramétrica de Tarifas</h1>
                    <p style="color:#64748b;margin:0;font-size:14px;">Valores oficiales de mensualidad por tipología de vehículo</p>
                </header>

                <div style="display:flex;gap:10px;margin-bottom:20px;border-bottom:2px solid #e2e8f0;padding-bottom:10px;">
                    <button style="background:none;border:none;font-weight:600;color:#64748b;padding:8px 16px;cursor:pointer;">📋 Historial de Pagos</button>
                    <button style="background:none;border:none;font-weight:600;color:#64748b;padding:8px 16px;cursor:pointer;">⚠️ Cartera y Morosos (1)</button>
                    <button style="background:none;border:none;font-weight:700;color:#2563eb;border-bottom:3px solid #2563eb;padding:8px 16px;cursor:pointer;">⚙️ Tarifas Parametrizadas</button>
                </div>

                <div class="card" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;padding:20px;">
                    <div style="margin-bottom:16px;">
                        <div style="font-size:16px;font-weight:700;color:#1e293b;">Matriz de Tarifas por Categoría de Vehículo</div>
                        <div style="font-size:12px;color:#64748b;">Valores parametrizados para la liquidación mensual de celdas reservadas.</div>
                    </div>

                    <table style="width:100%;border-collapse:collapse;font-size:13px;">
                        <thead>
                            <tr style="background:#f1f5f9;color:#334155;border-bottom:2px solid #cbd5e1;text-align:left;">
                                <th style="padding:12px;">Categoría de Vehículo</th>
                                <th style="padding:12px;">Descripción de Cobertura</th>
                                <th style="padding:12px;">Valor Mensualidad ($ COP)</th>
                                <th style="padding:12px;">Estado en Sistema</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:12px;font-weight:800;color:#2563eb;font-size:14px;">CARRO</td>
                                <td style="padding:12px;">Mensualidad para automóvil particular estándar (sedán, hatchback, coupé)</td>
                                <td style="padding:12px;font-weight:800;color:#10b981;font-size:15px;">$ 120.000 COP</td>
                                <td style="padding:12px;"><span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:4px;font-weight:700;font-size:11px;">Tarifa Activa</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;background:#f8fafc;">
                                <td style="padding:12px;font-weight:800;color:#2563eb;font-size:14px;">MOTO</td>
                                <td style="padding:12px;">Mensualidad motocicleta cualquier cilindraje en celdas asignadas Sector M</td>
                                <td style="padding:12px;font-weight:800;color:#10b981;font-size:15px;">$ 80.000 COP</td>
                                <td style="padding:12px;"><span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:4px;font-weight:700;font-size:11px;">Tarifa Activa</span></td>
                            </tr>
                            <tr style="border-bottom:1px solid #e2e8f0;">
                                <td style="padding:12px;font-weight:800;color:#2563eb;font-size:14px;">CAMIONETA</td>
                                <td style="padding:12px;">Mensualidad camioneta / SUV / furgón ligero en celdas amplias</td>
                                <td style="padding:12px;font-weight:800;color:#10b981;font-size:15px;">$ 150.000 COP</td>
                                <td style="padding:12px;"><span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:4px;font-weight:700;font-size:11px;">Tarifa Activa</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `
    }
];

async function generateMockup(m, idx) {
    const tempHtml = path.join(__dirname, `temp_mockup_${idx + 1}.html`);
    const outFile = path.join(mockupsDir, m.name);

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${m.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f8fafc; }
        ${cssContent}
    </style>
</head>
<body>
    ${m.body}
</body>
</html>`;

    fs.writeFileSync(tempHtml, fullHtml, 'utf-8');

    return new Promise((resolve, reject) => {
        const args = [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            '--window-size=1400,900',
            '--virtual-time-budget=3000',
            `--screenshot=${outFile}`,
            `file:///${tempHtml.replace(/\\/g, '/')}`
        ];

        execFile(chromePath, args, (err) => {
            if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
            if (err) return reject(err);
            console.log(`Mockup generado: ${m.name}`);
            resolve();
        });
    });
}

async function main() {
    console.log(`Generando ${mockupsData.length} mockups de pagos...`);
    for (let i = 0; i < mockupsData.length; i++) {
        try {
            await generateMockup(mockupsData[i], i);
        } catch (e) {
            console.error(`Error en mockup ${mockupsData[i].name}:`, e.message);
        }
    }
    console.log('¡Todos los mockups fueron generados exitosamente!');
}

main();

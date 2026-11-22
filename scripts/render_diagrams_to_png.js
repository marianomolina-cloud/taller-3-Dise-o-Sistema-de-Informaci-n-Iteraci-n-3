const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const diagrams = [
    {
        name: 'diagrama_casos_de_uso_pagos.png',
        title: 'Diagrama de Casos de Uso - Iteración 3: Gestión de Pagos',
        code: `graph LR
    subgraph Actores
        ADMIN(["👑 Administrador"])
        OPER(["👷 Operador / Cajero"])
        SYS(["⚙️ Motor del Sistema"])
        CLI(["👤 Suscriptor / Cliente"])
    end

    subgraph "Parqueadero Autos Colombia - Módulo de Gestión de Pagos"
        CU_PAG1("CU-PAG-01: Registrar Pago de Mensualidad")
        CU_PAG2("CU-PAG-02: Consultar Historial y Transacciones")
        CU_PAG3("CU-PAG-03: Generar e Imprimir Recibo Digital")
        CU_PAG4("CU-PAG-04: Validar Vigencia de Suscripción")
        CU_PAG5("CU-PAG-05: Configurar Tarifas por Tipo de Vehículo")
        CU_PAG6("CU-PAG-06: Controlar Cartera y Detectar Morosidad")
        CU_PAG7("CU-PAG-07: Anular Recibo de Pago por Inconsistencia")
        CU_PAG8("CU-PAG-08: Liquidar Tarifa Automática por Vehículo")
    end

    ADMIN --> CU_PAG1
    ADMIN --> CU_PAG2
    ADMIN --> CU_PAG3
    ADMIN --> CU_PAG5
    ADMIN --> CU_PAG6
    ADMIN --> CU_PAG7

    OPER --> CU_PAG1
    OPER --> CU_PAG2
    OPER --> CU_PAG3
    OPER --> CU_PAG6

    SYS --> CU_PAG4
    SYS --> CU_PAG6

    CLI -.->|"Recibe comprobante"| CU_PAG3

    CU_PAG1 -.->|"«include»"| CU_PAG3
    CU_PAG1 -.->|"«include»"| CU_PAG8
    CU_PAG7 -.->|"«extend»"| CU_PAG2
    CU_PAG4 -.->|"«include»"| CU_PAG6`
    },
    {
        name: 'diagrama_casos_de_uso.png',
        title: 'Diagrama de Casos de Uso Global - Sistema Autos Colombia (Iteraciones 1, 2 y 3)',
        code: `graph LR
    subgraph Actores
        ADMIN(["👑 Administrador"])
        OPER(["👷 Operador Garita"])
        SYS(["⚙️ Sistema Central"])
    end

    subgraph "Iteración 1: Entradas y Salidas"
        CU_E1("CU-01: Registrar Ingreso Vehículo")
        CU_E2("CU-02: Registrar Salida y Despacho")
        CU_E3("CU-03: Asignar Celda Libre Automática")
    end

    subgraph "Iteración 2: Usuarios y Celdas"
        CU_U1("CU-04: Registrar Propietario / Cliente")
        CU_U2("CU-05: Vincular Vehículos a Propietario")
        CU_U3("CU-06: Mapeo y Monitoreo de Celdas")
        CU_U4("CU-07: Inhabilitar Celda por Mantenimiento")
    end

    subgraph "Iteración 3: Gestión de Pagos"
        CU_P1("CU-08: Registrar Pago Mensualidad")
        CU_P2("CU-09: Emitir Recibo de Pago Digital")
        CU_P3("CU-10: Validar Vigencia de Suscripción")
        CU_P4("CU-11: Control de Morosos y Cartera")
        CU_P5("CU-12: Parametrizar Tarifas por Categoría")
    end

    ADMIN --> CU_U1
    ADMIN --> CU_U2
    ADMIN --> CU_U3
    ADMIN --> CU_U4
    ADMIN --> CU_P1
    ADMIN --> CU_P4
    ADMIN --> CU_P5

    OPER --> CU_E1
    OPER --> CU_E2
    OPER --> CU_U3
    OPER --> CU_P1
    OPER --> CU_P2

    CU_E1 -.->|"«include»"| CU_P3
    CU_E1 -.->|"«include»"| CU_E3
    CU_P1 -.->|"«include»"| CU_P2
    SYS --> CU_P3
    SYS --> CU_P4`
    },
    {
        name: 'secuencia_1_entrada_vehiculo.png',
        title: 'Diagrama de Secuencia 1: Registrar Entrada de Vehículo (Iteración 1)',
        code: `sequenceDiagram
    autonumber
    actor Operador as 👷 Operador Garita
    participant UI as VistaEntradas (UI)
    participant Ctrl as ControladorAcceso (BL)
    participant ValPagos as ServicioValidacionPagos (BL)
    participant RepoCel as CeldaRepository (DA)
    participant RepoMov as MovimientoRepository (DA)

    Operador ->> UI: digitarPlaca("ABC123")
    UI ->> Ctrl: consultarEstadoVehiculo("ABC123")
    Ctrl ->> ValPagos: verificarSuscripcionVigente(personaId)
    ValPagos -->> Ctrl: estadoVigente = true (Pago al Día)
    Ctrl ->> RepoCel: buscarCeldaDisponible(tipoVehiculo)
    RepoCel -->> Ctrl: celdaAsignada = "A02"
    Ctrl ->> RepoCel: actualizarEstado("A02", "OCUPADA")
    Ctrl ->> RepoMov: crearMovimiento("ABC123", "A02", timestampEntrada)
    RepoMov -->> Ctrl: movimientoId = 104
    Ctrl -->> UI: autorizarIngreso(celda: "A02", tiquete: 104)
    UI -->> Operador: mostrarAccesoPermitido("Celda A02 asignada")`
    },
    {
        name: 'secuencia_2_salida_vehiculo.png',
        title: 'Diagrama de Secuencia 2: Registrar Salida de Vehículo (Iteración 1)',
        code: `sequenceDiagram
    autonumber
    actor Operador as 👷 Operador Garita
    participant UI as VistaSalidas (UI)
    participant Ctrl as ControladorSalidas (BL)
    participant RepoMov as MovimientoRepository (DA)
    participant RepoCel as CeldaRepository (DA)

    Operador ->> UI: buscarPlacaSalida("ABC123")
    UI ->> Ctrl: obtenerEstanciaActiva("ABC123")
    Ctrl ->> RepoMov: findByPlacaAndEstado("ABC123", "DENTRO")
    RepoMov -->> Ctrl: registroMovimiento (celdaId: "A02", fechaEntrada)
    Ctrl -->> UI: renderizarResumenSalida(tiempoTotal, celda: "A02")
    UI -->> Operador: mostrarDetallesEstancia()

    Operador ->> UI: confirmarSalidaVehiculo()
    UI ->> Ctrl: ejecutarSalida(movimientoId, "A02")
    Ctrl ->> RepoMov: marcarSalida(movimientoId, timestampSalida)
    Ctrl ->> RepoCel: actualizarEstado("A02", "LIBRE")
    RepoCel -->> Ctrl: confirmacionLibre(OK)
    Ctrl -->> UI: despachoCompletado()
    UI -->> Operador: notificar("Vehículo despachado. Celda A02 liberada")`
    },
    {
        name: 'secuencia_3_gestion_usuarios.png',
        title: 'Diagrama de Secuencia 3: Gestión de Usuarios y Vehículos (Iteración 2)',
        code: `sequenceDiagram
    autonumber
    actor Admin as 👑 Administrador
    participant UI as VistaUsuarios (UI)
    participant Ctrl as ControladorUsuarios (BL)
    participant Val as ValidadorIdentidad (BL)
    participant RepoUsr as PersonaRepository (DA)
    participant RepoVeh as VehiculoRepository (DA)

    Admin ->> UI: ingresarDatosCliente(cedula, nombre, tel, email)
    UI ->> Ctrl: crearSuscriptor(datosPersona)
    Ctrl ->> Val: validarUnicidadCedula(cedula)
    Val -->> Ctrl: cedulaDisponible = true
    Ctrl ->> RepoUsr: insertPersona(datosPersona)
    RepoUsr -->> Ctrl: personaCreada (id: 45)

    Admin ->> UI: vincularVehiculo(personaId: 45, placa, tipo, modelo)
    UI ->> Ctrl: asociarVehiculo(45, datosVehiculo)
    Ctrl ->> Val: validarUnicidadPlaca(placa)
    Val -->> Ctrl: placaDisponible = true
    Ctrl ->> RepoVeh: insertVehiculo(datosVehiculo)
    RepoVeh -->> Ctrl: vehiculoAsociado(OK)
    Ctrl -->> UI: notificarExito("Suscriptor y vehículo registrados")
    UI -->> Admin: actualizarTablaSuscriptores()`
    },
    {
        name: 'secuencia_4_mantenimiento_celdas.png',
        title: 'Diagrama de Secuencia 4: Mantenimiento y Mapa de Celdas (Iteración 2)',
        code: `sequenceDiagram
    autonumber
    actor Admin as 👑 Administrador
    participant UI as VistaCeldas (UI)
    participant Ctrl as ControladorCeldas (BL)
    participant RepoCel as CeldaRepository (DA)

    Admin ->> UI: seleccionarCeldaParaMantenimiento("B04")
    UI ->> Ctrl: verificarEstadoCelda("B04")
    Ctrl ->> RepoCel: findByCodigo("B04")
    RepoCel -->> Ctrl: celda (estado: "LIBRE")
    Ctrl ->> RepoCel: actualizarEstado("B04", "INHABILITADA")
    RepoCel -->> Ctrl: celdaActualizada(OK)
    Ctrl -->> UI: celdaBloqueadaExitosamente()
    UI -->> Admin: refrescarMapaVisual("Celda B04 marcada en GRIS")`
    },
    {
        name: 'secuencia_5_registro_pago.png',
        title: 'Diagrama de Secuencia 5: Registro de Pago y Emisión de Recibo (Iteración 3)',
        code: `sequenceDiagram
    autonumber
    actor Cajero as 💵 Operador / Cajero
    participant UI as VistaPagos (UI)
    participant Ctrl as ControladorPagos (BL)
    participant Tarifas as ServicioTarifario (BL)
    participant RepoPago as PagoRepository (DA)
    participant RepoUsr as PersonaRepository (DA)
    participant Recibo as GeneradorReciboDigital (Service)

    Cajero ->> UI: seleccionarSuscriptor(personaId: 1)
    UI ->> Ctrl: cargarVehiculosYTarifa(personaId: 1)
    Ctrl ->> Tarifas: getTarifaPorTipoVehiculo("CARRO")
    Tarifas -->> Ctrl: montoLiquidado = $120.000 COP
    Ctrl -->> UI: prellenarFormulario(monto: 120000, periodo: "Noviembre 2026")
    UI -->> Cajero: mostrarResumenLiquidacion()

    Cajero ->> UI: confirmarRegistroPago(metodo: "EFECTIVO", efectivoRecibido: 150000)
    UI ->> Ctrl: procesarPago(personaId, monto: 120000, periodo)
    Ctrl ->> RepoPago: verificarPagoDuplicado(personaId, periodo)
    RepoPago -->> Ctrl: noExisteDuplicado = true
    Ctrl ->> RepoPago: insertPago(reciboNum: "REC-2026-0006", monto, fecha, metodo)
    RepoPago -->> Ctrl: pagoGuardado (id: 6)
    Ctrl ->> RepoUsr: actualizarEstadoSuscriptor(personaId, "ACTIVO")
    Ctrl ->> Recibo: construirComprobanteDigital(pagoId: 6)
    Recibo -->> Ctrl: reciboDigitalGenerado
    Ctrl -->> UI: pagoExitoso(reciboDigital)
    UI -->> Cajero: desplegarModalRecibo("REC-2026-0006 con opción Imprimir")`
    },
    {
        name: 'secuencia_6_validacion_acceso_pago.png',
        title: 'Diagrama de Secuencia 6: Validación de Pago al Ingreso (Iteraciones 1 y 3)',
        code: `sequenceDiagram
    autonumber
    actor Operador as 👷 Operador Garita
    participant UI as VistaEntradas (UI)
    participant CtrlAcceso as GestorControlAcceso (BL)
    participant ServPagos as ServicioVerificacionPagos (BL)
    participant RepoPagos as PagoRepository (DA)

    Operador ->> UI: registrarLlegadaPlaca("DEF456")
    UI ->> CtrlAcceso: validarCondicionesIngreso("DEF456")
    CtrlAcceso ->> ServPagos: tienePagoVigente(vehiculoPlaca: "DEF456")
    ServPagos ->> RepoPagos: findUltimoPagoVigente(personaId)
    
    alt Pago Vigente a la Fecha
        RepoPagos -->> ServPagos: pagoVigente (Fin: 30/11/2026)
        ServPagos -->> CtrlAcceso: Estado: AL_DIA (Acceso Autorizado)
        CtrlAcceso -->> UI: permitirIngresoYAsignarCelda()
        UI -->> Operador: mostrarBannerVerde("Suscriptor al Día. Celda asignada")
    else Mensualidad Vencida / En Mora
        RepoPagos -->> ServPagos: pagoVencido (Fin: 31/10/2026)
        ServPagos -->> CtrlAcceso: Estado: EN_MORA (Acceso Bloqueado)
        CtrlAcceso -->> UI: denegarIngreso("Mensualidad vencida. Requiere pago.")
        UI -->> Operador: mostrarAlertaRoja("ACCESO DENEGADO - Remitir a Caja")
    end`
    },
    {
        name: 'diagrama_componentes.png',
        title: 'Diagrama de Componentes Integral - Sistema Autos Colombia (Iteraciones 1, 2 y 3)',
        code: `graph TD
    subgraph "Capa de Presentación (UI Modules)"
        CMP_UI_SHELL["🖥️ Shell / Layout & Auth<br>(index.html / auth.js)"]
        CMP_UI_ACCESO["🚗 Módulo Entradas / Salidas<br>(entradas.html / salidas.html)"]
        CMP_UI_USUARIOS["👥 Módulo Usuarios & Celdas<br>(usuarios.html / celdas.html)"]
        CMP_UI_PAGOS["💳 Módulo Gestión Pagos & Cartera<br>(pagos.html)"]
        CMP_UI_DASH["📊 Dashboard Centralizado<br>(dashboard.html)"]
    end

    subgraph "Capa de Lógica de Negocio (Business Services)"
        SRV_ACCESO["⚙️ ServicioControlAcceso"]
        SRV_USUARIOS["⚙️ ServicioGestionUsuarios"]
        SRV_CELDAS["⚙️ ServicioGestionCeldas"]
        SRV_PAGOS["⚙️ ServicioLiquidacionPagos"]
        SRV_VAL_PAGOS["🔒 ValidadorVigenciaSuscripcion"]
        SRV_RECIBOS["🧾 GeneradorRecibosDigitales"]
    end

    subgraph "Capa de Acceso a Datos (Persistence Repositories)"
        REP_MOV["📁 MovimientosRepository"]
        REP_USR["📁 PersonasVehiculosRepository"]
        REP_CEL["📁 CeldasRepository"]
        REP_PAG["📁 PagosTarifasRepository"]
        STORE_ENGINE[("💾 Motor Almacenamiento<br>LocalStorage / DB SQL")]
    end

    subgraph "Integraciones & Periféricos Externos"
        EXT_PRINT["🖨️ Impresora Térmica POS"]
        EXT_PASARELA["🏦 Pasarela Pagos / PSE Simulada"]
    end

    CMP_UI_ACCESO --> SRV_ACCESO
    CMP_UI_USUARIOS --> SRV_USUARIOS
    CMP_UI_USUARIOS --> SRV_CELDAS
    CMP_UI_PAGOS --> SRV_PAGOS
    CMP_UI_PAGOS --> SRV_RECIBOS
    CMP_UI_DASH --> SRV_ACCESO
    CMP_UI_DASH --> SRV_CELDAS
    CMP_UI_DASH --> SRV_PAGOS

    SRV_ACCESO --> SRV_VAL_PAGOS
    SRV_ACCESO --> SRV_CELDAS
    SRV_ACCESO --> REP_MOV
    SRV_USUARIOS --> REP_USR
    SRV_CELDAS --> REP_CEL
    SRV_PAGOS --> REP_PAG
    SRV_PAGOS --> REP_USR
    SRV_VAL_PAGOS --> REP_PAG
    SRV_RECIBOS --> EXT_PRINT
    SRV_PAGOS -.-> EXT_PASARELA

    REP_MOV --> STORE_ENGINE
    REP_USR --> STORE_ENGINE
    REP_CEL --> STORE_ENGINE
    REP_PAG --> STORE_ENGINE`
    }
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, '..', 'docs', 'diagramas');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function renderDiagram(d, index) {
    const tempHtml = path.join(__dirname, `temp_diagram_${index + 1}.html`);
    const outFile = path.join(outDir, d.name);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 30px;
            background: #ffffff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header {
            text-align: center;
            margin-bottom: 25px;
        }
        .header h2 {
            margin: 0 0 8px 0;
            color: #1e293b;
            font-size: 20px;
        }
        .header p {
            margin: 0;
            color: #64748b;
            font-size: 13px;
        }
        .mermaid {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>${d.title}</h2>
        <p>Sistema de Información Parqueadero "Autos Colombia" – Estándar UML 2.5</p>
    </div>
    <div class="mermaid">
${d.code}
    </div>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            themeVariables: {
                primaryColor: '#e0f2fe',
                primaryTextColor: '#0369a1',
                primaryBorderColor: '#0284c7',
                lineColor: '#334155',
                secondaryColor: '#f1f5f9',
                tertiaryColor: '#f8fafc'
            },
            sequence: {
                diagramMarginX: 20,
                diagramMarginY: 20,
                actorMargin: 50,
                width: 160,
                height: 50,
                boxMargin: 10,
                boxTextMargin: 5,
                noteMargin: 10,
                messageMargin: 35
            }
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(tempHtml, htmlContent, 'utf-8');

    return new Promise((resolve, reject) => {
        const args = [
            '--headless=new',
            '--disable-gpu',
            '--no-sandbox',
            '--hide-scrollbars',
            '--window-size=1500,1050',
            '--virtual-time-budget=5000',
            `--screenshot=${outFile}`,
            `file:///${tempHtml.replace(/\\/g, '/')}`
        ];

        execFile(chromePath, args, (err) => {
            try {
                if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml);
            } catch (ignoreErr) {}
            if (err) return reject(err);
            console.log(`Renderizado exitoso: ${d.name}`);
            resolve();
        });
    });
}

async function main() {
    console.log(`Renderizando ${diagrams.length} diagramas a PNG...`);
    for (let i = 0; i < diagrams.length; i++) {
        try {
            await renderDiagram(diagrams[i], i);
        } catch (e) {
            console.error(`Error en diagrama ${diagrams[i].name}:`, e.message);
        }
    }
    console.log('¡Todos los diagramas fueron generados exitosamente!');
}

main();

const fs = require('fs');
const path = require('path');

let idCounter = 1;
function genId(prefix = 'AAAA') {
    return prefix + '_' + (idCounter++).toString(36).padStart(8, '0') + '_' + Math.random().toString(36).substring(2, 7);
}

const rootId = genId('PROJ');
const modelId = genId('MODL');

// 1. CASOS DE USO
const ucDiagramId = genId('D_UC');
const adminId = genId('ACT_ADMIN');
const operadorId = genId('ACT_OPER');
const sistemaId = genId('ACT_SYS');
const clienteId = genId('ACT_CLI');

const ucs = [
    // Iteración 3: Pagos
    { id: genId('UC'), name: 'CU-PAG-01: Registrar Pago de Mensualidad', actor: 'caja' },
    { id: genId('UC'), name: 'CU-PAG-02: Consultar Historial y Transacciones', actor: 'caja' },
    { id: genId('UC'), name: 'CU-PAG-03: Generar e Imprimir Recibo Digital', actor: 'caja' },
    { id: genId('UC'), name: 'CU-PAG-04: Validar Vigencia de Suscripción en Garita', actor: 'system' },
    { id: genId('UC'), name: 'CU-PAG-05: Configurar Tarifas de Mensualidad por Vehículo', actor: 'admin' },
    { id: genId('UC'), name: 'CU-PAG-06: Controlar Cartera y Detectar Morosidad', actor: 'caja' },
    { id: genId('UC'), name: 'CU-PAG-07: Anular Recibo de Pago por Inconsistencia', actor: 'admin' },
    { id: genId('UC'), name: 'CU-PAG-08: Liquidar Tarifa Automática por Vehículo', actor: 'system' },

    // Iteración 1 y 2 Integradas
    { id: genId('UC'), name: 'CU-ACC-01: Registrar Entrada de Vehículo', actor: 'oper' },
    { id: genId('UC'), name: 'CU-ACC-02: Registrar Salida y Despacho', actor: 'oper' },
    { id: genId('UC'), name: 'CU-USR-01: Registrar Propietario / Cliente', actor: 'admin' },
    { id: genId('UC'), name: 'CU-USR-02: Asociar y Gestionar Vehículos', actor: 'admin' },
    { id: genId('UC'), name: 'CU-CEL-01: Mapeo y Monitoreo de Celdas', actor: 'both' },
    { id: genId('UC'), name: 'CU-CEL-02: Inhabilitar Celda por Mantenimiento', actor: 'admin' }
];

const ucViews = [];

// Actores Views
ucViews.push({
    _type: 'UMLActorView',
    _id: genId('VW_ACT'),
    model: { $ref: adminId },
    left: 50,
    top: 150,
    width: 65,
    height: 85,
    nameLabel: { _type: 'UMLNameLabelView', text: 'Administrador' }
});

ucViews.push({
    _type: 'UMLActorView',
    _id: genId('VW_ACT'),
    model: { $ref: operadorId },
    left: 50,
    top: 400,
    width: 65,
    height: 85,
    nameLabel: { _type: 'UMLNameLabelView', text: 'Operador / Cajero' }
});

ucViews.push({
    _type: 'UMLActorView',
    _id: genId('VW_ACT'),
    model: { $ref: sistemaId },
    left: 950,
    top: 250,
    width: 65,
    height: 85,
    nameLabel: { _type: 'UMLNameLabelView', text: 'Motor del Sistema' }
});

// UC Views organizadas en 2 columnas
ucs.forEach((uc, index) => {
    const col = index < 7 ? 220 : 580;
    const rowY = 50 + ((index % 7) * 95);
    ucViews.push({
        _type: 'UMLUseCaseView',
        _id: genId('VW_UC'),
        model: { $ref: uc.id },
        left: col,
        top: rowY,
        width: 290,
        height: 65,
        nameLabel: { _type: 'UMLNameLabelView', text: uc.name }
    });
});

const ucDiagram = {
    _type: 'UMLUseCaseDiagram',
    _id: ucDiagramId,
    _parent: { $ref: modelId },
    name: 'Diagrama de Casos de Uso - Iteración 3 y Subsistema Integrado',
    ownedViews: ucViews
};

// 2. CONSTRUCTOR DE DIAGRAMAS DE SECUENCIA
function makeSequenceDiagram(name, lifelinesData, messagesData) {
    const dId = genId('D_SEQ');
    const interId = genId('INTER');
    const lifelines = [];
    const lifelineViews = [];

    lifelinesData.forEach((ll, i) => {
        const llId = genId('LL');
        lifelines.push({
            _type: 'UMLLifeline',
            _id: llId,
            _parent: { $ref: interId },
            name: ll.name,
            isActor: !!ll.isActor
        });

        lifelineViews.push({
            _type: 'UMLLifelineView',
            _id: genId('VW_LL'),
            model: { $ref: llId },
            left: 50 + (i * 180),
            top: 50,
            width: 140,
            height: 520,
            nameLabel: { _type: 'UMLNameLabelView', text: ll.name }
        });
    });

    const messages = [];
    const messageViews = [];

    messagesData.forEach((msg, idx) => {
        const msgId = genId('MSG');
        const sourceLL = lifelines[msg.from];
        const targetLL = lifelines[msg.to];

        messages.push({
            _type: 'UMLMessage',
            _id: msgId,
            _parent: { $ref: interId },
            name: msg.name,
            source: { $ref: sourceLL._id },
            target: { $ref: targetLL._id },
            messageSort: msg.isReturn ? 'reply' : 'synchCall'
        });

        messageViews.push({
            _type: 'UMLSeqMessageView',
            _id: genId('VW_MSG'),
            model: { $ref: msgId },
            lineStyle: 1,
            points: `${120 + msg.from * 180},${100 + idx * 42};${120 + msg.to * 180},${100 + idx * 42}`,
            nameLabel: { _type: 'EdgeLabelView', text: msg.name }
        });
    });

    return {
        _type: 'UMLInteraction',
        _id: interId,
        _parent: { $ref: modelId },
        name: name + ' Interaction',
        participants: lifelines,
        messages: messages,
        ownedElements: [
            {
                _type: 'UMLSequenceDiagram',
                _id: dId,
                _parent: { $ref: interId },
                name: name,
                ownedViews: [...lifelineViews, ...messageViews]
            }
        ]
    };
}

// SECUENCIAS:
// Secuencia 1: Registrar Entrada (Iteración 1)
const seq1 = makeSequenceDiagram(
    'DS-01: Registrar Entrada de Vehículo (Iteración 1)',
    [
        { name: 'Operador', isActor: true },
        { name: 'VistaEntradas' },
        { name: 'ControladorAcceso' },
        { name: 'ValidadorSuscripcion' },
        { name: 'CeldaRepository' },
        { name: 'MovimientoRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: ingresarPlaca(placa)' },
        { from: 1, to: 2, name: '2: procesarIngreso(placa)' },
        { from: 2, to: 3, name: '3: verificarMensualidad(propietarioId)' },
        { from: 3, to: 2, name: '4: [Pago Vigente / Al Día]', isReturn: true },
        { from: 2, to: 4, name: '5: getCeldaLibre(tipoVehiculo)' },
        { from: 4, to: 2, name: '6: celdaDisponible (e.g. A02)', isReturn: true },
        { from: 2, to: 4, name: '7: actualizarEstado(celdaId, "OCUPADA")' },
        { from: 4, to: 2, name: '8: celdaActualizada(OK)', isReturn: true },
        { from: 2, to: 5, name: '9: registrarMovimientoEntrada(placa, celdaId)' },
        { from: 5, to: 2, name: '10: movimientoCreado(id)', isReturn: true },
        { from: 2, to: 1, name: '11: confirmacionIngreso(tiquete)', isReturn: true },
        { from: 1, to: 0, name: '12: mostrarAccesoPermitidoYCelda()', isReturn: true }
    ]
);

// Secuencia 2: Registrar Salida (Iteración 1)
const seq2 = makeSequenceDiagram(
    'DS-02: Registrar Salida de Vehículo (Iteración 1)',
    [
        { name: 'Operador', isActor: true },
        { name: 'VistaSalidas' },
        { name: 'ControladorSalidas' },
        { name: 'MovimientoRepository' },
        { name: 'CeldaRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: buscarPlacaSalida("ABC123")' },
        { from: 1, to: 2, name: '2: consultarMovimientoActivo("ABC123")' },
        { from: 2, to: 3, name: '3: findActivoByPlaca("ABC123")' },
        { from: 3, to: 2, name: '4: movimiento(id, celdaId, horaEntrada)', isReturn: true },
        { from: 2, to: 1, name: '5: resumenEstancia(tiempoTotal, celdaId)', isReturn: true },
        { from: 1, to: 0, name: '6: mostrarDetallesEstancia()', isReturn: true },
        { from: 0, to: 1, name: '7: confirmarSalida()' },
        { from: 1, to: 2, name: '8: procesarSalida(movId, celdaId)' },
        { from: 2, to: 3, name: '9: marcarFechaSalida(movId, now)' },
        { from: 2, to: 4, name: '10: actualizarEstado(celdaId, "LIBRE")' },
        { from: 4, to: 2, name: '11: celdaLiberada(OK)', isReturn: true },
        { from: 2, to: 1, name: '12: salidaConfirmada()', isReturn: true },
        { from: 1, to: 0, name: '13: mostrarToastSalidaExitosa()', isReturn: true }
    ]
);

// Secuencia 3: Gestión de Usuarios y Vehículos (Iteración 2)
const seq3 = makeSequenceDiagram(
    'DS-03: Gestión de Usuarios y Vehículos (Iteración 2)',
    [
        { name: 'Administrador', isActor: true },
        { name: 'VistaUsuarios' },
        { name: 'ControladorUsuarios' },
        { name: 'ValidadorDatos' },
        { name: 'PersonaRepository' },
        { name: 'VehiculoRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: ingresarDatosSuscriptor(cedula, nombre, tel, email)' },
        { from: 1, to: 2, name: '2: guardarSuscriptor(datos)' },
        { from: 2, to: 3, name: '3: validarUnicidadDocumental(cedula)' },
        { from: 3, to: 2, name: '4: [cedulaValida]', isReturn: true },
        { from: 2, to: 4, name: '5: insert(datosPersona)' },
        { from: 4, to: 2, name: '6: personaGuardada(id)', isReturn: true },
        { from: 0, to: 1, name: '7: asociarVehiculo(personaId, placa, tipo, modelo)' },
        { from: 1, to: 2, name: '8: vincularVehiculo(datosVeh)' },
        { from: 2, to: 3, name: '9: validarUnicidadPlaca(placa)' },
        { from: 3, to: 2, name: '10: [placaDisponible]', isReturn: true },
        { from: 2, to: 5, name: '11: insert(datosVehiculo)' },
        { from: 5, to: 2, name: '12: vehiculoRegistrado(id)', isReturn: true },
        { from: 2, to: 1, name: '13: suscripcionCompletaOk()', isReturn: true },
        { from: 1, to: 0, name: '14: notificarRegistroExitoso()', isReturn: true }
    ]
);

// Secuencia 4: Mantenimiento de Celdas (Iteración 2)
const seq4 = makeSequenceDiagram(
    'DS-04: Mantenimiento e Inhabilitación de Celdas (Iteración 2)',
    [
        { name: 'Administrador', isActor: true },
        { name: 'VistaCeldas' },
        { name: 'ControladorCeldas' },
        { name: 'CeldaRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: seleccionarCelda(celdaId)' },
        { from: 1, to: 2, name: '2: inhabilitarPorMantenimiento(celdaId)' },
        { from: 2, to: 3, name: '3: findById(celdaId)' },
        { from: 3, to: 2, name: '4: celda (estado == "LIBRE")', isReturn: true },
        { from: 2, to: 3, name: '5: update(celdaId, {activa: false, estado: "INHABILITADA"})' },
        { from: 3, to: 2, name: '6: celdaActualizada(OK)', isReturn: true },
        { from: 2, to: 1, name: '7: estadoCambiado()', isReturn: true },
        { from: 1, to: 0, name: '8: reflejarEnMapaColorGris()', isReturn: true }
    ]
);

// Secuencia 5: Registro de Pago y Recibo Digital (Iteración 3)
const seq5 = makeSequenceDiagram(
    'DS-05: Registro de Pago de Mensualidad y Emisión de Recibo (Iteración 3)',
    [
        { name: 'Cajero / Operador', isActor: true },
        { name: 'VistaPagos' },
        { name: 'ControladorPagos' },
        { name: 'ServicioTarifario' },
        { name: 'PagoRepository' },
        { name: 'PersonaRepository' },
        { name: 'GeneradorRecibo' }
    ],
    [
        { from: 0, to: 1, name: '1: seleccionarSuscriptor(personaId)' },
        { from: 1, to: 2, name: '2: consultarTarifaSugerida(personaId)' },
        { from: 2, to: 3, name: '3: getTarifaPorTipo(tipoVehiculo)' },
        { from: 3, to: 2, name: '4: tarifaMonto ($120.000 COP)', isReturn: true },
        { from: 2, to: 1, name: '5: cargarFormularioConTarifa()', isReturn: true },
        { from: 0, to: 1, name: '6: registrarPago(mes, monto, metodo, efectivo)' },
        { from: 1, to: 2, name: '7: procesarTransaccion(datosPago)' },
        { from: 2, to: 4, name: '8: validarNoDuplicado(personaId, periodo)' },
        { from: 4, to: 2, name: '9: [periodoSinSolapamiento]', isReturn: true },
        { from: 2, to: 4, name: '10: insertPago(reciboNum, monto, periodo, metodo)' },
        { from: 4, to: 2, name: '11: pagoGuardado(pagoId)', isReturn: true },
        { from: 2, to: 5, name: '12: reactivarSiMora(personaId, "ACTIVO")' },
        { from: 2, to: 6, name: '13: construirReciboDigital(pagoId)' },
        { from: 6, to: 2, name: '14: comprobanteFormateado', isReturn: true },
        { from: 2, to: 1, name: '15: pagoCompletado(recibo)', isReturn: true },
        { from: 1, to: 0, name: '16: desplegarModalReciboConImpresion()', isReturn: true }
    ]
);

// Secuencia 6: Validación de Pago al Ingreso (Iteración 3 y 1)
const seq6 = makeSequenceDiagram(
    'DS-06: Validación de Pago Vigente en Garita de Acceso (Iteraciones 1 y 3)',
    [
        { name: 'Operador Garita', isActor: true },
        { name: 'VistaEntradas' },
        { name: 'ControladorAcceso' },
        { name: 'ValidadorVigencia' },
        { name: 'PagoRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: digitarPlacaVehiculo("DEF456")' },
        { from: 1, to: 2, name: '2: validarAutorizacionAcceso("DEF456")' },
        { from: 2, to: 3, name: '3: tienePagoVigente(personaId)' },
        { from: 3, to: 4, name: '4: findUltimoPagoActivo(personaId)' },
        { from: 4, to: 3, name: '5: pago (periodoFin >= hoy)', isReturn: true },
        { from: 3, to: 2, name: '6: [SUSCRIPCION_AL_DIA = TRUE]', isReturn: true },
        { from: 2, to: 1, name: '7: autorizarPasoYAsignarCelda()', isReturn: true },
        { from: 1, to: 0, name: '8: mostrarAccesoPermitidoEnPantalla()', isReturn: true }
    ]
);

// 3. DIAGRAMA DE COMPONENTES INTEGRAL (Iteraciones 1, 2 y 3)
const compDiagramId = genId('D_COMP');
const componentsData = [
    // Capa Presentación
    { name: 'UI_Layout_Auth_Component', category: 'Presentación', x: 50, y: 80 },
    { name: 'UI_EntradasSalidas_Component', category: 'Presentación', x: 280, y: 80 },
    { name: 'UI_GestionUsuarios_Component', category: 'Presentación', x: 510, y: 80 },
    { name: 'UI_GestionCeldas_Component', category: 'Presentación', x: 740, y: 80 },
    { name: 'UI_GestionPagos_Component', category: 'Presentación', x: 970, y: 80 },
    { name: 'UI_Dashboard_Component', category: 'Presentación', x: 1200, y: 80 },

    // Capa Lógica de Negocio
    { name: 'Servicio_ControlAcceso_Component', category: 'Negocio', x: 160, y: 260 },
    { name: 'Servicio_UsuariosVehiculos_Component', category: 'Negocio', x: 450, y: 260 },
    { name: 'Servicio_InfraestructuraCeldas_Component', category: 'Negocio', x: 740, y: 260 },
    { name: 'Servicio_LiquidacionPagos_Component', category: 'Negocio', x: 1030, y: 260 },
    { name: 'Servicio_ValidadorVigencia_Component', category: 'Negocio', x: 590, y: 380 },
    { name: 'Servicio_EmisionRecibos_Component', category: 'Negocio', x: 1030, y: 380 },

    // Capa de Datos y Persistencia
    { name: 'Repositorio_Movimientos_Component', category: 'Datos', x: 160, y: 500 },
    { name: 'Repositorio_Usuarios_Component', category: 'Datos', x: 450, y: 500 },
    { name: 'Repositorio_Celdas_Component', category: 'Datos', x: 740, y: 500 },
    { name: 'Repositorio_PagosTarifas_Component', category: 'Datos', x: 1030, y: 500 },
    { name: 'Persistencia_MotorAlmacenamiento_Component', category: 'Datos', x: 590, y: 620 }
];

const compElements = [];
const compViews = [];

componentsData.forEach(c => {
    const cId = genId('CMP');
    compElements.push({
        _type: 'UMLComponent',
        _id: cId,
        _parent: { $ref: modelId },
        name: c.name
    });

    compViews.push({
        _type: 'UMLComponentView',
        _id: genId('VW_CMP'),
        model: { $ref: cId },
        left: c.x,
        top: c.y,
        width: 210,
        height: 75,
        nameLabel: { _type: 'UMLNameLabelView', text: c.name }
    });
});

const compDiagram = {
    _type: 'UMLComponentDiagram',
    _id: compDiagramId,
    _parent: { $ref: modelId },
    name: 'Diagrama de Componentes Integral - Iteraciones 1, 2 y 3',
    ownedViews: compViews
};

// Actores y Use Cases modelo
const actorElements = [
    { _type: 'UMLActor', _id: adminId, _parent: { $ref: modelId }, name: 'Administrador' },
    { _type: 'UMLActor', _id: operadorId, _parent: { $ref: modelId }, name: 'Operador / Cajero' },
    { _type: 'UMLActor', _id: sistemaId, _parent: { $ref: modelId }, name: 'Motor del Sistema' },
    { _type: 'UMLActor', _id: clienteId, _parent: { $ref: modelId }, name: 'Suscriptor' }
];

const ucElements = ucs.map(u => ({
    _type: 'UMLUseCase',
    _id: u.id,
    _parent: { $ref: modelId },
    name: u.name
}));

// PROYECTO COMPLETO
const starUMLProject = {
    _type: 'Project',
    _id: rootId,
    name: 'Parqueadero Autos Colombia - Sistema de Información (Iteración 3)',
    ownedElements: [
        {
            _type: 'UMLModel',
            _id: modelId,
            _parent: { $ref: rootId },
            name: 'Modelo de Software - Autos Colombia (3 Iteraciones)',
            ownedElements: [
                ...actorElements,
                ...ucElements,
                ucDiagram,
                seq1,
                seq2,
                seq3,
                seq4,
                seq5,
                seq6,
                ...compElements,
                compDiagram
            ]
        }
    ]
};

const outputDir = path.join(__dirname, '..', 'docs', 'staruml');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'AutosColombia_Iteracion3.mdj');
fs.writeFileSync(outputPath, JSON.stringify(starUMLProject, null, 2), 'utf-8');
console.log(`Archivo StarUML generado exitosamente en: ${outputPath}`);

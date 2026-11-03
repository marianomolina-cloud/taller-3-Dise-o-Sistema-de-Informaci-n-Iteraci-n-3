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

const ucs = [
    { id: genId('UC'), name: 'CU-01: Registrar Nuevo Usuario Propietario', actor: 'admin' },
    { id: genId('UC'), name: 'CU-02: Consultar y Filtrar Usuarios', actor: 'both' },
    { id: genId('UC'), name: 'CU-03: Actualizar Datos de Usuario', actor: 'admin' },
    { id: genId('UC'), name: 'CU-04: Suspender o Reactivar Usuario', actor: 'admin', extendFrom: 2 },
    { id: genId('UC'), name: 'CU-05: Asociar y Gestionar Vehículos del Usuario', actor: 'admin' },
    { id: genId('UC'), name: 'CU-06: Validar Cédula y Placa Única', actor: 'system' },
    { id: genId('UC'), name: 'CU-07: Eliminar Registro de Usuario', actor: 'admin' },
    { id: genId('UC'), name: 'CU-08: Registrar Nueva Celda de Parqueo', actor: 'admin' },
    { id: genId('UC'), name: 'CU-09: Configurar Tipo y Sector de Celda', actor: 'admin' },
    { id: genId('UC'), name: 'CU-10: Inhabilitar Celda por Mantenimiento', actor: 'admin' },
    { id: genId('UC'), name: 'CU-11: Visualizar Mapa de Celdas y Ocupación', actor: 'both' },
    { id: genId('UC'), name: 'CU-12: Asignar Celda Automática por Tipo', actor: 'system' },
    { id: genId('UC'), name: 'CU-13: Liberar Celda al Registrar Salida', actor: 'oper' }
];

// Views para Use Cases
const ucViews = [];
let topY = 60;
// Actor Admin
ucViews.push({
    _type: 'UMLActorView',
    _id: genId('VW_ACT'),
    model: { $ref: adminId },
    left: 60,
    top: 220,
    width: 60,
    height: 80,
    nameLabel: { _type: 'UMLNameLabelView', text: 'Administrador' }
});

// Actor Operador
ucViews.push({
    _type: 'UMLActorView',
    _id: genId('VW_ACT'),
    model: { $ref: operadorId },
    left: 60,
    top: 560,
    width: 60,
    height: 80,
    nameLabel: { _type: 'UMLNameLabelView', text: 'Operador' }
});

// UC Views
ucs.forEach((uc, index) => {
    const col = index < 7 ? 260 : 620;
    const rowY = 40 + ((index % 7) * 95);
    ucViews.push({
        _type: 'UMLUseCaseView',
        _id: genId('VW_UC'),
        model: { $ref: uc.id },
        left: col,
        top: rowY,
        width: 250,
        height: 65,
        nameLabel: { _type: 'UMLNameLabelView', text: uc.name }
    });
});

const ucDiagram = {
    _type: 'UMLUseCaseDiagram',
    _id: ucDiagramId,
    _parent: { $ref: modelId },
    name: 'Diagrama de Casos de Uso - Gestión de Usuarios y Celdas',
    ownedViews: ucViews
};

// 2. DIAGRAMAS DE SECUENCIA (Iteraciones 1 y 2)
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
            width: 130,
            height: 480,
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
            points: `${115 + msg.from * 180},${100 + idx * 45};${115 + msg.to * 180},${100 + idx * 45}`,
            nameLabel: { _type: 'EdgeLabelView', text: msg.name }
        });
    });

    const interaction = {
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

    return interaction;
}

// Secuencia 1: Registrar Entrada de Vehículo (Iteración 1)
const seq1 = makeSequenceDiagram(
    'DS-01: Registrar Entrada de Vehículo (Iteración 1)',
    [
        { name: 'Operador', isActor: true },
        { name: 'VistaEntradas' },
        { name: 'GestorEntradas' },
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
        { from: 4, to: 2, name: '6: celdaDisponible (e.g. A03)', isReturn: true },
        { from: 2, to: 4, name: '7: actualizarEstado(celdaId, "OCUPADA")' },
        { from: 2, to: 5, name: '8: crearMovimiento(placa, celdaId, fechaEntrada)' },
        { from: 5, to: 2, name: '9: movimientoRegistrado', isReturn: true },
        { from: 2, to: 1, name: '10: confirmarIngresoExitoso(tiquete)', isReturn: true },
        { from: 1, to: 0, name: '11: mostrarConfirmacionYCelda()', isReturn: true }
    ]
);

// Secuencia 2: Registrar Salida de Vehículo (Iteración 1)
const seq2 = makeSequenceDiagram(
    'DS-02: Registrar Salida de Vehículo (Iteración 1)',
    [
        { name: 'Operador', isActor: true },
        { name: 'VistaSalidas' },
        { name: 'GestorSalidas' },
        { name: 'MovimientoRepository' },
        { name: 'CeldaRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: buscarPlacaSalida(placa)' },
        { from: 1, to: 2, name: '2: consultarMovimientoActivo(placa)' },
        { from: 2, to: 3, name: '3: findActivoByPlaca(placa)' },
        { from: 3, to: 2, name: '4: datosMovimiento(entrada, celdaId)', isReturn: true },
        { from: 2, to: 1, name: '5: mostrarResumenSalida(tiempo, celda)', isReturn: true },
        { from: 0, to: 1, name: '6: confirmarSalida()' },
        { from: 1, to: 2, name: '7: ejecutarSalida(movimientoId, celdaId)' },
        { from: 2, to: 3, name: '8: registrarFechaSalida(movId, now)' },
        { from: 2, to: 4, name: '9: actualizarEstado(celdaId, "LIBRE")' },
        { from: 4, to: 2, name: '10: celdaLiberada', isReturn: true },
        { from: 2, to: 1, name: '11: salidaConfirmada()', isReturn: true },
        { from: 1, to: 0, name: '12: notificarSalidaExitosa()', isReturn: true }
    ]
);

// Secuencia 3: Gestión de Usuarios y Vehículos (Iteración 2)
const seq3 = makeSequenceDiagram(
    'DS-03: Gestión y Vinculación de Usuarios con Vehículos (Iteración 2)',
    [
        { name: 'Administrador', isActor: true },
        { name: 'VistaUsuarios' },
        { name: 'GestorUsuarios' },
        { name: 'ValidadorPersona' },
        { name: 'PersonaRepository' },
        { name: 'VehiculoRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: solicitarRegistroUsuario(datosPersona)' },
        { from: 1, to: 2, name: '2: crearUsuario(datos)' },
        { from: 2, to: 3, name: '3: validarUnicidadCedulaEmail(cedula, email)' },
        { from: 3, to: 2, name: '4: validacionExitosa()', isReturn: true },
        { from: 2, to: 4, name: '5: insertPersona(datosPersona)' },
        { from: 4, to: 2, name: '6: personaIdGenerado', isReturn: true },
        { from: 0, to: 1, name: '7: asociarVehiculo(personaId, datosVehiculo)' },
        { from: 1, to: 2, name: '8: vincularVehiculo(personaId, placa, tipo, marca)' },
        { from: 2, to: 5, name: '9: insertVehiculo(personaId, placa, tipo)' },
        { from: 5, to: 2, name: '10: vehiculoVinculadoOk', isReturn: true },
        { from: 2, to: 1, name: '11: respuestaUsuarioCreadoConVehiculo()', isReturn: true },
        { from: 1, to: 0, name: '12: mostrarToastExitoYActualizarTabla()', isReturn: true }
    ]
);

// Secuencia 4: Gestión y Mantenimiento de Celdas (Iteración 2)
const seq4 = makeSequenceDiagram(
    'DS-04: Administración y Monitoreo de Celdas (Iteración 2)',
    [
        { name: 'Administrador', isActor: true },
        { name: 'VistaCeldas' },
        { name: 'GestorCeldas' },
        { name: 'CeldaRepository' }
    ],
    [
        { from: 0, to: 1, name: '1: abrirGestionCeldas()' },
        { from: 1, to: 2, name: '2: obtenerMapaYEstatusCeldas()' },
        { from: 2, to: 3, name: '3: getAllCeldasConEstado()' },
        { from: 3, to: 2, name: '4: listaCeldas(total, libres, ocupadas)', isReturn: true },
        { from: 2, to: 1, name: '5: renderizarMapaYSectores()', isReturn: true },
        { from: 0, to: 1, name: '6: toggleInhabilitarCelda(celdaId)' },
        { from: 1, to: 2, name: '7: inhabilitarPorMantenimiento(celdaId)' },
        { from: 2, to: 3, name: '8: findById(celdaId)' },
        { from: 3, to: 2, name: '9: [estado != "OCUPADA"]', isReturn: true },
        { from: 2, to: 3, name: '10: update(celdaId, {activa: false})' },
        { from: 3, to: 2, name: '11: celdaInhabilitadaOk', isReturn: true },
        { from: 2, to: 1, name: '12: actualizarMapaEnTiempoReal()', isReturn: true },
        { from: 1, to: 0, name: '13: mostrarToastInhabilitada()', isReturn: true }
    ]
);

// 3. DIAGRAMA DE COMPONENTES (Iteraciones 1 y 2)
const compDiagramId = genId('D_COMP');
const componentsData = [
    // Capa Presentación
    { name: 'UI_EntradasSalidas_Component', category: 'Presentación', x: 60, y: 80 },
    { name: 'UI_GestionUsuarios_Component', category: 'Presentación', x: 300, y: 80 },
    { name: 'UI_GestionCeldas_Component', category: 'Presentación', x: 540, y: 80 },
    { name: 'UI_Dashboard_Component', category: 'Presentación', x: 780, y: 80 },

    // Capa Lógica de Negocio
    { name: 'Servicio_Movimientos_Component', category: 'Negocio', x: 60, y: 260 },
    { name: 'Servicio_Usuarios_Component', category: 'Negocio', x: 300, y: 260 },
    { name: 'Servicio_Celdas_Component', category: 'Negocio', x: 540, y: 260 },
    { name: 'Servicio_Autenticacion_Component', category: 'Negocio', x: 780, y: 260 },

    // Capa de Datos y Persistencia
    { name: 'Repositorio_Movimientos_Component', category: 'Datos', x: 60, y: 440 },
    { name: 'Repositorio_Usuarios_Component', category: 'Datos', x: 300, y: 440 },
    { name: 'Repositorio_Celdas_Component', category: 'Datos', x: 540, y: 440 },
    { name: 'Persistencia_BaseDatos_Component', category: 'Datos', x: 780, y: 440 }
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
        width: 190,
        height: 80,
        nameLabel: { _type: 'UMLNameLabelView', text: c.name }
    });
});

const compDiagram = {
    _type: 'UMLComponentDiagram',
    _id: compDiagramId,
    _parent: { $ref: modelId },
    name: 'Diagrama de Componentes - Iteraciones 1 y 2',
    ownedViews: compViews
};

// Actores y Use Cases modelo
const actorElements = [
    { _type: 'UMLActor', _id: adminId, _parent: { $ref: modelId }, name: 'Administrador' },
    { _type: 'UMLActor', _id: operadorId, _parent: { $ref: modelId }, name: 'Operador' }
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
    name: 'Parqueadero Autos Colombia - Sistema de Información',
    ownedElements: [
        {
            _type: 'UMLModel',
            _id: modelId,
            _parent: { $ref: rootId },
            name: 'Modelo de Software - Autos Colombia',
            ownedElements: [
                ...actorElements,
                ...ucElements,
                ucDiagram,
                seq1,
                seq2,
                seq3,
                seq4,
                ...compElements,
                compDiagram
            ]
        }
    ]
};

const outputPath = path.join(__dirname, '..', 'docs', 'staruml', 'AutosColombia_Iteracion1y2.mdj');
fs.writeFileSync(outputPath, JSON.stringify(starUMLProject, null, 2), 'utf-8');
console.log(`Archivo StarUML generado exitosamente en: ${outputPath}`);

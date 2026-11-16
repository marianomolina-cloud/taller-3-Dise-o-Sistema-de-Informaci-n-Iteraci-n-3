/**
 * db.js – Módulo de Datos (localStorage)
 * Sistema de Gestión de Parqueadero "Autos Colombia"
 * Iteración 3: Gestión de Pagos, Usuarios, Celdas y Movimientos
 */

const DB = (() => {
    const KEYS = {
        personas: 'ac_personas',
        vehiculos: 'ac_vehiculos',
        celdas: 'ac_celdas',
        movimientos: 'ac_movimientos',
        pagos: 'ac_pagos',
        tarifas: 'ac_tarifas',
        novedades: 'ac_novedades',
        usuarios: 'ac_usuarios',
        config: 'ac_config'
    };

    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    const get = (key) => JSON.parse(localStorage.getItem(key) || '[]');
    const set = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const getOne = (key, id) => get(key).find(i => i.id === id) || null;

    /* ── Inicializar con datos demo ──────────────────── */
    const init = () => {
        if (localStorage.getItem('ac_initialized_ea3')) return;

        // Usuarios del sistema
        set(KEYS.usuarios, [
            { id: 1, username: 'admin', password: 'admin123', rol: 'ADMINISTRADOR', activo: true, nombre: 'Administrador Principal' },
            { id: 2, username: 'operador', password: 'oper123', rol: 'OPERADOR', activo: true, nombre: 'Operador / Cajero' }
        ]);

        // Personas (Suscriptores)
        set(KEYS.personas, [
            { id: 1, cedula: '10234567', nombreCompleto: 'Carlos Martínez López', telefono: '3001234567', email: 'carlos@email.com', direccion: 'Calle 45 #12-34', estado: 'ACTIVO', createdAt: new Date().toISOString() },
            { id: 2, cedula: '20345678', nombreCompleto: 'Ana García Torres', telefono: '3107654321', email: 'ana@email.com', direccion: 'Carrera 10 #23-45', estado: 'ACTIVO', createdAt: new Date().toISOString() },
            { id: 3, cedula: '30456789', nombreCompleto: 'Luis Rodríguez Peña', telefono: '3205551234', email: 'luis@email.com', direccion: 'Av. Siempre Viva 742', estado: 'ACTIVO', createdAt: new Date().toISOString() },
            { id: 4, cedula: '40567890', nombreCompleto: 'María Sánchez Ruiz', telefono: '3119876543', email: 'maria@email.com', direccion: 'Calle 30 #5-67', estado: 'SUSPENDIDO', createdAt: new Date().toISOString() },
            { id: 5, cedula: '50678901', nombreCompleto: 'Jorge Hernández Díaz', telefono: '3004567890', email: 'jorge@email.com', direccion: 'Transversal 15 #8-90', estado: 'ACTIVO', createdAt: new Date().toISOString() },
            { id: 6, cedula: '60789012', nombreCompleto: 'Diana Marcela Castro', telefono: '3158901234', email: 'diana.castro@email.com', direccion: 'Circular 4 #73-20', estado: 'ACTIVO', createdAt: new Date().toISOString() }
        ]);

        // Vehículos
        set(KEYS.vehiculos, [
            { id: 1, placa: 'ABC123', tipo: 'CARRO', marca: 'Chevrolet', modelo: 'Spark GT', color: 'Blanco', activo: true, personaId: 1, createdAt: new Date().toISOString() },
            { id: 2, placa: 'DEF456', tipo: 'CARRO', marca: 'Renault', modelo: 'Sandero Stepway', color: 'Gris Plata', activo: true, personaId: 2, createdAt: new Date().toISOString() },
            { id: 3, placa: 'GH12B', tipo: 'MOTO', marca: 'Honda', modelo: 'CB125F', color: 'Negro Mate', activo: true, personaId: 3, createdAt: new Date().toISOString() },
            { id: 4, placa: 'JKL789', tipo: 'CAMIONETA', marca: 'Toyota', modelo: 'Hilux 4x4', color: 'Azul Oscuro', activo: true, personaId: 1, createdAt: new Date().toISOString() },
            { id: 5, placa: 'MNO012', tipo: 'CARRO', marca: 'Mazda', modelo: '3 Touring', color: 'Rojo Diamante', activo: true, personaId: 5, createdAt: new Date().toISOString() },
            { id: 6, placa: 'PQR345', tipo: 'CARRO', marca: 'Kia', modelo: 'Picanto Ion', color: 'Plata', activo: true, personaId: 6, createdAt: new Date().toISOString() }
        ]);

        // Tarifas parametrizadas por tipología de vehículo
        set(KEYS.tarifas, [
            { id: 1, tipoVehiculo: 'CARRO', valorMensual: 120000, descripcion: 'Mensualidad automóvil particular estándar', activa: true },
            { id: 2, tipoVehiculo: 'MOTO', valorMensual: 80000, descripcion: 'Mensualidad motocicleta cualquier cilindraje', activa: true },
            { id: 3, tipoVehiculo: 'CAMIONETA', valorMensual: 150000, descripcion: 'Mensualidad camioneta / SUV / furgón ligero', activa: true }
        ]);

        // Celdas (50 celdas: 40 carros + 10 motos)
        const celdas = [];
        const sectores = ['A', 'B', 'C', 'D'];
        let id = 1;
        sectores.forEach(s => {
            for (let n = 1; n <= 10; n++) {
                celdas.push({
                    id: id++,
                    numero: `${s}${String(n).padStart(2,'0')}`,
                    sector: s,
                    tipo: 'CARRO',
                    estado: 'LIBRE',
                    activa: true
                });
            }
        });
        for (let m = 1; m <= 10; m++) {
            celdas.push({
                id: id++,
                numero: `M${String(m).padStart(2,'0')}`,
                sector: 'M',
                tipo: 'MOTO',
                estado: 'LIBRE',
                activa: true
            });
        }
        set(KEYS.celdas, celdas);

        // Pagos iniciales de demostración
        const ahora = new Date();
        const y = ahora.getFullYear();
        const m = ahora.getMonth();
        const inicioMesActual = new Date(y, m, 1).toISOString().split('T')[0];
        const finMesActual = new Date(y, m + 1, 0).toISOString().split('T')[0];

        // Mes anterior (para demostrar historial y morosos)
        const inicioMesAnt = new Date(y, m - 1, 1).toISOString().split('T')[0];
        const finMesAnt = new Date(y, m, 0).toISOString().split('T')[0];

        set(KEYS.pagos, [
            {
                id: 1,
                numeroRecibo: 'REC-2026-0001',
                fechaPago: inicioMesActual,
                periodoInicio: inicioMesActual,
                periodoFin: finMesActual,
                monto: 120000,
                metodoPago: 'EFECTIVO',
                personaId: 1,
                vehiculoId: 1,
                usuarioSistemaId: 1,
                estado: 'VIGENTE',
                observaciones: 'Pago oportuno de mensualidad para automóvil ABC123',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                numeroRecibo: 'REC-2026-0002',
                fechaPago: inicioMesActual,
                periodoInicio: inicioMesActual,
                periodoFin: finMesActual,
                monto: 120000,
                metodoPago: 'TRANSFERENCIA',
                personaId: 2,
                vehiculoId: 2,
                usuarioSistemaId: 1,
                estado: 'VIGENTE',
                observaciones: 'Comprobante Bancolombia #883921',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                numeroRecibo: 'REC-2026-0003',
                fechaPago: inicioMesActual,
                periodoInicio: inicioMesActual,
                periodoFin: finMesActual,
                monto: 80000,
                metodoPago: 'TARJETA',
                personaId: 3,
                vehiculoId: 3,
                usuarioSistemaId: 2,
                estado: 'VIGENTE',
                observaciones: 'Voucher Redeban datáfono #0492',
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                numeroRecibo: 'REC-2026-0004',
                fechaPago: inicioMesActual,
                periodoInicio: inicioMesActual,
                periodoFin: finMesActual,
                monto: 120000,
                metodoPago: 'EFECTIVO',
                personaId: 5,
                vehiculoId: 5,
                usuarioSistemaId: 2,
                estado: 'VIGENTE',
                observaciones: 'Pago mensualidad Mazda 3',
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                numeroRecibo: 'REC-2026-0005',
                fechaPago: inicioMesAnt,
                periodoInicio: inicioMesAnt,
                periodoFin: finMesAnt,
                monto: 120000,
                metodoPago: 'EFECTIVO',
                personaId: 4,
                vehiculoId: null,
                usuarioSistemaId: 1,
                estado: 'VENCIDO',
                observaciones: 'Último pago registrado mes anterior. Actualmente EN MORA.',
                createdAt: new Date().toISOString()
            }
        ]);

        // Movimientos activos de ejemplo
        const hace2h = new Date(ahora.getTime() - 2 * 3600000).toISOString();
        const hace30m = new Date(ahora.getTime() - 30 * 60000).toISOString();
        set(KEYS.movimientos, [
            { id: 1, fechaEntrada: hace2h, fechaSalida: null, estado: 'DENTRO', vehiculoId: 1, celdaId: 1, usuarioEntradaId: 2, usuarioSalidaId: null, observaciones: 'Ingreso normal' },
            { id: 2, fechaEntrada: hace30m, fechaSalida: null, estado: 'DENTRO', vehiculoId: 3, celdaId: 41, usuarioEntradaId: 2, usuarioSalidaId: null, observaciones: 'Ingreso motocicleta' }
        ]);

        // Actualizar celdas ocupadas
        const updatedCeldas = get(KEYS.celdas);
        updatedCeldas[0].estado = 'OCUPADA'; // A01
        updatedCeldas[40].estado = 'OCUPADA'; // M01
        set(KEYS.celdas, updatedCeldas);

        // Novedades de ejemplo
        set(KEYS.novedades, [
            { id: 1, tipo: 'OBSERVACION', descripcion: 'El vehículo ABC123 presenta pequeño rayón en retrovisor derecho.', fechaRegistro: hace2h, archivada: false, vehiculoId: 1, usuarioSistemaId: 2 }
        ]);

        localStorage.setItem('ac_initialized_ea3', 'true');
        console.log('✅ Base de datos demo Iteración 3 inicializada exitosamente.');
    };

    /* ── CRUD Genérico ───────────────────────────────── */
    const crud = (key) => ({
        getAll: () => get(key),
        getById: (id) => getOne(key, id),
        add: (item) => {
            const data = get(key);
            const newItem = { ...item, id: item.id || generateId(), createdAt: new Date().toISOString() };
            data.push(newItem);
            set(key, data);
            return newItem;
        },
        update: (id, updates) => {
            const data = get(key);
            const idx = data.findIndex(i => i.id === id);
            if (idx === -1) return null;
            data[idx] = { ...data[idx], ...updates, updatedAt: new Date().toISOString() };
            set(key, data);
            return data[idx];
        },
        delete: (id) => {
            const data = get(key);
            const filtered = data.filter(i => i.id !== id);
            set(key, filtered);
            return filtered.length < data.length;
        },
        find: (predicate) => get(key).filter(predicate),
        findOne: (predicate) => get(key).find(predicate) || null
    });

    /* ── Métodos de Negocio de Pagos e Integración ───── */
    return {
        init,
        Usuarios: crud(KEYS.usuarios),
        Personas: crud(KEYS.personas),
        Vehiculos: crud(KEYS.vehiculos),
        Celdas: crud(KEYS.celdas),
        Movimientos: crud(KEYS.movimientos),
        Pagos: crud(KEYS.pagos),
        Tarifas: crud(KEYS.tarifas),
        Novedades: crud(KEYS.novedades),

        /* Generar siguiente consecutivo de recibo oficial */
        generarNumeroRecibo() {
            const pagos = get(KEYS.pagos);
            const anio = new Date().getFullYear();
            const count = pagos.length + 1;
            return `REC-${anio}-${String(count).padStart(4, '0')}`;
        },

        /* Obtener tarifa parametrizada según tipo de vehículo */
        getTarifaPorTipo(tipoVehiculo) {
            const tarifas = get(KEYS.tarifas);
            const tarifa = tarifas.find(t => t.tipoVehiculo === tipoVehiculo && t.activa);
            if (tarifa) return tarifa.valorMensual;
            if (tipoVehiculo === 'MOTO') return 80000;
            if (tipoVehiculo === 'CAMIONETA') return 150000;
            return 120000; // Por defecto CARRO
        },

        /* Obtener vehículos de una persona */
        getVehiculosPorPersona(personaId) {
            return get(KEYS.vehiculos).filter(v => v.personaId === personaId && v.activo);
        },

        /* Verificar si una persona tiene pago vigente a la fecha actual */
        tienePagoVigente(personaId) {
            const hoy = new Date().toISOString().split('T')[0];
            return get(KEYS.pagos).some(p =>
                p.personaId === personaId &&
                p.estado !== 'ANULADO' &&
                p.periodoFin >= hoy
            );
        },

        /* Obtener último pago registrado de una persona */
        getUltimoPagoPersona(personaId) {
            const pagos = get(KEYS.pagos)
                .filter(p => p.personaId === personaId && p.estado !== 'ANULADO')
                .sort((a, b) => new Date(b.periodoFin) - new Date(a.periodoFin));
            return pagos.length ? pagos[0] : null;
        },

        /* Listar suscriptores en mora o sin pago vigente */
        getSuscriptoresMorosos() {
            const hoy = new Date().toISOString().split('T')[0];
            const personas = get(KEYS.personas).filter(p => p.estado !== 'INACTIVO');
            return personas.filter(p => {
                const tieneVigente = get(KEYS.pagos).some(pg =>
                    pg.personaId === p.id &&
                    pg.estado !== 'ANULADO' &&
                    pg.periodoFin >= hoy
                );
                return !tieneVigente;
            }).map(p => {
                const ultimo = this.getUltimoPagoPersona(p.id);
                const vehiculos = this.getVehiculosPorPersona(p.id);
                return {
                    ...p,
                    ultimoPago: ultimo,
                    vehiculos
                };
            });
        },

        /* Registrar nuevo pago de mensualidad con validaciones y consecutivo */
        registrarPago({ personaId, vehiculoId, periodoInicio, periodoFin, monto, metodoPago, usuarioSistemaId, observaciones }) {
            if (!personaId || !periodoInicio || !periodoFin || !monto || !metodoPago) {
                throw new Error('Faltan campos obligatorios para registrar el pago');
            }

            // Validar si ya existe un pago vigente que solape exactamente el mismo período para esta persona
            const pagosExistentes = get(KEYS.pagos).filter(p =>
                p.personaId === personaId &&
                p.estado !== 'ANULADO' &&
                p.periodoInicio === periodoInicio &&
                p.periodoFin === periodoFin
            );
            if (pagosExistentes.length > 0) {
                throw new Error('Ya existe un pago registrado para este propietario en el mismo período');
            }

            const numeroRecibo = this.generarNumeroRecibo();
            const hoy = new Date().toISOString().split('T')[0];
            const estado = periodoFin >= hoy ? 'VIGENTE' : 'VENCIDO';

            const nuevoPago = crud(KEYS.pagos).add({
                numeroRecibo,
                personaId: parseInt(personaId),
                vehiculoId: vehiculoId ? parseInt(vehiculoId) : null,
                periodoInicio,
                periodoFin,
                monto: parseFloat(monto),
                metodoPago,
                usuarioSistemaId: usuarioSistemaId || 1,
                fechaPago: hoy,
                estado,
                observaciones: observaciones || 'Pago de mensualidad ordinario'
            });

            // Reactivar persona si estaba suspendida por mora
            const persona = getOne(KEYS.personas, parseInt(personaId));
            if (persona && persona.estado === 'SUSPENDIDO') {
                crud(KEYS.personas).update(persona.id, { estado: 'ACTIVO' });
            }

            return nuevoPago;
        },

        /* Anular un pago con justificación */
        anularPago(pagoId, motivo, usuarioSistemaId) {
            const pago = getOne(KEYS.pagos, pagoId);
            if (!pago) throw new Error('Pago no encontrado');
            if (pago.estado === 'ANULADO') throw new Error('El pago ya se encuentra anulado');

            return crud(KEYS.pagos).update(pagoId, {
                estado: 'ANULADO',
                motivoAnulacion: motivo || 'Anulado por error administrativo',
                usuarioAnulacionId: usuarioSistemaId || 1,
                fechaAnulacion: new Date().toISOString()
            });
        },

        /* Vehículo actualmente dentro */
        getMovimientoActivo(vehiculoId) {
            return get(KEYS.movimientos).find(m =>
                m.vehiculoId === vehiculoId && m.estado === 'DENTRO'
            ) || null;
        },

        /* Obtener información detallada de una celda con su vehículo y propietario */
        getCeldaDetalle(celdaId) {
            const celda = getOne(KEYS.celdas, celdaId);
            if (!celda) return null;
            if (celda.estado !== 'OCUPADA') return { celda, vehiculo: null, persona: null, movimiento: null };

            const movimiento = get(KEYS.movimientos).find(m => m.celdaId === celdaId && m.estado === 'DENTRO');
            if (!movimiento) return { celda, vehiculo: null, persona: null, movimiento: null };

            const vehiculo = getOne(KEYS.vehiculos, movimiento.vehiculoId);
            const persona = vehiculo ? getOne(KEYS.personas, vehiculo.personaId) : null;

            return { celda, vehiculo, persona, movimiento };
        },

        /* Celda libre para tipo de vehículo */
        getCeldaLibre(tipoVehiculo) {
            const tipoCelda = tipoVehiculo === 'MOTO' ? 'MOTO' : 'CARRO';
            return get(KEYS.celdas).find(c =>
                c.estado === 'LIBRE' && c.activa && (c.tipo === tipoCelda || c.tipo === 'MIXTA')
            ) || null;
        },

        /* Métricas estadísticas financieras y operativas */
        getStats() {
            const celdas = get(KEYS.celdas);
            const movimientos = get(KEYS.movimientos);
            const pagos = get(KEYS.pagos);
            const personas = get(KEYS.personas).filter(p => p.estado !== 'INACTIVO');
            const hoy = new Date().toISOString().split('T')[0];
            const mesActual = hoy.slice(0, 7);

            const pagosValidos = pagos.filter(p => p.estado !== 'ANULADO');
            const pagosMesActual = pagosValidos.filter(p => p.fechaPago && p.fechaPago.startsWith(mesActual));
            const recaudadoMes = pagosMesActual.reduce((acc, p) => acc + (p.monto || 0), 0);

            const suscriptoresActivos = personas.filter(p => this.tienePagoVigente(p.id)).length;
            const suscriptoresMora = personas.length - suscriptoresActivos;

            return {
                totalCeldas: celdas.filter(c => c.activa).length,
                celdasOcupadas: celdas.filter(c => c.estado === 'OCUPADA').length,
                celdasLibres: celdas.filter(c => c.estado === 'LIBRE' && c.activa).length,
                entradasHoy: movimientos.filter(m => m.fechaEntrada && m.fechaEntrada.startsWith(hoy)).length,
                salidasHoy: movimientos.filter(m => m.fechaSalida && m.fechaSalida.startsWith(hoy)).length,
                totalSuscriptores: personas.length,
                suscriptoresActivos,
                suscriptoresMora,
                totalPagosRegistrados: pagosValidos.length,
                recaudadoMes
            };
        },

        reset() {
            Object.values(KEYS).forEach(k => localStorage.removeItem(k));
            localStorage.removeItem('ac_initialized_ea3');
            localStorage.removeItem('ac_initialized');
            this.init();
        }
    };
})();

// Auto-inicializar
DB.init();

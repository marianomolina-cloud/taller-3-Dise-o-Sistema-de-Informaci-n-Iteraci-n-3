# Diagramas UML – Parqueadero "Autos Colombia"
## Iteración 3: Gestión de Pagos y Consolidación de las 3 Iteraciones
### Estándar UML 2.5 – Modelado en StarUML

---

## 1. Diagrama de Casos de Uso – Subsistema de Gestión de Pagos

El subsistema de pagos administra las transacciones de mensualidades, la emisión de recibos oficiales, la validación de derechos de acceso para los suscriptores y la parametrización de tarifas.

```mermaid
graph LR
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
    CU_PAG4 -.->|"«include»"| CU_PAG6
```

---

## 2. Diagrama de Casos de Uso Global (Iteraciones 1, 2 y 3)

Muestra la articulación completa entre la operación en garita (entradas/salidas), la gestión administrativa de personas y celdas, y la gestión financiera de mensualidades.

```mermaid
graph LR
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
    SYS --> CU_P4
```

---

## 3. Diagramas de Secuencia (Iteraciones 1, 2 y 3)

### Secuencia 1: Registrar Entrada de Vehículo (Iteración 1)
Describe la interacción cuando un vehículo ingresa al parqueadero, verificando pago y asignando celda.

```mermaid
sequenceDiagram
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
    UI -->> Operador: mostrarAccesoPermitido("Celda A02 asignada")
```

### Secuencia 2: Registrar Salida de Vehículo (Iteración 1)
Describe el egreso del vehículo, cálculo de tiempo de estancia y liberación atómica del espacio.

```mermaid
sequenceDiagram
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
    UI -->> Operador: notificar("Vehículo despachado. Celda A02 liberada")
```

### Secuencia 3: Gestión de Usuarios y Vehículos (Iteración 2)
Describe el alta de un nuevo cliente, validación estricta de documentos y vinculación de vehículo.

```mermaid
sequenceDiagram
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
    UI -->> Admin: actualizarTablaSuscriptores()
```

### Secuencia 4: Mantenimiento y Mapa de Celdas (Iteración 2)
Describe la inhabilitación preventiva de un espacio de parqueo para reparaciones.

```mermaid
sequenceDiagram
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
    UI -->> Admin: refrescarMapaVisual("Celda B04 marcada en GRIS")
```

### Secuencia 5: Registro de Pago y Emisión de Recibo (Iteración 3)
Describe el cobro de la mensualidad, asignación de tarifa según el vehículo y expedición del comprobante oficial.

```mermaid
sequenceDiagram
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
    UI -->> Cajero: desplegarModalRecibo("REC-2026-0006 con opción Imprimir")
```

### Secuencia 6: Validación de Pago al Ingreso (Iteración 3 y 1)
Describe la bifurcación lógica según el estado de la mensualidad al arribar al parqueadero.

```mermaid
sequenceDiagram
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
    end
```

---

## 4. Diagrama de Componentes Integral (Iteraciones 1, 2 y 3)

Ilustra la estructura modular desacoplada del sistema agrupada en Capa de Presentación, Capa de Negocio, Capa de Persistencia e Integraciones con periféricos.

```mermaid
graph TD
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
    REP_PAG --> STORE_ENGINE
```

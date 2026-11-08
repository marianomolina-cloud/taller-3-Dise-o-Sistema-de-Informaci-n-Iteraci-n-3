const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const diagrams = [
    {
        name: 'diagrama_casos_de_uso.png',
        title: 'Diagrama de Casos de Uso - Gestión de Usuarios y Celdas',
        code: `graph LR
    subgraph Actores
        ADMIN(["👑 Administrador"])
        OPER(["👷 Operador"])
        SYS(["⚙️ Motor del Sistema"])
    end

    subgraph "Parqueadero Autos Colombia - Módulo Usuarios y Celdas"
        CU_USR1("CU-01: Registrar Nuevo Propietario")
        CU_USR2("CU-02: Consultar y Filtrar Usuarios")
        CU_USR3("CU-03: Actualizar Datos de Usuario")
        CU_USR4("CU-04: Suspender / Reactivar Usuario")
        CU_USR5("CU-05: Asociar Vehículos al Usuario")
        CU_USR6("CU-06: Validar Cédula y Placa Única")
        CU_USR7("CU-07: Eliminar Usuario")

        CU_CEL1("CU-08: Registrar Nueva Celda")
        CU_CEL2("CU-09: Configurar Tipo y Sector")
        CU_CEL3("CU-10: Inhabilitar Celda por Mantenimiento")
        CU_CEL4("CU-11: Visualizar Mapa de Ocupación")
        CU_CEL5("CU-12: Asignar Celda por Tipo de Vehículo")
        CU_CEL6("CU-13: Liberar Celda en Salida")
    end

    ADMIN --> CU_USR1
    ADMIN --> CU_USR2
    ADMIN --> CU_USR3
    ADMIN --> CU_USR5
    ADMIN --> CU_USR7
    ADMIN --> CU_CEL1
    ADMIN --> CU_CEL2
    ADMIN --> CU_CEL3
    ADMIN --> CU_CEL4

    OPER --> CU_USR2
    OPER --> CU_CEL4

    CU_USR4 -.->|"«extend»"| CU_USR3
    CU_USR1 -.->|"«include»"| CU_USR6
    CU_USR5 -.->|"«include»"| CU_USR6
    CU_CEL5 -.->|"«include»"| CU_CEL4
    SYS --> CU_CEL5
    SYS --> CU_CEL6`
    },
    {
        name: 'secuencia_1_entrada_vehiculo.png',
        title: 'Diagrama de Secuencia 1: Registrar Entrada de Vehículo (Iteración 1)',
        code: `sequenceDiagram
    autonumber
    actor Operador
    participant Vista as VistaEntradas (UI)
    participant Gestor as GestorEntradas (BL)
    participant Validador as ValidadorSuscripcion
    participant RepoCelda as CeldaRepository (DA)
    participant RepoMov as MovimientoRepository (DA)

    Operador ->> Vista: ingresarPlaca(placa)
    Vista ->> Gestor: procesarIngreso(placa)
    Gestor ->> Validador: verificarMensualidad(propietarioId)
    Validador -->> Gestor: autorizarAcceso(OK / Al Día)
    Gestor ->> RepoCelda: getCeldaLibre(tipoVehiculo)
    RepoCelda -->> Gestor: celdaDisponible (e.g. A03)
    Gestor ->> RepoCelda: actualizarEstado(celdaId, "OCUPADA")
    Gestor ->> RepoMov: crearMovimiento(placa, celdaId, fechaEntrada)
    RepoMov -->> Gestor: movimientoRegistrado(id)
    Gestor -->> Vista: confirmarIngresoExitoso(tiquete)
    Vista -->> Operador: mostrarConfirmacionYCelda(A03)`
    },
    {
        name: 'secuencia_2_salida_vehiculo.png',
        title: 'Diagrama de Secuencia 2: Registrar Salida de Vehículo (Iteración 1)',
        code: `sequenceDiagram
    autonumber
    actor Operador
    participant Vista as VistaSalidas (UI)
    participant Gestor as GestorSalidas (BL)
    participant RepoMov as MovimientoRepository (DA)
    participant RepoCelda as CeldaRepository (DA)

    Operador ->> Vista: buscarPlacaSalida("ABC123")
    Vista ->> Gestor: consultarMovimientoActivo("ABC123")
    Gestor ->> RepoMov: findActivoByPlaca("ABC123")
    RepoMov -->> Gestor: movimiento(id, celdaId, fechaEntrada)
    Gestor -->> Vista: mostrarResumenSalida(tiempoEstancia, celdaId)
    Vista -->> Operador: renderizarDetalles()

    Operador ->> Vista: confirmarSalida()
    Vista ->> Gestor: ejecutarSalida(movimientoId, celdaId)
    Gestor ->> RepoMov: registrarFechaSalida(movimientoId, now)
    Gestor ->> RepoCelda: actualizarEstado(celdaId, "LIBRE")
    RepoCelda -->> Gestor: celdaLiberada(OK)
    Gestor -->> Vista: salidaConfirmada()
    Vista -->> Operador: notificarSalidaExitosa()`
    },
    {
        name: 'secuencia_3_gestion_usuarios.png',
        title: 'Diagrama de Secuencia 3: Gestión y Vinculación de Usuario con Vehículo (Iteración 2)',
        code: `sequenceDiagram
    autonumber
    actor Admin as Administrador
    participant Vista as VistaUsuarios (UI)
    participant Gestor as GestorUsuarios (BL)
    participant Validador as ValidadorPersona
    participant RepoPer as PersonaRepository (DA)
    participant RepoVeh as VehiculoRepository (DA)

    Admin ->> Vista: solicitarRegistroUsuario(datosPersona)
    Vista ->> Gestor: crearUsuario(datos)
    Gestor ->> Validador: validarUnicidadCedulaEmail(cedula, email)
    Validador -->> Gestor: validacionExitosa()
    Gestor ->> RepoPer: insertPersona(datosPersona)
    RepoPer -->> Gestor: personaIdGenerado (id: 6)
    Gestor -->> Vista: usuarioRegistrado(id: 6)
    Vista -->> Admin: mostrarToastExito()

    Admin ->> Vista: asociarVehiculo(personaId, datosVehiculo)
    Vista ->> Gestor: vincularVehiculo(personaId, placa, tipo, marca)
    Gestor ->> RepoVeh: insertVehiculo(personaId, placa, tipo)
    RepoVeh -->> Gestor: vehiculoVinculadoOk()
    Gestor -->> Vista: actualizarListaVehiculosUsuario()
    Vista -->> Admin: renderizarFlotaActualizada()`
    },
    {
        name: 'secuencia_4_mantenimiento_celdas.png',
        title: 'Diagrama de Secuencia 4: Administración y Mantenimiento de Celdas (Iteración 2)',
        code: `sequenceDiagram
    autonumber
    actor Admin as Administrador
    participant Vista as VistaCeldas (UI)
    participant Gestor as GestorCeldas (BL)
    participant RepoCelda as CeldaRepository (DA)

    Admin ->> Vista: abrirGestionCeldas()
    Vista ->> Gestor: obtenerMapaYEstatusCeldas()
    Gestor ->> RepoCelda: getAllCeldasConEstado()
    RepoCelda -->> Gestor: listaCeldas(total, libres, ocupadas)
    Gestor -->> Vista: renderizarMapaYSectores()
    Vista -->> Admin: visualizacionMapaTiempoReal()

    Admin ->> Vista: toggleInhabilitarCelda(celdaId: 15)
    Vista ->> Gestor: inhabilitarPorMantenimiento(celdaId: 15)
    Gestor ->> RepoCelda: findById(15)
    RepoCelda -->> Gestor: celda(estado: "LIBRE", activa: true)
    Gestor ->> RepoCelda: update(15, {activa: false})
    RepoCelda -->> Gestor: celdaInhabilitadaOk()
    Gestor -->> Vista: actualizarMapaEnTiempoReal()
    Vista -->> Admin: mostrarCeldaGrisInhabilitada()`
    },
    {
        name: 'diagrama_componentes.png',
        title: 'Diagrama de Componentes (Iteraciones 1 y 2)',
        code: `graph TB
    subgraph "CAPA DE PRESENTACIÓN (User Interface Components)"
        C_UI_Auth["📦 UI_LoginComponent\n(index.html / auth.js)"]
        C_UI_Dash["📦 UI_DashboardComponent\n(dashboard.html)"]
        C_UI_EntSal["📦 UI_EntradasSalidasComponent\n(entradas.html / salidas.html)"]
        C_UI_Users["📦 UI_GestionUsuariosComponent\n(usuarios.html)"]
        C_UI_Cells["📦 UI_GestionCeldasComponent\n(celdas.html)"]
    end

    subgraph "CAPA DE NEGOCIO Y CONTROLADORES (Business Logic Services)"
        S_Auth["⚙️ Servicio_Autenticacion\n(RBAC & Sessions)"]
        S_Mov["⚙️ Servicio_Movimientos\n(Entradas & Salidas Engine)"]
        S_Users["⚙️ Servicio_Usuarios\n(Clientes & Flotas)"]
        S_Cells["⚙️ Servicio_Celdas\n(Algoritmo Asignación & Mapa)"]
        S_Pagos["⚙️ Servicio_Pagos\n(Control Mensualidades)"]
    end

    subgraph "CAPA DE ACCESO A DATOS (Data Access & Repositories)"
        R_Users["🗃️ Repositorio_Usuarios"]
        R_Veh["🗃️ Repositorio_Vehiculos"]
        R_Cells["🗃️ Repositorio_Celdas"]
        R_Mov["🗃️ Repositorio_Movimientos"]
        R_Pagos["🗃️ Repositorio_Pagos"]
    end

    subgraph "CAPA DE PERSISTENCIA (Storage)"
        DB_Storage[("💾 Base de Datos\nMySQL 8.0+ / LocalStorage")]
    end

    C_UI_Auth --> S_Auth
    C_UI_Dash --> S_Cells
    C_UI_Dash --> S_Mov
    C_UI_EntSal --> S_Mov
    C_UI_EntSal --> S_Cells
    C_UI_Users --> S_Users
    C_UI_Cells --> S_Cells

    S_Mov -.-> S_Pagos
    S_Mov -.-> S_Cells
    S_Mov -.-> S_Users

    S_Auth --> R_Users
    S_Users --> R_Users
    S_Users --> R_Veh
    S_Cells --> R_Cells
    S_Mov --> R_Mov
    S_Mov --> R_Cells
    S_Pagos --> R_Pagos

    R_Users --> DB_Storage
    R_Veh --> DB_Storage
    R_Cells --> DB_Storage
    R_Mov --> DB_Storage
    R_Pagos --> DB_Storage`
    }
];

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function generateAll() {
    let i = 0;
    for (const d of diagrams) {
        i++;
        const tempHtml = path.join(__dirname, `temp_diagram_${i}.html`);
        const outPng = path.join(__dirname, '..', 'docs', 'diagramas', d.name);

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 30px;
            background: #ffffff;
            font-family: 'Segoe UI', Arial, sans-serif;
            display: inline-block;
        }
        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 20px;
        }
        .mermaid {
            display: flex;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="title">${d.title}</div>
    <div class="mermaid">
${d.code}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>`;

        fs.writeFileSync(tempHtml, html, 'utf-8');

        await new Promise((resolve, reject) => {
            const args = [
                '--headless=new',
                '--disable-gpu',
                '--no-sandbox',
                '--virtual-time-budget=3000',
                '--window-size=1600,1200',
                `--screenshot=${outPng}`,
                `file:///${tempHtml.replace(/\\/g, '/')}`
            ];
            execFile(chromePath, args, (err) => {
                if (err) return reject(err);
                console.log(`Generado: ${d.name}`);
                resolve();
            });
        });
    }
    console.log('Todos los diagramas fueron generados como imagenes PNG exitosamente.');
}

generateAll().catch(e => console.error(e));

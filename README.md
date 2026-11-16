# Sistema de Información – Parqueadero "Autos Colombia"
## Evidencia de Aprendizaje 3 (EA3): Iteración 3 – Gestión de Pagos y Consolidación Arquitectónica (3 Iteraciones)

**Institución:** Institución Universitaria Digital de Antioquia (IU Digital de Antioquia)  
**Facultad:** Facultad de Ingeniería  
**Programa:** Tecnología en Desarrollo de Software  
**Asignatura:** Ingeniería de Software (PREICA2602B020081)  
**Docente / Asesor:** Esteban Montoya  
**Estudiante:** Mariano Molina Monsalve  
**Fecha de Presentación:** Noviembre 2026  
**Medellín, Antioquia, Colombia**

---

## 📌 Descripción del Proyecto – Iteración 3: Gestión de Pagos

El sistema de información del parqueadero **"Autos Colombia"** es una solución integral diseñada para la gestión operativa y financiera de un estacionamiento comercial que opera principalmente bajo la modalidad de **mensualidad fija**.

Esta **Iteración 3 (EA3)** culmina el ciclo de desarrollo del sistema integrando el subsistema financiero y articulando las tres iteraciones construidas:
1. **Iteración 1 (Entradas y Salidas de Vehículos):** Registro de ingreso y egreso por placa, cálculo automático de tiempos de estancia y asignación de celdas libres.
2. **Iteración 2 (Gestión de Usuarios y Gestión de Celdas):** Registro y administración de clientes suscriptores, validación documental estricta, vinculación multi-vehículo y mapa interactivo de celdas en tiempo real con inhabilitación por mantenimiento.
3. **Iteración 3 (Gestión de Pagos, Cartera y Consolidación):** Recaudación de mensualidades, liquidación sugerida según la categoría del vehículo (Carro $120.000, Moto $80.000, Camioneta $150.000), emisión instantánea de recibos y comprobantes digitales oficiales con consecutivo legal (`REC-YYYY-XXXX`), control proactivo de cartera con detección de morosidad, y validación síncrona en garita para autorizar o denegar el acceso según la vigencia del pago.

---

## 🚀 Cómo ejecutar la aplicación web

1. **Clonar el repositorio oficial de GitHub:**
   ```bash
   git clone https://github.com/marianomolina-cloud/taller-3-Dise-o-Sistema-de-Informaci-n-Iteraci-n-3.git
   ```
2. **Ejecutar localmente:**
   - Opción A: Abre la carpeta `src/` y haz doble clic en `index.html` (compatible con cualquier navegador moderno sin requerir dependencias adicionales).
   - Opción B: Ejecuta el servidor Node.js incorporado:
     ```bash
     node server.js
     ```
     e ingresa en tu navegador a: `http://localhost:3000` o `http://localhost:3000/pagos.html`.
3. **Credenciales de acceso preconfiguradas:**
   - **Rol Administrador:** Usuario `admin` | Contraseña `admin123`
   - **Rol Operador / Cajero:** Usuario `operador` | Contraseña `oper123`
4. **Persistencia de datos:**
   - Utiliza `localStorage` de alta reactividad en el navegador para simular una base de datos relacional y cuenta con el script DDL completo `docs/modelo_fisico.sql` para entornos MySQL 8.0+ / MariaDB.

---

## 📁 Estructura del Repositorio (EA3)

```text
Parqueadero Diseño Sistema de Información - 3/
├── Molina_Mariano_EA3.pdf         # 📄 Documento Oficial de Entrega EA3 (Formato PDF)
├── Molina_Mariano_EA1.pdf         # 📄 Documento de Entrega con Nomenclatura solicitada
├── Molina_Mariano_EA3.html        # 🌐 Versión Web del Documento Técnico
├── MOLINA_MARIANO_EA3.md          # 📝 Memoria Técnica Completa en Formato Markdown
├── server.js                      # ⚙️ Servidor HTTP local (Node.js)
├── README.md                      # 📖 Ficha técnica de presentación del proyecto
├── src/                           # 💻 Código fuente del sistema web funcional
│   ├── index.html                 # Pantalla de Login y control de roles RBAC
│   ├── dashboard.html             # Tablero central con KPIs de ocupación y recaudación
│   ├── pagos.html                 # 💳 Módulo completo de Gestión de Pagos, Recibos y Cartera (Iteración 3)
│   ├── entradas.html              # 🟢 Registro de entradas con validación de pagos en garita
│   ├── salidas.html               # 🔴 Registro de salidas y liberación automática de celda
│   ├── celdas.html                # 🅿️ Mapa interactivo y mantenimiento de celdas
│   ├── usuarios.html              # 👥 Gestión de clientes y suscriptores
│   ├── vehiculos.html             # 🚗 Parque vehicular registrado
│   ├── historial.html             # 📋 Historial filtrable de movimientos vehiculares
│   ├── novedades.html             # ⚠️ Bitácora de incidentes y observaciones
│   ├── css/
│   │   └── main.css               # Estilos de interfaz (Glassmorphism & Clean Design)
│   └── js/
│       ├── db.js                  # Motor transaccional de datos y reglas de pagos
│       └── auth.js                # Control de sesión y componentes compartidos
├── docs/                          # 📚 Documentación técnica y diagramas UML 2.5
│   ├── staruml/
│   │   └── AutosColombia_Iteracion3.mdj # 📐 Modelo nativo completo para StarUML
│   ├── diagramas/                 # 🖼️ Diagramas exportados en alta resolución (PNG)
│   │   ├── diagrama_casos_de_uso_pagos.png
│   │   ├── diagrama_casos_de_uso.png
│   │   ├── secuencia_1_entrada_vehiculo.png
│   │   ├── secuencia_2_salida_vehiculo.png
│   │   ├── secuencia_3_gestion_usuarios.png
│   │   ├── secuencia_4_mantenimiento_celdas.png
│   │   ├── secuencia_5_registro_pago.png
│   │   ├── secuencia_6_validacion_acceso_pago.png
│   │   └── diagrama_componentes.png
│   ├── mockups/                   # 📱 Capturas de interfaces de usuario (PNG)
│   │   ├── 8_gestion_pagos.png
│   │   ├── 9_registro_pago.png
│   │   ├── 10_recibo_digital.png
│   │   ├── 11_cartera_morosos.png
│   │   └── 12_tarifas_mensualidad.png
│   ├── requisitos.md              # Requisitos Funcionales y No Funcionales formales
│   ├── historias_usuario.md       # Historias de Usuario con sintaxis Gherkin (BDD)
│   └── modelo_fisico.sql          # Script DDL SQL normalizado en MySQL 8.0+
└── scripts/                       # 🛠️ Scripts de automatización y renderizado
    ├── generate_staruml.js        # Generador del archivo nativo .mdj para StarUML
    ├── render_diagrams_to_png.js  # Renderizador de diagramas a imágenes PNG
    ├── capture_screenshots_ea3.js # Capturador automatizado de mockups en Chrome
    └── build_html_and_pdf.js      # Compilador editorial de Markdown a HTML y PDF
```

---

## 📋 Entregables de la Actividad (EA3)

Todos los entregables exigidos en la rúbrica de evaluación (100 puntos) se encuentran integrados y desarrollados a profundidad en el informe oficial [**`Molina_Mariano_EA3.pdf`**](Molina_Mariano_EA3.pdf):

### 1. Requerimientos Funcionales y No Funcionales de Gestión de Pagos (15 pts)
- **Requerimientos Funcionales:** `RF-PAG-01` a `RF-PAG-10` (Registro de pagos, liquidación según tipología vehicular, emisión de recibos oficiales con consecutivo, validación de vigencia en garita, control de cartera y morosos, reactivación automática de clientes suspendidos, prevención de pagos duplicados, búsqueda multicriterio, anulación con auditoría y cálculo de vueltos).
- **Requerimientos No Funcionales:** `RNF-01` a `RNF-08` (Rendimiento < 150 ms, seguridad financiera con RBAC, integridad transaccional de consecutivos, usabilidad, disponibilidad 99.8%, arquitectura en 3 capas documentada en UML 2.5, portabilidad e inmutabilidad de bitácora contable).

### 2. Historias de Usuario Asociadas (10 pts)
- Especificadas bajo el marco **Scrum** con estimación en Story Points (Fibonacci) y criterios de aceptación redactados en formato **BDD / Gherkin (Dado, Cuando, Entonces)**:
  - `HU-PAG-01`: Registro de pago de mensualidad y autocompletado de tarifa (5 SP)
  - `HU-PAG-02`: Generación e impresión de recibo digital oficial (3 SP)
  - `HU-PAG-03`: Validación automática de suscripción vigente en garita de acceso (5 SP)
  - `HU-PAG-04`: Monitoreo de cartera y suscriptores morosos (3 SP)
  - `HU-PAG-05`: Anulación de recibo con bitácora de auditoría (3 SP)
  - `HU-PAG-06`: Consulta multicriterio y métricas de recaudación (2 SP)

### 3. Mockups de las Historias de Usuario (10 pts)
- Prototipos de alta fidelidad capturados en PNG de alta resolución (1400x900 px):
  - **Mockup 1:** Tablero central de pagos, KPIs de recaudación y tabla de transacciones.
  - **Mockup 2:** Modal interactivo de registro de pago con asistente de caja y cambio de efectivo.
  - **Mockup 3:** Comprobante y recibo oficial de pago digital con membrete corporativo y código de barras.
  - **Mockup 4:** Panel de control de cartera y suscriptores morosos con cobro directo.
  - **Mockup 5:** Matriz de tarifas parametrizadas por tipología de vehículo.

### 4. Diagramas de Casos de Uso en StarUML (10 pts)
- Modelado formal en StarUML (`docs/staruml/AutosColombia_Iteracion3.mdj`):
  - Diagrama de Casos de Uso del Subsistema de Pagos con actores (`Administrador`, `Operador / Cajero`, `Motor del Sistema`, `Suscriptor`) y relaciones `«include»` y `«extend»`.
  - Diagrama de Casos de Uso Global articulando las Iteraciones 1, 2 y 3.

### 5. Diagramas de Secuencia en StarUML (Iteraciones 1, 2 y 3) (15 pts)
- 6 Diagramas de Secuencia exhaustivos modelados bajo el estándar UML 2.5:
  - `DS-01`: Registrar Entrada de Vehículo con validación de pago y celda (Iteración 1).
  - `DS-02`: Registrar Salida de Vehículo y liberación atómica de celda (Iteración 1).
  - `DS-03`: Gestión de Suscriptores y vinculación vehicular (Iteración 2).
  - `DS-04`: Mantenimiento e inhabilitación preventiva de celdas (Iteración 2).
  - `DS-05`: Registro de Pago de Mensualidad y emisión de recibo digital (Iteración 3).
  - `DS-06`: Validación Transaccional de Pago al Ingreso en Garita (Iteraciones 1 y 3).

### 6. Diagrama de Componentes en StarUML (Iteraciones 1, 2 y 3) (10 pts)
- Diagrama arquitectónico integral que estructura el sistema en:
  - **Capa de Presentación:** Shell/Layout, Módulo Entradas/Salidas, Módulo Usuarios/Celdas, Módulo Pagos y Dashboard.
  - **Capa de Negocio:** Servicios de Acceso, Usuarios, Celdas, Pagos, Validador de Vigencia y Generador de Recibos.
  - **Capa de Persistencia:** Repositorios de Movimientos, Usuarios, Celdas, Pagos/Tarifas y Motor de Almacenamiento.
  - **Periféricos Externos:** Impresora térmica POS y Pasarela de pagos simulada.

### 7. Formato de Plan de Pruebas Resumido Diligenciado (15 pts)
- Matriz completa de 10 casos de prueba rigurosos (`CP-PAG-01` a `CP-PAG-10`) bajo estándar **ISTQB / IEEE 829**, evaluando flujos exitosos, cálculos de tarifas, prevención de duplicados, reactivación de clientes, control de acceso en garita, gestión de morosos y anulación con auditoría contable. Todos los casos ejecutados con resultado **PASÓ**.

### 8. URL del Repositorio en GitHub y Código Fuente Actualizado (15 pts)
- Repositorio oficial público y accesible:  
  [https://github.com/marianomolina-cloud/taller-3-Dise-o-Sistema-de-Informaci-n-Iteraci-n-3.git](https://github.com/marianomolina-cloud/taller-3-Dise-o-Sistema-de-Informaci-n-Iteraci-n-3.git)

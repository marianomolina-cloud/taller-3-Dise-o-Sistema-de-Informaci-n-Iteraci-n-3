# Sistema de Información – Parqueadero "Autos Colombia"
## Evidencia de Aprendizaje 2 (EA2): Iteración 2 – Gestión de Usuarios y Gestión de Celdas

**Institución:** Institución Universitaria Digital de Antioquia (IU Digital de Antioquia)  
**Programa:** Tecnología en Desarrollo de Software  
**Asignatura:** Ingeniería de Software (PREICA2602B020081)  
**Docente / Asesor:** Esteban Montoya  
**Estudiante:** Mariano Molina Monsalve  
**Fecha:** Noviembre 2026  

---

## 📌 Descripción del Proyecto – Iteración 2

El sistema de información del parqueadero **"Autos Colombia"** está diseñado para gestionar las operaciones diarias de un parqueadero que presta servicios bajo la modalidad de **mensualidad**.

Esta **Iteración 2 (EA2)** se enfoca específicamente en dos módulos estructurales indispensables del negocio:
1. **Gestión de Usuarios y Clientes (Propietarios):** Registro con validación estricta de documentos de identidad y correos electrónicos, control de estados (Activo, Suspendido por mora, Inactivo), consulta y filtrado multicriterio, y vinculación de múltiples vehículos por cliente propietario.
2. **Gestión y Control de Celdas de Parqueo:** Configuración y parametrización de celdas físicas (clasificadas por sectores A, B, C, D, M y tipologías Carro, Moto, Camioneta, Discapacitados), monitoreo en tiempo real mediante un mapa interactivo visual, inspección detallada de vehículos en celdas ocupadas, asignación inteligente e inhabilitación preventiva por mantenimiento técnico.

---

## 🚀 Cómo ejecutar la aplicación web

1. Clona el repositorio oficial:
   ```bash
   git clone https://github.com/marianomolina-cloud/Evidencia-de-Aprendizaje-1-ingenier-a-de-software.git
   ```
2. Abre la carpeta `src/` en el explorador de archivos.
3. Haz doble clic en `index.html` (compatible con cualquier navegador: Chrome, Edge, Firefox, Safari) o ejecuta el servidor local:
   ```bash
   node server.js
   ```
   e ingresa a `http://localhost:3000`.
4. Credenciales de acceso predeterminadas:
   - **Administrador:** `admin` / `admin123`
   - **Operador:** `operador` / `oper123`
5. La aplicación utiliza `localStorage` para la persistencia de datos en modo cliente y simular la base de datos de forma inmediata y reactiva.

---

## 📁 Estructura del Repositorio (EA2)

```
Parqueadero Diseño Sistema de Información/
├── Molina_Mariano_EA2.pdf         # 📄 Documento Oficial de Entrega EA2 (Formato PDF)
├── Molina_Mariano_EA2.doc         # 📄 Documento de Entrega EA2 (Formato Word)
├── MOLINA_MARIANO_EA2.md          # 📄 Documento Fuente Técnico en Markdown
├── server.js                      # ⚙️ Servidor HTTP de desarrollo local (Node.js)
├── README.md                      # 📖 Este archivo de presentación oficial EA2
├── src/                           # 💻 Código fuente de la aplicación
│   ├── index.html                 # Pantalla de Login y control de roles
│   ├── dashboard.html             # Panel principal con mapa de celdas y métricas
│   ├── celdas.html                # 🅿️ Gestión, mantenimiento y mapa interactivo de celdas (Iteración 2)
│   ├── usuarios.html              # 👥 Gestión de clientes y vehículos asociados (Iteración 2)
│   ├── entradas.html              # Registro de entradas con validación de mensualidad y asignación
│   ├── salidas.html               # Registro de salidas y liberación automática de celda
│   ├── vehiculos.html             # Inventario general de vehículos
│   ├── pagos.html                 # Control de mensualidades y vigencia
│   ├── historial.html             # Historial de movimientos filtrable
│   ├── novedades.html             # Registro de novedades e incidentes sobre vehículos
│   ├── css/
│   │   └── main.css               # Sistema de diseño (Glassmorphism Dark Theme)
│   └── js/
│       ├── db.js                  # Capa de datos con consultas relacionales (localStorage)
│       └── auth.js                # Autenticación, sesión y notificaciones Toast
├── docs/                          # 📚 Documentación técnica de soporte
│   ├── staruml/
│   │   └── AutosColombia_Iteracion1y2.mdj # 📐 Archivo nativo para StarUML (Casos de Uso, Secuencia, Componentes)
│   ├── mockups/                   # 🖼️ Mockups de alta fidelidad
│   │   ├── 5_gestion_usuarios.png # Mockup Gestión de Usuarios y Clientes
│   │   └── 7_gestion_celdas.png   # Mockup Gestión de Celdas y Mapa del Parqueadero
│   ├── requisitos.md              # Requisitos funcionales y no funcionales
│   ├── historias_usuario.md       # Historias de usuario con criterios Gherkin
│   └── modelo_fisico.sql          # Script SQL para base de datos MySQL 8.0+
└── scripts/                       # 🛠️ Scripts utilitarios
    ├── generate_staruml.js        # Generador del modelo StarUML .mdj
    ├── capture_screenshots.js     # Captura de pantalla automatizada
    └── build_html_and_pdf.js      # Compilador del informe ejecutivo PDF
```

---

## 📋 Entregables de la Actividad (EA2)

Todos los entregables solicitados en la guía y rúbrica de evaluación se encuentran consolidados en el documento principal [**`Molina_Mariano_EA2.pdf`**](Molina_Mariano_EA2.pdf):

### 1. Requerimientos Funcionales y No Funcionales (15 pts)
- **Requerimientos de Usuarios:** `RF-USR-01` a `RF-USR-08` (alta, validación documental, búsqueda multicriterio, edición, suspensión, asociación multi-vehículo, desvinculación y eliminación controlada).
- **Requerimientos de Celdas:** `RF-CEL-01` a `RF-CEL-08` (creación de celdas, sectores A, B, C, D, M, tipos Carro/Moto/Camioneta/Discapacitados, mapa interactivo, inspección al clic, inhabilitación preventiva, asignación automática y métricas de capacidad).
- **Requerimientos No Funcionales:** `RNF-01` a `RNF-08` (rendimiento < 250 ms, usabilidad, seguridad RBAC, integridad referencial con claves únicas, concurrencia, disponibilidad 99.5%, arquitectura en 3 capas y portabilidad).

### 2. Historias de Usuario Asociadas (15 pts)
- 8 Historias de Usuario completas estructuradas con rol, deseo y beneficio (*Como / Quiero / Para*), estimación en Story Points y criterios de aceptación en formato BDD Gherkin (*Dado / Cuando / Entonces*):
  - `HU-USR-01`: Registro de nuevos clientes propietarios (5 SP)
  - `HU-USR-02`: Búsqueda, filtrado y monitoreo reactivo de usuarios (3 SP)
  - `HU-USR-03`: Actualización de datos y control de suspensión de usuarios (5 SP)
  - `HU-USR-04`: Asociación y administración de vehículos por cliente (8 SP)
  - `HU-CEL-01`: Configuración y creación de celdas físicas (5 SP)
  - `HU-CEL-02`: Visualización y monitoreo interactivo del mapa de celdas (5 SP)
  - `HU-CEL-03`: Inhabilitación preventiva de celdas por mantenimiento (3 SP)
  - `HU-CEL-04`: Asignación algorítmica inteligente de celdas (5 SP)

### 3. Mockups de Alta Fidelidad (10 pts)
- Prototipos visuales con sistema de diseño **Glassmorphism Dark Theme** disponibles en `docs/mockups/`:
  - `5_gestion_usuarios.png`: Tablero de control de usuarios, filtros de mensualidad y badges de estado.
  - `7_gestion_celdas.png`: Mapa interactivo del parqueadero por sectores, indicadores y control de operatividad.

### 4. Diagramas de Casos de Uso en STARUML (10 pts)
- Actores: Administrador, Operador y Motor del Sistema.
- Casos de uso con relaciones `«include»` y `«extend»`.
- Disponible en el archivo nativo [`docs/staruml/AutosColombia_Iteracion1y2.mdj`](docs/staruml/AutosColombia_Iteracion1y2.mdj) y en el reporte PDF.

### 5. Diagramas de Secuencia (Iteraciones 1 y 2) en STARUML (10 pts)
- 4 diagramas de secuencia modelados en StarUML:
  1. `DS-01 (Iteración 1):` Registrar Entrada de Vehículo con Validación de Mensualidad y Asignación de Celda.
  2. `DS-02 (Iteración 1):` Registrar Salida de Vehículo con Liberación Atómica de Celda.
  3. `DS-03 (Iteración 2):` Registro y Vinculación de Clientes con Flota Vehicular.
  4. `DS-04 (Iteración 2):` Administración y Mantenimiento Preventivo de Celdas.

### 6. Diagrama de Componentes (Iteraciones 1 y 2) en STARUML (10 pts)
- Desacoplamiento de componentes en arquitectura de 3 capas:
  - **Presentación:** `UI_EntradasSalidas`, `UI_GestionUsuarios`, `UI_GestionCeldas`, `UI_Dashboard`.
  - **Negocio / Servicios:** `Servicio_Movimientos`, `Servicio_Usuarios`, `Servicio_Celdas`, `Servicio_Autenticacion`, `Servicio_Pagos`.
  - **Datos / Repositorios:** `Repositorio_Usuarios`, `Repositorio_Celdas`, `Repositorio_Movimientos`, etc.

### 7. Formato de Plan de Pruebas Resumido Diligenciado (15 pts)
- Plan de pruebas estructurado bajo estándares **IEEE 829** e **ISTQB**.
- Matriz con **16 casos de prueba ejecutados** (8 para Gestión de Usuarios y 8 para Gestión de Celdas).
- Cobertura de casos positivos, negativos, validaciones de formato, unicidad y condiciones de borde.
- **Resultado:** 100% Casos Aprobados (**PASÓ**).

### 8. Enlace al Repositorio de GitHub y Código Actualizado (15 pts)
- **URL Oficial del Repositorio:**  
  [https://github.com/marianomolina-cloud/Evidencia-de-Aprendizaje-1-ingenier-a-de-software](https://github.com/marianomolina-cloud/Evidencia-de-Aprendizaje-1-ingenier-a-de-software)
- Código fuente funcional actualizado con trazabilidad directa a los requerimientos de la Iteración 2.

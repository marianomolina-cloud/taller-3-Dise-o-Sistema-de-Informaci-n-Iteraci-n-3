# Parqueadero Autos Colombia – Sistema de Información
## Iteración 2: Gestión de Usuarios y Gestión de Celdas (EA2)
### Proyecto de Ingeniería de Software – IU Digital de Antioquia

**Estudiante:** Mariano Molina Monsalve  
**Programa:** Tecnología en Desarrollo de Software  
**Asignatura:** Ingeniería de Software (PREICA2602B020081)  
**Docente / Asesor:** Esteban Montoya  
**Entregas:** EA1 (Iteración 1) | EA2 (Iteración 2)  

---

## 🚀 Cómo ejecutar el sistema

1. Clona o descarga el repositorio:
   ```bash
   git clone https://github.com/marianomolina-cloud/Evidencia-de-Aprendizaje-1-ingenier-a-de-software.git
   ```
2. Abre la carpeta `src/` en el explorador de archivos.
3. Haz doble clic en `index.html` (o abre con Google Chrome, Mozilla Firefox o Microsoft Edge).
4. También puedes usar el servidor local Node.js incluido:
   ```bash
   node server.js
   ```
   E ingresar a: `http://localhost:3000`
5. Credenciales de acceso predeterminadas:
   - **Administrador:** `admin` / `admin123`
   - **Operador:** `operador` / `oper123`
6. El sistema inicializa automáticamente datos de prueba en `localStorage`.

---

## 📁 Estructura del Repositorio

```
Parqueadero Diseño Sistema de Información/
├── Molina_Mariano_EA2.pdf         # 📄 Documento Oficial de Entrega EA2 (Formato PDF)
├── Molina_Mariano_EA2.doc         # 📄 Documento de Entrega EA2 (Formato Word)
├── MOLINA_MARIANO_EA2.md          # 📄 Documento Fuente en Markdown de EA2
├── MOLINA_MARIANO_EA1.md          # 📄 Documento Histórico de EA1 (Iteración 1)
├── server.js                      # ⚙️ Servidor HTTP local de desarrollo en Node.js
├── src/                           # 💻 Código fuente de la aplicación web
│   ├── index.html                 # Login y autenticación por roles
│   ├── dashboard.html             # Panel de control y mapa en vivo
│   ├── entradas.html              # Registro de entradas y asignación de celda
│   ├── salidas.html               # Registro de salidas y liberación de celda
│   ├── usuarios.html              # 👥 Gestión integral de usuarios y vehículos (Iteración 2)
│   ├── celdas.html                # 🅿️ Gestión, mantenimiento y mapa de celdas (Iteración 2)
│   ├── vehiculos.html             # Inventario vehicular
│   ├── pagos.html                 # Control de mensualidades y vigencia
│   ├── historial.html             # Registro histórico de movimientos
│   ├── novedades.html             # Registro de incidentes sobre vehículos
│   ├── css/
│   │   └── main.css               # Sistema de diseño (Glassmorphism Dark Theme)
│   └── js/
│       ├── db.js                  # Motor de persistencia (localStorage) + consultas relacionales
│       └── auth.js                # Control de sesión, layout dinámico y notificaciones toast
├── docs/                          # 📚 Documentación técnica del proyecto
│   ├── staruml/
│   │   └── AutosColombia_Iteracion1y2.mdj # 📐 Archivo nativo StarUML (Casos de Uso, Secuencia, Componentes)
│   ├── mockups/                   # 🖼️ Capturas de alta fidelidad de las interfaces
│   │   ├── 1_login.png
│   │   ├── 2_dashboard.png
│   │   ├── 3_registro_entrada.png
│   │   ├── 4_registro_salida.png
│   │   ├── 5_gestion_usuarios.png # Mockup oficial Gestión de Usuarios (Iteración 2)
│   │   ├── 6_historial_movimientos.png
│   │   └── 7_gestion_celdas.png   # Mockup oficial Gestión de Celdas (Iteración 2)
│   ├── requisitos.md              # Especificación de RF y RNF
│   ├── historias_usuario.md       # Historias de usuario con criterios Gherkin
│   ├── diagramas_uml.md           # Diagramas UML en sintaxis Mermaid
│   └── modelo_fisico.sql          # Script DDL/DML MySQL para despliegue en producción
└── scripts/                       # 🛠️ Scripts de soporte y generación automatizada
    ├── capture_screenshots.js     # Captura automatizada de vistas con Chrome headless
    ├── generate_staruml.js        # Generador de modelos .mdj para StarUML
    └── build_html_and_pdf.js      # Compilador a reporte ejecutivo PDF
```

---

## 📋 Entregables de la Iteración 2 (EA2)

### 1. Requerimientos Funcionales y No Funcionales (15 pts)
- **Requerimientos Funcionales de Usuarios:** Registro con validación documental, consulta multicriterio, edición de datos, suspensión inmediata de acceso, gestión multi-vehículo por cliente y eliminación protegida (`RF-USR-01` a `RF-USR-08`).
- **Requerimientos Funcionales de Celdas:** Alta de celdas, categorización por sector y tipo (`CARRO`, `MOTO`, `CAMIONETA`, `DISCAPACITADOS`), monitoreo gráfico reactivo, modal de inspección al clic, inhabilitación preventiva y liberación atómica (`RF-CEL-01` a `RF-CEL-08`).
- **Requerimientos No Funcionales:** Rendimiento (< 250 ms), usabilidad (Nielsen), seguridad (RBAC), integridad referencial (UNIQUE keys), concurrencia sin carreras, disponibilidad (99.5%), mantenibilidad (3 capas) y portabilidad cross-browser (`RNF-01` a `RNF-08`).

### 2. Historias de Usuario Asociadas (15 pts)
- Redacción ágil en formato Scrum con estimación en Story Points y criterios de aceptación en formato BDD Gherkin (**Dado / Cuando / Entonces**).
- Cobertura completa:
  - `HU-USR-01`: Registro de nuevos clientes propietarios (5 SP)
  - `HU-USR-02`: Búsqueda, filtrado y monitoreo de usuarios (3 SP)
  - `HU-USR-03`: Actualización y suspensión de usuarios (5 SP)
  - `HU-USR-04`: Asociación y gestión de vehículos por cliente (8 SP)
  - `HU-CEL-01`: Registro y parametrización de celdas físicas (5 SP)
  - `HU-CEL-02`: Monitoreo visual interactivo del mapa de celdas (5 SP)
  - `HU-CEL-03`: Inhabilitación preventiva de celdas por mantenimiento (3 SP)
  - `HU-CEL-04`: Asignación algorítmica inteligente de celdas (5 SP)

### 3. Mockups de Alta Fidelidad (10 pts)
- Interfaz gráfica basada en **Glassmorphism Dark Mode** diseñada para trabajo continuo sin fatiga visual.
- Mockups documentados con capturas en `docs/mockups/`:
  - `5_gestion_usuarios.png`: Tablero de control de usuarios, filtros de mensualidad y badges de estado.
  - `7_gestion_celdas.png`: Mapa interactivo del parqueadero por sectores (A, B, C, D, M), panel de indicadores y control de operatividad.

### 4. Diagramas de Casos de Uso en STARUML (10 pts)
- Actores: Administrador, Operador y Motor del Sistema.
- Casos de uso estructurados con relaciones `«include»` y `«extend»`.
- Disponible en el archivo nativo `docs/staruml/AutosColombia_Iteracion1y2.mdj` y renderizado en Markdown/PDF.

### 5. Diagramas de Secuencia (Iteraciones 1 y 2) en STARUML (10 pts)
- Cuatro diagramas de interacción temporal entre capas:
  1. **DS-01 (Iteración 1):** Registrar Entrada de Vehículo con Validación de Mensualidad y Asignación de Celda.
  2. **DS-02 (Iteración 1):** Registrar Salida de Vehículo con Liberación Atómica de Celda.
  3. **DS-03 (Iteración 2):** Registro y Vinculación de Clientes con Flota Vehicular.
  4. **DS-04 (Iteración 2):** Administración, Monitoreo e Inhabilitación Preventiva de Celdas.

### 6. Diagrama de Componentes (Iteraciones 1 y 2) en STARUML (10 pts)
- Modelado de arquitectura de software en 3 capas:
  - **Capa de Presentación:** Componentes UI (`UI_EntradasSalidas`, `UI_GestionUsuarios`, `UI_GestionCeldas`, `UI_Dashboard`).
  - **Capa de Negocio:** Servicios y controladores (`Servicio_Movimientos`, `Servicio_Usuarios`, `Servicio_Celdas`, `Servicio_Autenticacion`, `Servicio_Pagos`).
  - **Capa de Datos:** Repositorios tipados (`Repositorio_Usuarios`, `Repositorio_Celdas`, etc.) y motor de persistencia.

### 7. Formato de Plan de Pruebas Resumido Diligenciado (15 pts)
- Formato estructurado bajo estándares **IEEE 829** e **ISTQB**.
- Matriz con **16 casos de prueba ejecutados** (8 para Gestión de Usuarios y 8 para Gestión de Celdas):
  - Casos de prueba positivos, negativos, validaciones de formato, duplicidad y condiciones de borde.
  - Resultado: **100% Casos Aprobados (PASÓ)** sin incidencias críticas.

### 8. Repositorio en GitHub con Código Actualizado (15 pts)
- URL del repositorio público:  
  **https://github.com/marianomolina-cloud/Evidencia-de-Aprendizaje-1-ingenier-a-de-software**
- Actualización verificable del código fuente con trazabilidad directa a los requerimientos de la Iteración 2.

---

## 🛠️ Tecnologías y Estándares Aplicados
- **Lenguajes y Frontend:** HTML5 Semántico, CSS3 Vanilla con variables CSS y CSS Grid, JavaScript moderno (ES6+).
- **Herramienta de Modelado UML:** **StarUML v6** (archivo nativo `.mdj` incluido) y sintaxis Mermaid.
- **Estándares de Ingeniería de Software:** IEEE 829 (Test Plans), ISTQB, Scrum Ágil, Arquitectura Three-Tier (MVC).
- **Control de Versiones:** Git & GitHub.

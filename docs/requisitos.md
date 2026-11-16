# Requisitos del Sistema – Parqueadero "Autos Colombia"
## Iteración 3: Gestión de Pagos y Consolidación Arquitectónica (Iteraciones 1, 2 y 3)

---

## 1. Requerimientos Funcionales (RF) – Iteración 3: Gestión de Pagos

### RF-PAG-01: Registro de Pago de Mensualidad
- **ID:** `RF-PAG-01`
- **Nombre:** Registro y Liquidación de Mensualidades
- **Descripción:** El sistema debe permitir registrar los pagos de mensualidad de los suscriptores activos, capturando el suscriptor (propietario), el vehículo vinculado, el mes o período de cobertura (fecha inicio y fecha fin), el valor pagado, la fecha de la transacción y el medio de pago (Efectivo, Transferencia / PSE o Tarjeta).
- **Actor Principal:** Operador / Cajero, Administrador
- **Prioridad:** Alta (Must Have)
- **Criterio de Éxito:** El pago queda persistido con estado `VIGENTE` y habilita el acceso vehicular del suscriptor.

### RF-PAG-02: Liquidación de Tarifas Parametrizadas por Tipología Vehicular
- **ID:** `RF-PAG-02`
- **Nombre:** Determinación Automática del Monto a Pagar
- **Descripción:** Al seleccionar el suscriptor y el vehículo correspondiente, el sistema debe prellenar de manera automática el monto de la mensualidad según la tarifa oficial configurada para la tipología del vehículo (`CARRO`: $120.000 COP, `MOTO`: $80.000 COP, `CAMIONETA`: $150.000 COP).
- **Actor Principal:** Sistema, Operador / Cajero
- **Prioridad:** Alta (Must Have)

### RF-PAG-03: Emisión de Recibo y Comprobante Digital con Consecutivo Oficial
- **ID:** `RF-PAG-03`
- **Nombre:** Generación de Recibo Digital Oficial Imprimible
- **Descripción:** Tras confirmar un pago exitoso, el sistema debe generar de manera instantánea un comprobante de pago digital con número consecutivo único e irrepetible (formato `REC-YYYY-XXXX`), membrete institucional del parqueadero, NIT, datos del cliente, vehículo, desglose del valor pagado, período cubierto, código de barras/QR de verificación y firma del cajero, con opción de impresión directa en formato térmico POS o exportación digital.
- **Actor Principal:** Operador / Cajero, Suscriptor / Cliente
- **Prioridad:** Alta (Must Have)

### RF-PAG-04: Verificación Automática de Vigencia de Suscripción en Garita de Acceso
- **ID:** `RF-PAG-04`
- **Nombre:** Validación Transaccional de Pagos al Ingreso Vehicular
- **Descripción:** Al momento de ingresar una placa en el módulo de entradas (Iteración 1), el sistema debe consultar en tiempo real el registro de pagos del propietario. Si la fecha actual se encuentra dentro del rango de vigencia (`periodoInicio <= hoy <= periodoFin`) y el pago no está anulado, el sistema aprueba el acceso. En caso contrario, el sistema bloquea el ingreso alertando "ACCESO DENEGADO - Mensualidad en mora".
- **Actor Principal:** Sistema, Operador de Garita
- **Prioridad:** Alta (Must Have)

### RF-PAG-05: Control de Cartera y Detección de Suscriptores Morosos
- **ID:** `RF-PAG-05`
- **Nombre:** Monitoreo y Gestión de Clientes en Mora
- **Descripción:** El sistema debe proveer una vista dedicada de cartera que liste en tiempo real todos los clientes que no cuenten con una mensualidad activa para el mes en curso, indicando datos de contacto (teléfono y correo), vehículos asociados, último período pagado y botón de acción directa para registrar el pago inmediato.
- **Actor Principal:** Administrador, Operador / Cajero
- **Prioridad:** Alta (Must Have)

### RF-PAG-06: Consulta y Filtrado Multicriterio del Historial de Pagos
- **ID:** `RF-PAG-06`
- **Nombre:** Auditoría y Búsqueda Reactiva de Transacciones
- **Descripción:** El sistema debe permitir consultar todo el histórico de pagos con filtrado dinámico por número de recibo, nombre o cédula del cliente, estado del pago (`VIGENTE`, `VENCIDO`, `ANULADO`) y medio de pago utilizado.
- **Actor Principal:** Administrador, Operador
- **Prioridad:** Media (Should Have)

### RF-PAG-07: Anulación Controlada de Recibos de Pago con Auditoría
- **ID:** `RF-PAG-07`
- **Nombre:** Anulación Justificada de Transacciones Inconsistentes
- **Descripción:** Solo los usuarios con rol `ADMINISTRADOR` pueden anular un recibo de pago erróneo. El sistema debe solicitar obligatoriamente un motivo de anulación, registrar la fecha, hora y usuario responsable, y actualizar el estado a `ANULADO` sin eliminar físicamente el registro contable para preservar la trazabilidad fiscal.
- **Actor Principal:** Administrador
- **Prioridad:** Media (Should Have)

### RF-PAG-08: Asistente de Caja y Liquidación de Efectivo
- **ID:** `RF-PAG-08`
- **Nombre:** Cálculo Automático de Cambio / Vueltos
- **Descripción:** En transacciones en efectivo, el sistema debe permitir ingresar el monto entregado por el cliente y calcular de forma reactiva el cambio exacto a devolver, impidiendo procesar la transacción si el efectivo recibido es menor al monto liquidado.
- **Actor Principal:** Operador / Cajero
- **Prioridad:** Baja (Nice to Have)

### RF-PAG-09: Parametrización y Actualización de Tarifas
- **ID:** `RF-PAG-09`
- **Nombre:** Configuración Paramétrica de Valores de Mensualidad
- **Descripción:** El sistema debe permitir al Administrador consultar y ajustar los valores mensuales asignados a cada categoría vehicular (Carro, Moto, Camioneta) sin alterar el histórico de cobros previos.
- **Actor Principal:** Administrador
- **Prioridad:** Media (Should Have)

### RF-PAG-10: Métricas Financieras y Consolidado de Recaudación
- **ID:** `RF-PAG-10`
- **Nombre:** Tablero de Control Financiero
- **Descripción:** El sistema debe calcular y presentar en el dashboard principal y en el módulo de pagos las métricas de: total recaudado en el mes, porcentaje de suscriptores al día vs en mora, y recuento de transacciones históricas.
- **Actor Principal:** Administrador, Operador
- **Prioridad:** Alta (Must Have)

---

## 2. Requerimientos No Funcionales (RNF)

| ID | Atributo de Calidad | Requisito No Funcional | Métrica / Criterio de Aceptación |
| :--- | :--- | :--- | :--- |
| **RNF-01** | **Rendimiento** | La validación de vigencia de suscripción al digitar la placa en garita debe demorar menos de 150 milisegundos para no retrasar la entrada. | Tiempo de ejecución de consulta de pago ≤ 150 ms en entorno local. |
| **RNF-02** | **Seguridad Financiera** | Control de Acceso Basado en Roles (RBAC). Solo Administradores pueden anular recibos o modificar tarifas. Trazabilidad total de transacciones. | Denegación automática a operadores en acciones administrativas contables. |
| **RNF-03** | **Integridad de Datos** | Consecutivo de recibos estrictamente secuencial y no repetible (`REC-YYYY-XXXX`). Restricción estricta de no permitir dos pagos activos para la misma persona en idéntico mes. | Validación de unicidad de período en capa de negocio y base de datos. |
| **RNF-04** | **Usabilidad** | El registro de un pago por parte del cajero debe completarse en menos de 4 clics y menos de 20 segundos mediante autocompletado inteligente. | Tasa de completitud en pruebas de usuario de caja ≥ 95%. |
| **RNF-05** | **Disponibilidad** | Operación continua del subsistema de validación de pagos durante las 24 horas del día sin interrupciones. | SLA de disponibilidad del servicio ≥ 99.8%. |
| **RNF-06** | **Mantenibilidad** | Arquitectura en capas desacopladas (Presentación, Lógica de Negocio y Persistencia) documentada en StarUML bajo estándar UML 2.5. | Cumplimiento del principio de responsabilidad única (SRP) y Clean Code. |
| **RNF-07** | **Portabilidad y Compatibilidad** | El sistema y los recibos digitales deben ser visualizables y utilizables en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari) y en dispositivos POS táctiles. | Renderizado fidedigno en resoluciones desde 1024x768 hasta 1920x1080. |
| **RNF-08** | **Auditoría Contable** | Ningún registro de pago se elimina físicamente de la base de datos (Soft Delete / Marcado de estado ANULADO) garantizando trazabilidad fiscal. | Integridad de bitácora y auditoría verificable al 100%. |

# Historias de Usuario – Parqueadero "Autos Colombia"
## Iteración 3: Módulo de Gestión de Pagos

---

### Resumen del Sprint Backlog (Iteración 3)

| ID | Título de la Historia de Usuario | Rol / Actor | Story Points (Fibonacci) | Prioridad (MoSCoW) |
| :--- | :--- | :--- | :--- | :--- |
| **HU-PAG-01** | Registro de Pago de Mensualidad y Autocompletado de Tarifa | Operador / Cajero | 5 | Must Have |
| **HU-PAG-02** | Generación e Impresión de Recibo Digital Oficial | Operador / Cajero | 3 | Must Have |
| **HU-PAG-03** | Validación de Suscripción Vigente en Garita de Acceso | Operador Garita / Sistema | 5 | Must Have |
| **HU-PAG-04** | Monitoreo de Cartera y Suscriptores Morosos | Administrador / Cajero | 3 | Must Have |
| **HU-PAG-05** | Anulación de Recibo con Bitácora de Auditoría | Administrador | 3 | Should Have |
| **HU-PAG-06** | Consulta Multicriterio y Métricas de Recaudación | Administrador / Operador | 2 | Should Have |

---

### HU-PAG-01: Registro de Pago de Mensualidad y Autocompletado de Tarifa

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-01` |
| **Épica:** | Gestión Financiera y Facturación de Suscriptores |
| **Título:** | Registrar pago de mensualidad con tarifa predeterminada por tipo de vehículo |
| **Actor:** | Operador / Cajero de Parqueadero |
| **Story Points:** | 5 |
| **Prioridad:** | Alta (Must Have) |

#### Enunciado de Usuario
> **Como** cajero del parqueadero "Autos Colombia",  
> **Quiero** registrar el cobro de la mensualidad de un cliente suscriptor seleccionando su nombre y vehículo,  
> **Para** certificar el recaudo oportuno, renovar su vigencia de acceso y mantener al día las cuentas del parqueadero.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Registro exitoso de pago de mensualidad en efectivo
  Dado que el operador se encuentra en el módulo de pagos y abre el modal "Registrar Pago"
  Cuando selecciona al cliente "Carlos Martínez López"
  Y el sistema detecta su vehículo asociado con tipología "CARRO"
  Entonces el sistema preselecciona automáticamente el monto de "$120.000 COP"
  Y al indicar el mes de cobertura "Noviembre 2026", método "EFECTIVO" e ingresar "$150.000 COP" recibidos
  Entonces el sistema calcula reactivamente el cambio en "$30.000 COP"
  Y al presionar "Confirmar y Emitir Recibo", el pago queda guardado con número consecutivo único
  Y el estado del pago queda registrado como "VIGENTE".

Escenario: Prevención de pago duplicado en el mismo período
  Dado que el suscriptor "Carlos Martínez López" ya cuenta con un pago vigente para "Noviembre 2026"
  Cuando el cajero intenta ingresar un segundo pago para el mismo cliente en idéntico mes
  Entonces el sistema bloquea la transacción
  Y muestra un mensaje de alerta: "Ya existe un pago registrado para este propietario en el mismo período".

Escenario: Reactivación automática de suscriptor suspendido tras el pago
  Dado que el suscriptor "María Sánchez Ruiz" se encontraba en estado "SUSPENDIDO" por mora
  Cuando el cajero registra exitosamente el pago de su mensualidad pendiente
  Entonces el sistema actualiza automáticamente el estado del cliente a "ACTIVO" en la base de datos.
```

---

### HU-PAG-02: Generación e Impresión de Recibo Digital Oficial

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-02` |
| **Épica:** | Facturación y Soporte al Cliente |
| **Título:** | Generar e imprimir comprobante digital de pago con consecutivo legal |
| **Actor:** | Operador / Cajero, Suscriptor |
| **Story Points:** | 3 |
| **Prioridad:** | Alta (Must Have) |

#### Enunciado de Usuario
> **Como** cliente suscriptor y cajero del parqueadero,  
> **Quiero** obtener un recibo digital oficial con membrete y consecutivo tras registrar un pago,  
> **Para** contar con un comprobante formal del servicio cancelado ante cualquier reclamación o control de garita.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Despliegue automático del recibo tras guardar la transacción
  Dado que se ha completado el registro de un pago con identificador 1
  Cuando el sistema confirma la persistencia de datos
  Entonces se abre automáticamente el modal con el recibo digital con membrete "AUTOS COLOMBIA S.A.S"
  Y el recibo muestra el consecutivo "REC-2026-0001", NIT, fecha de expedición, nombre y cédula del cliente
  Y el rango de fechas de cobertura (ej: "2026-11-01 al 2026-11-30"), monto cancelado y método de pago.

Escenario: Impresión térmica del recibo
  Dado que el recibo digital se encuentra en pantalla
  Cuando el usuario hace clic en el botón "🖨️ Imprimir Recibo"
  Entonces el sistema abre la ventana de impresión nativa del sistema operativo con formato estilizado para impresora térmica de 80 mm.
```

---

### HU-PAG-03: Validación Automática de Suscripción Vigente en Garita de Acceso

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-03` |
| **Épica:** | Control de Acceso Integrado |
| **Título:** | Validar vigencia de pago al ingresar placa vehicular |
| **Actor:** | Operador de Garita / Motor del Sistema |
| **Story Points:** | 5 |
| **Prioridad:** | Alta (Must Have) |

#### Enunciado de Usuario
> **Como** operador de garita de acceso,  
> **Quiero** que al digitar la placa de un vehículo el sistema verifique de forma automática si tiene su mensualidad al día,  
> **Para** autorizar el ingreso solo a vehículos debidamente cubiertos y evitar accesos no remunerados.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Ingreso autorizado para vehículo con mensualidad vigente
  Dado que el vehículo con placa "ABC123" pertenece a un cliente con mensualidad vigente para el mes actual
  Cuando el operador ingresa la placa "ABC123" en la pantalla de Registro de Entrada
  Entonces el sistema muestra el estado de mensualidad en color verde: "Al Día"
  Y habilita el botón "Confirmar Entrada" asignando automáticamente la primera celda libre del tipo "CARRO".

Escenario: Ingreso bloqueado por mensualidad vencida o en mora
  Dado que el vehículo con placa "JKL789" pertenece a un cliente cuya última mensualidad venció el mes anterior
  Cuando el operador consulta la placa "JKL789"
  Entonces el sistema muestra el estado de mensualidad en color rojo: "En Mora / Vencido"
  Y bloquea la confirmación de ingreso mostrando la alerta: "ACCESO DENEGADO - El suscriptor presenta mensualidad vencida. Remitir a caja para pago".
```

---

### HU-PAG-04: Monitoreo de Cartera y Suscriptores Morosos

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-04` |
| **Épica:** | Cartera y Cobranza |
| **Título:** | Visualizar suscriptores morosos y gestionar cobro directo |
| **Actor:** | Administrador, Operador / Cajero |
| **Story Points:** | 3 |
| **Prioridad:** | Alta (Must Have) |

#### Enunciado de Usuario
> **Como** administrador del parqueadero,  
> **Quiero** disponer de un panel con el listado actualizado de clientes sin pago vigente,  
> **Para** gestionar oportunamente los cobros de cartera y mantener el control financiero del negocio.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Consulta del listado de morosos
  Dado que existen clientes suscritos que no han pagado la mensualidad del mes actual
  Cuando el usuario hace clic en la pestaña "⚠️ Cartera y Morosos"
  Entonces el sistema lista todos los clientes en mora con su cédula, nombre, teléfono, email, vehículos registrados y último período pagado
  Y muestra un contador en la pestaña con la cantidad exacta de clientes en mora.

Escenario: Registro de cobro directo desde la tabla de morosos
  Dado que el administrador visualiza al cliente moroso "María Sánchez Ruiz"
  Cuando hace clic en el botón "💵 Cobrar Mensualidad" de su fila
  Entonces el sistema abre el modal de registro de pago con el cliente preseleccionado y sus datos listos para liquidación.
```

---

### HU-PAG-05: Anulación de Recibo con Bitácora de Auditoría

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-05` |
| **Épica:** | Auditoría y Seguridad Transaccional |
| **Título:** | Anular un recibo de pago erróneo justificando el motivo |
| **Actor:** | Administrador |
| **Story Points:** | 3 |
| **Prioridad:** | Media (Should Have) |

#### Enunciado de Usuario
> **Como** administrador del parqueadero,  
> **Quiero** anular un recibo de pago expedido por error ingresando el motivo de la anulación,  
> **Para** corregir inconsistencias contables sin eliminar físicamente el registro de la auditoría.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Anulación justificada de un recibo
  Dado que existe un pago registrado con ID 2
  Cuando el administrador hace clic en el botón de anular (✕)
  Y confirma la acción ingresando el motivo "Error en medio de pago seleccionado por el cajero"
  Entonces el sistema cambia el estado del pago a "ANULADO"
  Y registra la fecha, hora y usuario que autorizó la anulación
  Y el pago anulado no se suma en las estadísticas de recaudación mensual.
```

---

### HU-PAG-06: Consulta Multicriterio y Métricas de Recaudación

| Metadato | Detalle |
| :--- | :--- |
| **ID Historia:** | `HU-PAG-06` |
| **Épica:** | Reportes y Analítica Financiera |
| **Título:** | Filtrar historial de pagos y consultar métricas financieras consolidadas |
| **Actor:** | Administrador, Operador |
| **Story Points:** | 2 |
| **Prioridad:** | Media (Should Have) |

#### Enunciado de Usuario
> **Como** usuario administrativo del sistema,  
> **Quiero** filtrar los pagos por texto, estado o método y ver las tarjetas de resumen financiero,  
> **Para** conocer la salud económica del parqueadero y realizar cierres de caja confiables.

#### Criterios de Aceptación (Gherkin / BDD)

```gherkin
Escenario: Filtrado dinámico de transacciones
  Dado que existen múltiples pagos en el historial
  Cuando el usuario escribe "REC-2026-0001" en la barra de búsqueda
  Entonces la tabla filtra inmediatamente mostrando únicamente la fila del recibo correspondiente.

Escenario: Visualización de métricas en tarjetas superiores
  Dado que el usuario ingresa a la vista de pagos
  Entonces el sistema despliega las tarjetas con "Recaudado Este Mes", "Suscriptores Al Día", "Suscriptores En Mora" y "Total Pagos Registrados" con valores calculados en tiempo real.
```

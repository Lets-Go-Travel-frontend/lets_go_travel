# 🏗️ SPRINT 04: Entrega Técnica y Cierre de Contrato

**¿Por qué este Sprint?**
Un microservicio de producción no está completo sin una interfaz de comunicación (contrato) estandarizada y documentación de despliegue clara. El equipo del Centralizador debe recibir una caja negra que funcione perfectamente siguiendo el protocolo gRPC. Además, el frontend de pruebas debe quedar como una herramienta de validación, no como una fuente de datos simulados.

**¿Cómo se hará?**
Se cerrará el fichero `.proto` con todas las extensiones B2B y se generará un manual de producción que servirá como guía de integración.

---

## 🎫 Ticket: CON-001 - Consistencia de Contrato gRPC (B2B)
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [x] **Task 1.1:** Validar que `provider.proto` tenga los campos `company` (name, cif, address) y `agencyReference`.
- [x] **Task 1.2:** Validar que el mensaje `Passenger` incluya `expirationDocumentDate`.
- [x] **Task 1.3:** Ejecutar `npm run gen-proto` y verificar que los tipos TypeScript en `src/interfaces/gen/` coinciden al 100% con la lógica del Service.
- [x] **Task 1.4:** Comprobar que todos los RPCs (`Search`, `Details`, `Book`, `Cancel`) están correctamente tipados sin usar `any`.

---

## 🎫 Ticket: FE-002 - Refactor Final del Sandbox
**Estado:** PENDING
**Prioridad:** LOW

### Tasks:
- [x] **Task 2.1:** Limpiar la UI del Sandbox para que solo muestre campos que realmente se envían al GDS.
- [x] **Task 2.2:** Añadir un visualizador de JSON "Raw" para que el desarrollador pueda ver exactamente qué está enviando el Microservicio al GDS.
- [x] **Task 2.3:** Eliminar cualquier botón de "Skip Validation" o bypass de seguridad que se haya usado en desarrollo.

---

## 🎫 Ticket: DOC-002 - Manual de Producción y Despliegue
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [x] **Task 3.1:** Crear `README_PRODUCCION.md` con la lista de variables de entorno reales.
- [x] **Task 3.2:** Documentar el flujo de error: mapeo de códigos numéricos de Veturis a tipos `GdsErrorType`.
- [x] **Task 3.3:** Añadir instrucciones para la ejecución del ETL: frecuencia recomendada y gestión de logs de error en Redis.
- [x] **Task 3.4:** Generar un esquema de arquitectura final para el proyecto representativo de la "Hollow Shell".

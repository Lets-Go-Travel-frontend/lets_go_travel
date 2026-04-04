# 🧹 SPRINT 01: Purga Integral y De-Mocking Quirúrgico

**¿Por qué este Sprint?**
El microservicio actual contiene "muletas" técnicas: IDs de hotel hardcodeados, un servidor mock local que intercepta peticiones y lógica en el frontend que no existiría en producción (como el catálogo simulado). Para entregar un producto premium, estas muletas deben ser eliminadas sin romper la arquitectura Hollow Shell.

**¿Cómo se hará?**
Se aplicará una limpieza de atrás hacia adelante: primero borrando la infraestructura de simulación, luego saneando el Service y finalmente simplificando la UI de pruebas.

---

## 🎫 Ticket: SYS-001 - Eliminación de Infraestructura Mock
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [x] **Task 1.1:** Eliminar el fichero `tests/mocks/veturisMockServer.ts`.
- [x] **Task 1.2:** Eliminar el comando `"mock": "ts-node tests/mocks/veturisMockServer.ts"` del `package.json` de `ms-veturis`.
- [x] **Task 1.3:** Purgar el fichero `tests/unit/robustness.test.ts` de cualquier referencia a URLs de localhost:8088.

---

## 🎫 Ticket: SVC-001 - Saneamiento de VeturisService.ts
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [x] **Task 2.1 (Memoria):** Eliminar la variable estática `hotelMetaCache` y el método `initHotelCache()`. El microservicio ya no debe cargar ficheros CSV al arrancar.
- [x] **Task 2.2 (Lógica Hardcoded):** Buscar y eliminar cualquier `if (hotelId === '9553')` o similares en los métodos `search()` y `getHotelMeta()`.
- [x] **Task 2.3 (Enriquecimiento):** Refactorizar `getHotelMeta` para que devuelva un objeto vacío o genérico temporalmente hasta que se implemente la fase de Redis en el Sprint 2.
- [x] **Task 2.4 (Simulación de Errores):** Eliminar la captura del ID `ERROR_1824` que disparaba fallos artificiales.

---

## 🎫 Ticket: FE-001 - Reducción del Sandbox a Visualizador Real
**Estado:** PENDING
**Prioridad:** MEDIUM

### Tasks:
- [x] **Task 3.1:** Eliminar el estado `catalog` y la función `handleFetchCatalog` de `app/test-veturis/page.tsx`.
- [x] **Task 3.2:** Eliminar la sección de UI `0. Catálogo GDS (Paginado)` del sidebar del frontend.
- [x] **Task 3.3:** Eliminar el componente de visualización de errores simulados.
- [x] **Task 3.4:** Asegurar que el botón "BUSCAR" apunte directamente al Bridge sin pasar por validaciones de "ID de prueba".

---

## 🎫 Ticket: CFG-001 - Configuración Estricta de Producción
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [x] **Task 4.1:** Actualizar `.env` en `ms-veturis` para que `VETURIS_URL` sea `https://xmlservices.veturis.com/xmlWebServices.php`.
- [x] **Task 4.2:** Verificar que `VETURIS_TIME_LIMIT` en el código sea igual a lo definido en el `.env` (Default 20s).
- [x] **Task 4.3:** Eliminar el fichero `SPA_Hotels.csv` del raíz del microservicio para liberar 91MB de espacio en el repositorio.

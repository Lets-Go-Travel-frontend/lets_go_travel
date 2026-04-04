# 🗄️ SPRINT 02: ETL Maestro y Persistencia Redis

**¿Por qué este Sprint?**
El microservicio actual consume ~300MB de RAM al arrancar para mantener el catálogo de hoteles en un `Map` de JavaScript. Esto impide el escalado horizontal (cada nueva instancia desperdicia memoria) y hace que el arranque sea lento. Mover estos datos a Redis permite que el microservicio sea **Stateless**, cargue instantáneamente y sea compatible con infraestructuras modernas (Docker/ECS).

**¿Cómo se hará?**
Se transformará el script de carga actual en un proceso ETL (Extract, Transform, Load) que use `streams` para procesar el CSV de 91MB sin saturar el CPU, inyectando los datos en Redis con una estructura de `Hashes` para búsquedas de O(1).

---

## 🎫 Ticket: ETL-001 - Refactor del Motor de Ingesta
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [x] **Task 1.1:** Modificar `cron/EtlJob.ts` para usar `csv-parser` con modo streaming (evitar `fs.readFileSync`).
- [x] **Task 1.2:** Implementar la lógica de "Pipeline" en Redis para inyectar datos en bloques de 1000 registros (optimización de red).
- [x] **Task 1.3:** Mapear no solo el nombre y estrellas, sino también **Latitud y Longitud** desde el CSV `SD_HH`.
- [x] **Task 1.4:** Añadir soporte para el CSV `SD_HP` (Photos) para capturar la URL de la imagen principal del hotel.

---

## 🎫 Ticket: DB-001 - Esquema de Datos en Redis
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [x] **Task 2.1:** Definir el patrón de claves: `veturis:hotel:{id}` -> Hash con {name, stars, lat, lng, image, city}.
- [x] **Task 2.2:** Implementar un TTL (Time To Live) de 25 horas para los registros, obligando a una actualización diaria vía ETL.
- [x] **Task 2.3:** Configurar el `RedisSingleton.ts` para manejar re-conexiones automáticas y timeouts de consulta de 500ms.

---

## 🎫 Ticket: SVC-002 - Integración de Consultas On-Demand
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [x] **Task 3.1:** Cambiar la firma de `getHotelMeta(id)` en `VeturisService.ts` para que sea `async`.
- [x] **Task 3.2:** Reemplazar el acceso al `Map` interno por una llamada `await redis.hgetall(...)`.
- [x] **Task 3.3 (Fallback):** Implementar lógica de contingencia: si Redis no responde, el servicio debe seguir funcionando devolviendo solo la info del XML, sin tumbar la petición.
- [x] **Task 3.4:** Actualizar los bucles de mapeo en `search()` para manejar promesas simultáneas (`Promise.all`) al recuperar metadata de múltiples hoteles.

---

## 🎫 Ticket: QA-002 - Validación de Integridad de Catálogo
**Estado:** PENDING
**Prioridad:** MEDIUM

### Tasks:
- [x] **Task 4.1:** Crear un test de integración que verifique que, tras correr el ETL, un `GET` a Redis devuelve el objeto esperado.
- [x] **Task 4.2:** Medir el tiempo de respuesta: la consulta a Redis debe ser < 5ms.
- [x] **Task 4.3:** Verificar que el microservicio arranca en menos de 1 segundo (sin cargar el CSV).

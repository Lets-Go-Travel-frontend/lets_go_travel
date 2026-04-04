# 🗄️ SPRINT 02: Master ETL, Coordenadas y Amenities

**¿Por qué este Sprint?**
El Centralizador necesita más que nombres. Necesita pintar el hotel en un mapa (Lat/Lng), mostrar fotos reales y listar servicios (Amenities). Sin este mapeo, el traductor está incompleto frente a la competencia.

**Manual Veturis V3.9 - Auditoría Requerida:** Pág 55-57 (CSV Static Data).

---

## 🎫 Ticket: ETL-201 - Coordenadas y Normalización
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 1.1:** Auditar el CSV `SD_HH` para confirmar las columnas de `Latitud` y `Longitud` (posiciones 13 y 14).
- [ ] **Task 1.2:** Actualizar el ETL para inyectar `lat` y `lng` como floats en Redis.
- [ ] **Task 1.3:** Normalizar el ID del hotel en Redis para asegurar que `h-9553` y `H-9553` no generen duplicados.

---

## 🎫 Ticket: ETL-202 - Mapeo de Amenities (Obligatorio)
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [ ] **Task 2.1:** Descargar y procesar el CSV `SD_HS` (ServicesFacilities).
- [ ] **Task 2.2:** Crear un diccionario en Redis `veturis:amenity:{id}` -> `{name}`.
- [ ] **Task 2.3:** En `VeturisService`, implementar el cruce: al recibir el ID "70", el JSON final debe decir `"WiFi"` en la lista de amenities.

---

## 🎫 Ticket: ETL-204 - Descripciones e Integridad de País
**Estado:** PENDING
**Prioridad:** MEDIUM

### Tasks:
- [ ] **Task 4.1:** Procesar CSV `SD_HD` (Descriptions) por idioma.
- [ ] **Task 4.2:** Procesar CSV `SD_GP` (Countries) para validar el `CountryCode` de la búsqueda.
- [ ] **Task 4.3:** En `VeturisService`, añadir el campo `description` al objeto de detalles.

# 🚀 Plan de Ejecución Definitivo: Veturis E2E (Certificación Total V3.9)

Este plan representa el 100% de los requisitos técnicos del manual Veturis V3.9 y la metadata completa de sus 10 archivos CSV estáticos.

---

## Sprint 1: Infraestructura, Seguridad y B2B (PII & Core)
**Objetivo:** Saneamiento de comunicaciones y cumplimiento de fronteras fiscales.

*   **Ticket SEC-001: PII Shield y Blindaje de Logs**
    *   *Subtask 1.1.1:* Purgar `console.log/error` en `VeturisService.ts` y migrar a `safeLog`.
    *   *Subtask 1.1.2:* Sanitizar `rawData` (XML parseado) antes de loguear errores en los interceptores.
*   **Ticket INF-001: Sincronización de Timeouts y User-Agent**
    *   *Subtask 1.2.1:* Ajustar `VeturisClient.ts` timeout a 25000ms y forzar User-Agent "Postman" para evitar WAF.
    *   *Subtask 1.2.2:* Sincronizar `VETURIS_TIME_LIMIT` en XML a 20s.
*   **Ticket B2B-001: Facturación y Globalización (Pág 10, 33)**
    *   *Subtask 1.3.1:* Implementar soporte multi-idioma (`language` dinámico en todos los RQ).
    *   *Subtask 1.3.2:* Mapear nodo `<company>` completo (`nameCompany`, `cifCompany`, `addressCompany`, etc.) para reservas corporativas.
    *   *Subtask 1.3.3:* Inyectar el campo `<Reference>` (Referencia de Agencia) en el Request de Booking.

---

## Sprint 2: ETL Maestro y Catálogo Global (Los 10 CSVs)
**Objetivo:** Ingesta total de los archivos `SD_XX` en Redis para eliminar placeholders.

*   **Ticket ETL-002: Motor de Ingesta Geográfica (SD_HH, SD_GP, SD_GD, SD_GZ, SD_HZ)**
    *   *Subtask 2.1.1:* Descargar y parsear Hoteles (16 cols), Países, Destinos y Zonas.
    *   *Subtask 2.1.2:* Mapear jerarquía: `Hotel -> Zona -> Destino -> País`.
*   **Ticket ETL-003: Contenido Enriquecido (SD_HD, SD_HP, SD_HS, SD_HC, SD_HN)**
    *   *Subtask 2.2.1:* Ingesta de `SD_HD` (Descripciones largas de hoteles) y `SD_HP` (URLs de fotos).
    *   *Subtask 2.2.2:* Ingesta de `SD_HS` (Servicios/Amenities) y `SD_HC` (Características).
    *   *Subtask 2.2.3:* Ingesta de `SD_HN` (Notas importantes del hotel).
*   **Ticket DB-002: Persistencia Redis Cloud**
    *   *Subtask 2.3.1:* Estructura de Hashes con TTL de 24h para actualización diaria automática.

---

## Sprint 3: Resiliencia Financiera y Reglas de Pax (Pág 22-34)
**Objetivo:** Control de crédito de agencia y validación estricta de pasajeros.

*   **Ticket FIN-002: Crédito y Costes Ocultos**
    *   *Subtask 3.1.1:* Mapear `<AgencyBalance>` (Pág 22) para avisar al Centralizador si el saldo es insuficiente antes de intentar reservar.
    *   *Subtask 3.1.2:* Implementar desglose de `<Suplements>` y `<Discounts>` detectando `Type="D"` (Pago directo).
*   **Ticket VAL-002: Validación de Pasajeros (Pág 34)**
    *   *Subtask 3.2.1:* Mapear campo `<MandatoryPaxes>` en detalles (Y/N/H) para condicionar la UI.
    *   *Subtask 3.2.2:* Solicitar obligatoriamente `dateOfBirth` y `expirationDocumentDate` si el GDS lo requiere.
*   **Ticket ERR-001: Error Mapper 1824 Pro**
    *   *Subtask 3.3.1:* Extracción de campo fallido vía Regex y traducción a labels de UI.

---

## Sprint 4: Operativa Avanzada y Stress Test (Pág 38-54)
**Objetivo:** Post-venta, modificaciones reales y seguridad de concurrencia.

*   **Ticket MOD-001: Modificación de Reserva (Pág 42)**
    *   *Subtask 4.1.1:* Implementar `BookingModificationRQ` para cambios de nombres y comentarios.
*   **Ticket DOC-001: Voucher Branding Injection**
    *   *Subtask 4.2.1:* Capturar HTML crudo e inyectar cabecera de "Let's Go Travel" vía CSS Injection.
*   **Ticket QA-004: Guardrails de Producción**
    *   *Subtask 4.3.1:* Validar límites de 1000 hoteles en búsqueda y 31 días en listado.
    *   *Subtask 4.3.2:* Test de estrés: 100 peticiones simultáneas validando aislamiento de `SessionID`.

---

## ✅ Criterios de Aceptación (Definición de "Hecho")
1.  **Ceroplaceholders:** Las imágenes y descripciones vienen de Redis, no de `placehold.co`.
2.  **Legalidad:** El cliente ve el desglose de tasas turísticas (pago directo) antes de reservar.
3.  **Seguridad:** Ningún dato PII aparece en el stream de logs de la aplicación.

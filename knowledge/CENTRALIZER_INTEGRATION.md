# 📗 Guía de Integración para el Centralizador (Veturis V3.9)

Este adaptador ha sido certificado bajo el estándar **Platinum** frente al Manual Veturis V3.9. Sigue una arquitectura **Hollow Shell** pura.

## 🔗 Protocolos Disponibles
1.  **gRPC (Recomendado):** Puerto `50052`. Contrato en `src/interfaces/gen/provider.proto`.
2.  **REST Bridge:** Puerto `3005`. Requiere Header `x-api-key`.

---

## 🛠️ Flujo Transaccional "Safe-Path"

### 1. Búsqueda (`/search`)
*   **Performance:** Respuesta ultra-rápida gracias a Redis Cloud.
*   **Datos Extra:** Recibirás `lat`, `lng` y un array de `amenities` (nombres reales, no IDs).
*   **Guardrails:** El adaptador rechazará peticiones que excedan los límites físicos de Veturis (ej. > 5 habitaciones).

### 2. Detalles (`/details`) - **Paso Crítico**
*   **Legalidad:** Revisa el campo `extraData.supplements`. Si un suplemento tiene `type: "D"`, es **Pago Directo en el Hotel**. Debes informar al cliente.
*   **Transparencia:** Usa `cancellationPolicy.freeCancellationUntil` para mostrar al usuario la fecha exacta hasta la que puede cancelar gratis.
*   **Audit:** Capturamos `agencyBalance` para que puedas validar saldo antes de intentar el pago.

### 3. Reserva (`/book`)
*   **B2B:** Si envías el objeto `company`, el adaptador inyecta automáticamente los nodos fiscales para factura corporativa.
*   **Price Change:** Si en el paso 2 `priceChangeInfo.hasChanged` es `true`, debes enviar el nuevo precio en `acceptedPriceChange` aquí, o la reserva fallará.

---

## 🚨 Gestión de Errores Profesional
El adaptador no devuelve XMLs crudos. Mapeamos todo a `GdsErrorType`:
*   `GDS_VALIDATION_ERROR`: Si envías algo mal (ej. falta edad de niño). El campo `validationField` te dirá exactamente cuál.
*   `GDS_PREBOOKING_ERROR`: Fallo al bloquear la habitación (habitual por cambio de precio).
*   `ERROR_INDETERMINATE`: Error crítico durante la confirmación. **NO asumas que está cancelada/confirmada**. Lanza una alerta manual.

---

## 📈 Realidad Operativa del Microservicio
*   **Stateless:** Puedes levantar 100 réplicas sin problemas de memoria.
*   **PII Shield:** Los logs son seguros. Verás `j***@domain.com` para que puedas depurar pero cumpliendo con GDPR.
*   **Retries:** Hacemos 1 reintento automático en caso de micro-caídas de Veturis.

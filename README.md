# 🏨 Let's Go Travel - Veturis GDS Adapter (V3.9)

Este microservicio es un adaptador **Stateless** basado en la arquitectura **Hollow Shell**. Traduce peticiones gRPC/REST al protocolo XML de Veturis V3.9 de forma ultrarrápida y segura, delegando la lógica de negocio al Centralizador.

---

## 🚀 1. Despliegue y Configuración

El servicio depende de variables de entorno y de una caché Redis para su máxima eficiencia. Toda la configuración base y requerida se encuentra explicada en `microservices/ms-veturis/.env.example`.

### Ingesta de Datos Estáticos (ETL)
Para que el microservicio funcione sin latencia, Redis debe estar poblado con el catálogo de hoteles (los 10 archivos CSV de Veturis).
```bash
cd microservices/ms-veturis
npm run etl:ingest
```
*Recomendación:* Ejecutar este script mediante un Cronjob una vez al día para mantener los hoteles actualizados.

---

## 🔗 2. Integración para el Centralizador

El sistema expone dos protocolos idénticos en estructura:
1. **gRPC (Producción):** Puerto `50052`. El contrato fuente es `microservices/ms-veturis/src/interfaces/gen/provider.proto`.
2. **REST Bridge (Pruebas/UI):** Puerto `3005`. Requiere Header `x-api-key` definido en `BRIDGE_API_KEY`.

### Flujo Transaccional "Safe-Path"

#### A. Búsqueda (`/search` o `SearchAvailability`)
*   **Performance:** Respuesta en `O(1)` con datos enriquecidos desde Redis.
*   **Datos Adicionales:** Recibirás `lat`, `lng` y `amenities` descifradas en lenguaje natural (ej. "WiFi").
*   **Guardrails:** Límite estricto de 5 habitaciones, 6 adultos y 3 niños por petición, según dicta Veturis.

#### B. Detalles (`/details` o `GetDetails`) - *Paso Crítico*
*   **Pago Directo:** Si un suplemento en `extraData.supplements` tiene `type: "D"`, es un importe a abonar directamente en el hotel. El precio base `price` NO lo incluye.
*   **Cancelación:** `freeCancellationUntil` te dice exactamente la fecha y hora límite sin gastos.
*   **Saldo:** Devuelve `agencyBalance` para validar disponibilidad de crédito antes de intentar reservar.

#### C. Reserva (`/book` o `Book`)
*   **Facturación B2B:** Si envías el objeto `company` (name, cif, address), se inyectan los nodos fiscales en Veturis para la factura.
*   **Cambio de Precio:** Si en `Details` detectaste `priceChangeInfo.hasChanged: true`, debes enviar `acceptedPriceChange` con el nuevo valor aquí, o Veturis rechazará la transacción.

#### D. Cancelación y Modificación
*   **Cancelación en 2 pasos:** Llama a `/cancel` con `confirm: false` para cotizar los gastos de anulación. Llama con `confirm: true` para anular definitivamente.
*   **Modificación:** El endpoint `/modify` permite cambiar el nombre de un pasajero o añadir comentarios al hotel sin necesidad de cancelar la reserva.

---

## 🛡️ 3. Seguridad y Resiliencia

*   **PII Shield:** Los logs aplican ofuscación parcial automática (`j***@email.com`, `123****X`). Los XMLs crudos con datos personales nunca se imprimen para cumplir con el GDPR.
*   **Circuit Breaker & Retries:** El cliente HTTP implementa 1 reintento automático silencioso en caso de micro-caídas del GDS (Timeout o Error 503).
*   **Healthcheck (`GET /health`):** Verifica conexión viva TCP con Veturis (puerto 443) y con Redis. Si alguno falla, devuelve `503 DEGRADED`.
*   **Errores Inteligentes:** Los fallos crípticos del GDS (ej. Error 1824) son interceptados con Regex y devuelven el campo exacto que falta (`GDS_VALIDATION_ERROR`). Si una cancelación falla por red, devuelve `ERROR_INDETERMINATE` (requiere alerta manual para agente humano, no asumir ningún estado).

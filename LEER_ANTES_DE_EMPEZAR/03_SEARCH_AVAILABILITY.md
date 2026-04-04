# 🔍 Search Availability (Búsqueda de Disponibilidad)

## 1. El Request (Lo que enviamos a Veturis)
Según el manual de Veturis (Pág 8-10), el XML `<SearchAvailabilityRQ>` permite buscar hasta 1000 hoteles. 

### Campos Críticos y su Implementación
*   **`Occupancy` (Ocupación):**
    *   **Manual:** Permite múltiples habitaciones con diferentes capacidades. Requiere detallar `Rooms`, `Adults`, `Children`.
    *   **`Ages`:** Obligatorio si `Children > 0`. Se debe enviar un `<Age>` por cada niño en la habitación.
    *   **Implementación (`VeturisService.search`):** Completamente implementado. Recibe un array `occupancies` del frontend. Si un elemento tiene `children > 0`, genera el bloque `<Ages><Age>...</Age></Ages>` extrayendo los datos de `childrenAges`.
*   **`TimeLimit`:**
    *   **Manual:** Límite en segundos. Si expira, Veturis devuelve lo que tenga hasta ese momento.
    *   **Implementación:** Usamos la variable de entorno `VETURIS_TIME_LIMIT` o por defecto 20 segundos para evitar bloqueos del lado de nuestro cliente.
*   **`CountryCode` (Opcional pero Recomendado):**
    *   **Manual:** Código ISO 3166-1 alpha-3. Define la nacionalidad del huésped. Crítico para tarifas localizadas.
    *   **Implementación:** Incluido en la capa de negocio si se pasa el parámetro `countryCode` desde el contrato gRPC/REST.

## 2. El Response (Lo que recibimos)
El XML devuelto (`<SearchAvailabilityRS>`) contiene un árbol complejo aglomerado por `<Hotel>`, `<Room>` y `<Board>`.

### Campos Críticos y su Mapeo
*   **`DATOS` (Booking Token Parcial):**
    *   **Manual:** String encriptada obligatoria para el siguiente paso (`AdditionalInformation`). Varía por tarifa.
    *   **Implementación:** El código extrae el `SessionID` global y el `<DATOS>` de cada tarifa y genera un Token Unificado en Base64: `Buffer.from(SessionID + '|' + DATOS).toString('base64')`. Este token permite mantener el estado de la sesión ("stateless" para nosotros).
*   **Prices (`Price` vs `PriceAgency`):**
    *   **Manual:** `Price` es sugerido al cliente (PVP). `PriceAgency` es nuestro precio neto a pagar a Veturis. El atributo `mandatory="1"` indica si `Price` no puede ser modificado (Tarifa vinculante).
    *   **Implementación:** El código mapea `PriceAgency` a `netPrice`, y `Price` a `grossPrice`. Capturamos el atributo `mandatory` y lo mapeamos a `isBindingRate: boolean`.
*   **Moneda Global:**
    *   **Manual:** Desde V3.1, la divisa viene como atributo en `<resultadosRS currency="EUR">`.
    *   **Implementación:** El parser busca `$?.currency` en la raíz.

## 3. Estado de Cumplimiento
*   **Zero-Debt:** El flujo está alineado con el manual.
*   **Excepciones Manejadas:** Se controla si Veturis devuelve HTML en lugar de XML (posible error 403 por credenciales o IP no autorizada).
## 4. Peligro de Timeouts (Red vs XML)
Existe un riesgo documentado en la sincronización de tiempos de espera:
*   El cliente Axios (VeturisClient.ts) tiene un timeout de red de **15 segundos**.
*   El XML <TimeLimit> se configura vía VETURIS_TIME_LIMIT (o 20s por defecto).
**Regla Crítica:** El TimeLimit de Veturis debe ser SIEMPRE inferior al timeout de Axios, de lo contrario la red cortará la conexión antes de que Veturis devuelva una respuesta parcial.

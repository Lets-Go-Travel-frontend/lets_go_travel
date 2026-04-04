# 📑 Contrato API (gRPC / REST Bridge) - Veturis Adapter V3.9

Este documento es la referencia para el equipo del Centralizador. Define las interfaces de comunicación con `ms-veturis`.

> **Nota:** En producción se utilizará **gRPC** (puerto `50052`). Para desarrollo local o pruebas web (Next.js), se expone un **REST Bridge** (puerto `3005`) que acepta JSON. Las estructuras de datos son idénticas.

---

## 1. 🔍 Búsqueda de Disponibilidad
Busca hoteles disponibles según criterios de ocupación y fechas.

*   **gRPC RPC:** `SearchAvailability`
*   **REST Endpoint:** `POST /search`

### Request Payload
```json
{
  "hotelId": "9553,9554", // Opcional. IDs separados por coma (Máx 1000).
  "checkIn": "2026-06-01", // YYYY-MM-DD
  "checkOut": "2026-06-05", // YYYY-MM-DD
  "language": "SPA", // Opcional. ISO 639-1 (SPA, ENG, FRA...). Default: SPA.
  "countryCode": "ESP", // Opcional. Nacionalidad del cliente para tarifas especiales.
  "occupancies": [
    {
      "adults": 2,
      "children": 1,
      "childrenAges": [5] // Requerido si children > 0
    }
  ]
}
```

### Response Highlights
Devuelve un array de `items`. Cada item representa una combinación de Habitación + Régimen.
*   `bookingToken`: **CRÍTICO**. String encriptado que debe enviarse en el paso de Detalles.
*   `pricing.grossPrice`: Precio final de venta.
*   `pricing.isBindingRate`: Si es `true`, el precio es vinculante y el Centralizador no debería aplicar markups visibles que alteren la percepción del cliente final.

---

## 2. ℹ️ Detalles y Cotización Final
**Paso obligatorio antes de reservar.** Confirma la tarifa, políticas de cancelación y suplementos obligatorios.

*   **gRPC RPC:** `GetDetails`
*   **REST Endpoint:** `POST /details`

### Request Payload
```json
{
  "bookingToken": "string_obtenido_en_search"
}
```

### Response Highlights
*   `cancellationPolicy.penaltyTiers`: Tramos de penalización (fecha y coste).
*   `priceChangeInfo`: Si `hasChanged` es `true`, la tarifa base ha variado desde la búsqueda. El Centralizador debe notificar al usuario.
*   `extraData.supplements`: Suplementos aplicables. Si `type === "D"`, es un suplemento de **pago directo en el hotel** (ej. Tasa Turística) y no está incluido en el `price`.
*   `mandatoryPaxes`: Reglas de nombramiento (`Y` = todos obligatorios, `N` = no obligatorios, `H` = uno por habitación).

---

## 3. ✅ Confirmación de Reserva
Ejecuta la transacción atómica en Veturis.

*   **gRPC RPC:** `Book`
*   **REST Endpoint:** `POST /book`

### Request Payload
```json
{
  "bookingToken": "string_usado_en_details",
  "language": "SPA",
  "client": {
    "name": "John",
    "surnames": "Doe",
    "email": "johndoe@example.com",
    "phone": "+34600000000",
    "country": "15" // ID de país en Veturis (ej. 15 = España)
  },
  "company": { // Opcional. Para reservas B2B (Facturación).
    "name": "Empresa S.A.",
    "cif": "B1234567",
    "address": "Calle Mayor 1"
  },
  "agencyReference": "REF-CENTRALIZADOR-001", // Referencia interna.
  "passengers": [
    {
      "name": "John",
      "surname": "Doe",
      "docNumber": "12345678X",
      "dateOfBirth": "1990-01-01",
      "expirationDocumentDate": "2030-01-01" // Opcional. Exigido por algunos destinos.
    }
  ],
  "remarks": "Camas separadas por favor.",
  "acceptedPriceChange": 150.50 // Requerido SOLO si priceChangeInfo.hasChanged era true en Details.
}
```

### Response
Devuelve `status: "CONFIRMED"` junto con el `locator` (Localizador GDS), el `bookingId` (ID interno Veturis) y el `securityCode`. Estos datos son vitales para modificaciones o cancelaciones.

---

## 4. ❌ Cancelación de Reserva
Cancela una reserva confirmada. Requiere el `bookingId` y `securityCode`.

*   **gRPC RPC:** `Cancel`
*   **REST Endpoint:** `POST /cancel`

### Request Payload
```json
{
  "bookingId": "123456",
  "securityCode": "sec_hash_abc123",
  "confirm": false // Si es false, solo devuelve los gastos. Si es true, CANCELA irrevocablemente.
}
```

### Response Highlights
Si `confirm` es false, devuelve `status: "QUOTED"` y el `cancellationPrice`. Si es true, devuelve `status: "CANCELLED"`.

---

## 5. 📜 Otros Servicios
*   **Historial (`POST /booking-list`):** Recupera reservas filtrando por fechas (máx 31 días) o localizador.
*   **Voucher (`POST /voucher`):** Obtiene el HTML del bono de confirmación para entregar al cliente.
*   **Modificación (`POST /modify`):** Permite cambiar nombres de pasajeros (`passengers`) o comentarios (`remarks`) sin cancelar la reserva.

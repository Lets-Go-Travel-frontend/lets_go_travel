# ❌ Cancellation & Booking List (Gestión Post-Venta)

## 1. Cancelación de Reserva (`BookingCancellation`)
Según el Manual Veturis (Pág 46-50), el proceso de cancelación NO es de un solo click, y la certificación V3.9 exige implementar un control estricto.

### El Parámetro Mágico: `CancelConfirm`
*   `CancelConfirm="0"`: Pide a Veturis simular la cancelación y devolver cuál sería el coste de penalización a la fecha/hora actual, pero **sin cancelar nada.** (Cotización de Cancelación).
*   `CancelConfirm="1"`: Ejecuta la cancelación final irrevocable.

### Implementación en Código (`VeturisService.cancel`)
*   Se mapeó al `CancelRequest` el booleano `confirm`.
*   **Flujo Frontend Soportado:** En el sandbox, el usuario clickea "Cancelar" -> Llama a API con `confirm: false` -> Veturis devuelve el importe en `CurrentCancellationPrice` -> El frontend muestra: "¿Confirmar cancelación definitiva con coste X?" -> Si el usuario acepta, llama con `confirm: true`.
*   **Respuesta Exitosa:** Devuelve status `CANCELLED` (A) o `QUOTED`.
*   **Respuesta Fallida:** Devuelve `ERROR` si la reserva no estaba confirmada, si ya estaba cancelada, o si el `SecurityCode` es incorrecto. `ErrorMapper` traduce mensajes como "La reserva aún no está confirmada".

## 2. Listado de Reservas (`BookingList`)
El Manual (Pág 51-54) exige implementar este servicio de manera obligatoria para obtener la certificación (sirve para auditoría de discrepancias).

### Parámetros de Búsqueda
Permite buscar por múltiples vías:
*   Por `BookingID`
*   Por `Locator`
*   Por rango de fechas (`BookingDateRange`). El `type="1"` busca por fecha de creación, `type="2"` por check-in. Límite máximo de 31 días por búsqueda.

### Implementación Actual (`VeturisService.bookingList`)
*   Recibe un `IBookingListRequest` (opcionalmente con fechas o IDs).
*   Genera el XML e ignora elementos vacíos.
*   **La Respuesta:** Devuelve un array con un resumen de la reserva: `locator`, `status` (C=Confirmada, A=Cancelada), `hotelName`, fechas y `price`.
*   **Frontend Integrado:** El Sandbox ahora tiene el botón "RECARGAR MIS RESERVAS" que inyecta un rango de fechas hardcodeado (2024-2026) para leer el estado del GDS real, lo cual facilita enormemente probar las cancelaciones y visualización de bonos.
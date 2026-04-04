# 🏗️ Veturis API V3.9: Contratos y Flujos Transaccionales

### 1. Flujo Obligatorio
1.  **SearchAvailabilityRQ:** Devuelve precios estimados y un `SessionID`.
2.  **AdditionalInformationRQ:** **OBLIGATORIO.** Valida el precio final, políticas de cancelación reales y suplementos de pago directo.
3.  **BookingConfirmationRQ:** Ejecuta la transacción.

### 2. Manejo de Errores (La Regla de Oro)
Veturis devuelve errores en múltiples formatos. El traductor perfecto debe unificarlos:
*   **Error 102:** Fallo de autenticación (Crítico).
*   **Error 1824:** Fallo de validación XSD (Campos mal formados).
*   **Error 205:** No hay disponibilidad (Informativo).

### 3. Suplementos y Tasas
El GDS devuelve suplementos con `Type="D"` (Direct Payment). 
*   **Importante:** El traductor debe avisar al Centralizador que este importe NO está incluido en el pago online y debe pagarse en el hotel.

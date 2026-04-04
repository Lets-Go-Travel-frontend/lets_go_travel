# 📝 Details & Pricing (Additional Information)

## 1. El Propósito del Servicio
El paso de detalles (`AdditionalInformationRQ` en el manual Pág 20-32) es el puente **obligatorio** entre la disponibilidad y la reserva. 
*   **Por qué existe:** La disponibilidad no carga todas las políticas ni el coste real final. `AdditionalInformation` congela momentáneamente la tarifa y recupera las reglas de cancelación precisas y las tasas adicionales.

## 2. El Request
*   **`obj` y `DATOS`:** Son los únicos parámetros mandatorios. 
*   **Implementación:** Nuestro adaptador decodifica el `bookingToken` que se generó en `SearchAvailability` (separando `SessionID` y `DATOS` original) y los inyecta en el request.
*   **`ShowMoreRates`:** Enviamos `ShowMoreRates: "Y"` por defecto para recuperar tarifas alternativas (por ejemplo, opciones reembolsables si la original no lo es).

## 3. El Response y Extracción de Datos Críticos
El código en `VeturisService.details` procesa lo siguiente:

*   **Cancelación (`Cancellation.Period`):**
    *   **Manual:** Detalla a partir de qué fecha (`From`) y con qué importe (`Amount`) aplica una penalización.
    *   **Implementación:** La función `mapCancellationPeriods` recorre todos los periodos y los mapea a nuestro contrato `IDetailsResponse` como un array de `penaltyTiers`.
*   **Información Esencial (`EssentialInformation`):**
    *   **Manual (Pág 20):** Es información obligatoria de mostrar al cliente (e.g., tasas turísticas locales a pagar en destino, horarios de recepción). No mostrarlo causa conflictos.
    *   **Implementación:** Se capturan y devuelven como `essentialInformation: string[]`.
*   **Cambio de Precio (`PriceChange`):**
    *   **Manual (Pág 28):** Si la tarifa cambió desde la búsqueda, aparece este nodo. **Si aparece y no lo aceptamos explícitamente en el request de Booking, la reserva fallará.**
    *   **Implementación:** Se detecta el campo y se mapea a `priceChangeInfo: { hasChanged: true, newPrice: X }`. En el siguiente paso (`Book`), este valor debe enviarse de vuelta a Veturis.
*   **Nombres de Pasajeros Obligatorios (`MandatoryPaxes`):**
    *   **Manual:** `N` (no), `Y` (todos), `H` (uno por habitación).
    *   **Implementación:** Capturado pero delegado al frontend para validaciones visuales.

## 4. Deuda Técnica Actual
*   El código ignora silenciosamente tarifas secundarias si `ShowMoreRates` devuelve múltiples `<Rate>`. Actualmente solo parsea el cuerpo principal de la respuesta.
*   No gestionamos los `<Supplements>` obligatorios de pago directo (`Type="D"`). Si un hotel tiene suplementos directos, el frontend no está avisando al usuario de ese gasto extra.

## 5. Tarifas Vinculantes (Binding Rates)
El XML de Veturis puede devolver el atributo `mandatory="1"` en el nodo `<Price>`.
*   **Significado:** Representa una tarifa vinculante (PVP obligatorio). Legalmente, no se pueden aplicar descuentos o alteraciones sobre esta tarifa para el cliente final.
*   **Implementación:** Se mapea a la propiedad `isBindingRate: boolean` en el contrato estándar para que el frontend y el centralizador bloqueen la alteración de este precio.
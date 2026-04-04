# ✅ Booking Confirmation (Confirmación de Reserva)

## 1. Naturaleza del Servicio
Según el Manual (Pág 33-37), la confirmación de la reserva `BookingConfirmation` es un proceso atómico de tres pasos internos en Veturis: Pre-reserva, Pago y Confirmación final. Cualquier fallo en la cadena anula todo.

## 2. Parámetros del Request
La función `VeturisService.book` construye un complejo árbol XML para realizar la reserva.

*   **Identificadores Base:** `obj` (SessionID) y `DATOS`, obtenidos al decodificar nuestro `bookingToken`.
*   **`Client` (Titular):**
    *   El titular (`name`, `surnames`, `EMail`, `Phone`).
    *   **Manual (Pág 34):** Veturis exige un `country` en formato código numérico (ej. `15` para España). Nuestro código hardcodea `"15"` por defecto si no se pasa.
*   **`Paxes` (Pasajeros):**
    *   Nombres y documentos de los huéspedes de la habitación.
    *   **Protección de Caracteres Especiales:** Todo texto de nombre/comentarios se envuelve en `<![CDATA[ ... ]]>` usando `XmlSanitizer.wrapCDATA()` para evitar que el request rompa si envían "García & Hijos".
*   **`Payment` (Pago):**
    *   **Manual (Pág 33):** Exige el tipo `<Type>SL</Type>` (Saldo/Crédito de la agencia). Si no se envía `SL`, la reserva falla.
    *   **Implementación:** Hardcodeado `<Payment><Type>SL</Type></Payment>`.
*   **`PriceChange`:**
    *   Si en el paso `Details` Veturis devolvió un nuevo precio, debemos aceptarlo y enviarlo en el bloque de reserva o de lo contrario el sistema fallará con error `1824`. Nuestro contrato incluye `acceptedPriceChange` para esto.

## 3. Manejo del Response
*   **Status Codes:** El manual define campos `ConfirmationStatus` y `ERROR`.
    *   Si `ConfirmationStatus === '0'` o `ERROR === '1'`, la reserva fracasó.
    *   El código lanza el `ErrorMapper` para extraer el detalle.
*   **Identificadores de Éxito:**
    *   `Locator`: El localizador oficial de la reserva en el GDS (Ej. "TR7864").
    *   `BookingID`: El ID interno de Veturis (Ej. "10873025").
    *   `SecurityCode`: Un hash alfanumérico largo. **Es absolutamente vital guardar esto porque es requerido para cancelar la reserva o consultar el bono.** Nuestro contrato `IBookingResponse` devuelve los tres campos.

## 4. Estricto Cumplimiento (Zero-Debt)
*   **PII Shield:** Activo. Los datos de `client` y `paxes` viajan a Veturis pero NUNCA se guardan en el `ms_live.log`.
*   **Errores Limpios:** No se devuelven tracebacks de XML al frontend. Todo error es mapeado a `GdsErrorType`.

## 5. Seguridad de Datos: Sanitización CDATA y Valores por Defecto
*   **XmlSanitizer:** Dado que Veturis es estrictamente dependiente de XML, cualquier nombre o comentario con caracteres reservados (`&`, `<`, `>`, tildes) romperá el request. Todo texto libre se envuelve obligatoriamente en `<![CDATA[ ... ]]>` usando `XmlSanitizer.wrapCDATA`.
*   **CountryCode Hardcodeado:** El manual requiere un código de país numérico (`15` para España). Actualmente, `VeturisService.book` inyecta `"15"` por defecto si el contrato no lo especifica, lo que podría generar inconsistencias si el cliente es extranjero.
*   **DocumentNumber Dummy:** Se envía `12345678X` por defecto si no se recolecta el DNI real, lo que es aceptado por el GDS pero representa un punto de mejora funcional.
# 🧾 Vouchers & Error Handling

## 1. El Bono de Reserva (`Voucher`)
El manual (Pág 38-41) explica cómo recuperar el bono para el cliente tras la confirmación.

*   **Los Parámetros:** `BookingID` y `Seg` (SecurityCode). (Por eso es crítico guardar el `SecurityCode` en la base de datos local en producción).
*   **Comportamiento Anómalo del Proveedor:**
    *   A menudo, el servicio de Voucher de Veturis NO devuelve un XML, sino directamente el código HTML crudo (`<!DOCTYPE html>...`) de la página del bono para imprimir.
    *   Si devuelve XML, el HTML suele estar escapado dentro de alguna etiqueta, o provee links de logos.
*   **Implementación en Código (`VeturisService.getVoucher`):**
    *   Tiene un comportamiento robusto. Envía la petición y chequea si la respuesta cruda contiene `<html` o `<body`.
    *   Si es así, la devuelve tal cual en la propiedad `rawHtml`.
    *   Si parece XML, intenta parsearlo con `xml2js` para sacar URLs. Si el parser falla (porque al final era HTML extraño), cae en el bloque `catch` devolviendo el contenido como `rawHtml`.
*   **Frontend Integrado:** En el Sandbox, al clickear "VER BONO" en la lista de reservas, se abre un modal con un `<iframe srcDoc={voucherHtml} />` para aislar los estilos del bono y renderizar el HTML nativo del GDS.

## 2. Manejo de Errores Veturis y El "Error 1824"
Dado que la comunicación se basa en XML, el GDS es extremadamente estricto con los formatos, obligatoriedad y tipos de datos.

*   **ErrorMapper (`src/utils/ErrorMapper.ts`):** 
    *   Un interceptor centralizado. Aísla al frontend de lidiar con crudos como `ERROR_PRERESERVA`. 
    *   Mapea los textos devueltos por el proveedor a un enum estandarizado (`GdsErrorType`).
*   **El Error 1824 (XSD Validation Error):**
    *   **Qué es:** Ocurre cuando el XML que enviamos viola el contrato esperado (XSD/Schema) de Veturis. Ej. falta enviar la edad de un niño, se envía un país inexistente o no se envió el código `SL` en pagos.
    *   **Cómo lo tratamos:** Lo mapeamos como `GdsErrorType.VALIDATION` indicando que faltan campos obligatorios. 
    *   **¿Se puede mejorar?** Sí. Actualmente se devuelve un texto genérico. Lo ideal (en el Roadmap) es parsear el texto real del error 1824 (que suele indicar qué línea y campo XML falló) para retroalimentar dinámicamente al frontend (e.g. "El campo DocumentNumber está vacío").
## 3. Diccionario de Errores Mapeados (GdsErrorType)
El archivo ErrorMapper.ts aísla los fallos crudos de Veturis. Algunos mapeos críticos incluyen:
*   **ERROR_PRERESERVA:** Fallo al intentar bloquear la habitación, probablemente por cambio de precio o pérdida de cupo de última hora.
*   **ERROR 1824:** Fallo de validación contra el esquema XSD de Veturis (falta de campos obligatorios como el teléfono o país).
*   **Errores de Cancelación:** El sistema reconoce automáticamente si 'LA RESERVA AÚN NO ESTÁ CONFIRMADA' o 'RESERVA ESTÁ YA ANULADA' para evitar bloqueos del lado del cliente.

# 🗺️ Roadmap y Funcionalidades Pendientes (Deuda V3.9)

El sistema ha alcanzado el cumplimiento básico transaccional (Reserva E2E, Cancelación, Recuperación). A continuación, se detallan las carencies con respecto a las capacidades completas que permite el Veturis V3.9:

## Ticket MS-005: Integración Total de Datos Estáticos (ETL Redis)
*   **Carencia:** El sistema lee un CSV estático y antiguo (`SPA_Hotels.csv`) de disco para enriquecer hoteles, sin soporte para imágenes (`SD_HP`) o mapeo semántico de Amenities (`SD_HS`).
*   **Acción:** Implementar el `VeturisCatalogEtl` (ver carpeta `src/etl`) para ejecutar descargas de archivos ZIP (`http://xmlservices.veturis.com/getStaticData.php`), parsearlos masivamente y subirlos a un cluster Redis usando `RedisSingleton.ts`. Las amenities (`[1, 27]`) deberían devolverse traducidas ("Sea View", "Air-Conditioning").

## Ticket UI-003 / MS-006: Multi-Habitación UI
*   **Carencia:** El motor GDS (Backend) ya soporta buscar e iterar sobre múltiples ocupaciones (ej. Habitación 1: 2 Adultos. Habitación 2: 1 Adulto, 2 Niños de 5 y 10 años). Sin embargo, el Frontend (Sandbox UI) y `useCentralizer.ts` envían datos *hardcodeados* y el formulario de búsqueda actual no tiene controles "Add Room".
*   **Acción:** Expandir el componente UI del Sandbox.

## Ticket QA-003: Stress Testing de "Race Conditions" (Identificadores)
*   **Carencia:** Node.js es de un solo hilo. Veturis mantiene estado de cotización en sus propios servidores vinculando la tarifa por `SessionID` y `DATOS`. Si dos usuarios buscan el mismo hotel al mismo tiempo, el Backend debe garantizar que cada llamada simultánea encripta los tokens correspondientes al usuario sin contaminar el contexto.
*   **Acción:** Escribir un script E2E en Playwright que lance 10 reservas simultáneas sobre el REST Bridge.

## Ticket FE-004: Modificación de Reservas (Booking Modification)
*   **Carencia:** No implementado. El manual permite enviar peticiones para alterar el número de días, nombres de pasajeros o notas.
*   **Acción:** Crear los esquemas de modificación, endpoint en Bridge `/modify`, e implementación final para evitar obligar a cancelar y re-reservar para correcciones simples.

## Ticket MS-007: Parseo Semántico del Error 1824
*   **Carencia:** Si la reserva falla porque Veturis exige que el teléfono no pase de X caracteres, el backend devuelve el error en bruto indicando "Error 1824: Element 'Phone'".
*   **Acción:** Modificar `ErrorMapper.ts` con una RegEx (`/Element '(.*?)'/`) para extraer el nombre del tag XML que causó la violación y devolverlo al Frontend en un campo `validationField` para poder poner el borde en rojo en el input.
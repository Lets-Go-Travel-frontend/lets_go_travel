# 🏗️ Arquitectura Base y Estado del Proyecto (Veturis V3.9)

## 1. El Paradigma "Hollow Shell" (Pureza Arquitectónica)
El microservicio `ms-veturis` está diseñado bajo el patrón **Hollow Shell**. 
*   **Qué significa:** El adaptador no contiene lógica de negocio propia. No aplica márgenes (markups), no maneja reglas de comisión, no valida saldos ni orquesta múltiples proveedores.
*   **Por qué:** Para evitar que el adaptador se convierta en un monolito complejo ("Fat Adapter"). La inteligencia de negocio debe residir en el Centralizador (Core).
*   **Qué hace realmente:** Traduce protocolos de entrada (`gRPC` o `REST/JSON`) a protocolos de salida de Veturis (`XML Multipart Form-Data`) y viceversa.
*   **Estado actual en código:** Cumplimiento total. Se eliminaron rastros antiguos de cálculo de márgenes. Todo el tipado usa guardas de tipos (Anti-Any Law) o esquemas de `Zod`.

## 2. Protección de Datos (PII Shield)
*   **Qué es:** Un mecanismo que intercepta los logs antes de escribirlos en disco o consola.
*   **Por qué:** Para cumplir con normativas de privacidad (GDPR) e impedir la fuga de datos personales (Personally Identifiable Information).
*   **Cómo está implementado:** La utilidad `safeLog` (en `src/utils/Logger.ts`) escanea objetos en busca de llaves sensibles como `email`, `documentNumber`, `phone` o nombres de pasajeros, y los reemplaza por `[REDACTED]`.

## 3. Modo Dual (REST-Bridge y gRPC)
*   **gRPC (Puerto 50052):** Es el protocolo oficial y nativo para la comunicación entre microservicios del sistema `lets_go_travel`. Utiliza `provider.proto` como única fuente de verdad (SSOT).
*   **REST-Bridge (Puerto 3005):** Es un puente HTTP implementado directamente en `server.ts` con el módulo nativo `http` de Node.js. 
*   **Por qué existe el Bridge:** Permite que el Frontend Next.js consuma la API directamente durante el desarrollo sin necesitar un gateway gRPC pesado ni dependencias extra como `grpc-web`. El frontend se conecta vía el hook `useCentralizer.ts`.

## 4. Estado General de Cumplimiento (Certificación Veturis V3.9)
*   **Nivel de Certificación:** "Live Ready".
*   **Endpoints implementados:**
    *   ✅ `SearchAvailability` (Búsqueda multi-ocupación).
    *   ✅ `AdditionalInformation` (Detalles, Precio Final y Políticas de Cancelación).
    *   ✅ `BookingConfirmation` (Reserva real en el GDS).
    *   ✅ `BookingCancellation` (Cancelación en dos pasos: cotización y ejecución).
    *   ✅ `BookingList` (Recuperación de listado de reservas).
    *   ✅ `Voucher` (Recuperación de HTML del bono).
*   **Dependencias de entorno críticas:** `VETURIS_USER`, `VETURIS_PASSWORD`, `VETURIS_AGENCY_USER`, `VETURIS_AGENCY_PASSWORD`. Si estas no están configuradas en `.env`, el servidor hace *Fail-Fast* y no arranca.
## 5. Resiliencia a Esquemas Variables (Polimorfismo XML)
El código de ms-veturis está diseñado para soportar variaciones en el XML devuelto por el GDS. Veturis en ocasiones cambia las etiquetas según el tipo de producto:
*   **SessionID:** Puede llegar en el nodo SessionID, SessionId o obj.
*   **Listas de Hoteles:** Puede estar bajo <Hotels> o <HotelList>.
*   **Identificadores:** El ID del hotel puede encontrarse en h.Id, h.HotelDetails.ID o h.HotelDetails.Id.
Esta resiliencia previene caídas masivas en producción si el proveedor actualiza su esquema de forma silenciosa.

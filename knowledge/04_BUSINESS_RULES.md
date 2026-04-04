# 🧠 Veturis API V3.9: Reglas de Negocio y Arquitectura (Hollow Shell)

Este documento define los límites de responsabilidad del microservicio `ms-veturis` frente al Centralizador.

### 1. Filosofía del Traductor
El adaptador es "Hollow" (hueco). No toma decisiones de negocio, solo traduce protocolos (gRPC/REST a XML Veturis).
*   **Divisas:** Veturis y el adaptador operan nativamente. La conversión de divisas (ej. EUR a USD) es responsabilidad 100% del Centralizador.
*   **Crédito de Agencia:** El adaptador mapea el saldo, pero NO bloquea reservas si el saldo es bajo. Veturis se encarga de rechazar la transacción, y el adaptador traduce el error al Centralizador.
*   **Carga Útil Ligera:** Para optimizar la red, el adaptador devuelve IDs y metadatos básicos en las búsquedas. Las fotos pesadas y descripciones extendidas no se inyectan en la respuesta transaccional masiva.

### 2. PII Shield (Ofuscación)
Para depuración legal, los datos sensibles en logs (nombre, email, teléfono, DNI) se ofuscan parcialmente (ej: `j***@email.com`, `123****X`) en lugar de ser completamente eliminados.

### 3. Infraestructura de Datos (ETL)
*   La carga de los 10 archivos CSV a Redis se gestiona mediante un script manual (`cron/EtlJob.ts` o equivalente) que se ejecuta periódicamente (ej. una vez al día). No se carga en memoria en el arranque del servidor web.

### 4. gRPC vs REST Bridge
*   El contrato principal y de producción es **gRPC** (`provider.proto`).
*   El **REST Bridge** se mantiene actívo única y exclusivamente para facilitar el desarrollo del Frontend (Next.js) durante la fase de pruebas, ya que Next.js no consume gRPC nativo fácilmente sin proxies (como Envoy).

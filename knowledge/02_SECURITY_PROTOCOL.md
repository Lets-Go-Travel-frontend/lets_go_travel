# 🛡️ Veturis API V3.9: Protocolo de Seguridad y Comunicación

### 1. Requisitos de Red
*   **Whitelist:** Solo se aceptan peticiones desde IPs previamente autorizadas.
*   **Metodología:** HTTP POST Multipart/Form-Data.
*   **Parámetros Obligatorios en el Body:**
    *   `xmlRQ`: El XML de la petición.
    *   `user`: Usuario de sistema.
    *   `password`: Password de sistema.
    *   `agencyUser`: Usuario de la agencia final.
    *   `agencyPassword`: Password de la agencia final.

### 2. PII Shield (Protección de Datos)
Para cumplir con GDPR y la "Anti-Any Law", el traductor debe redactar:
*   `<client><EMail>`
*   `<client><Phone>`
*   `<pax><documentNumber>`
*   `<pax><dateOfBirth>`

### 3. Timeouts Recomendados
*   **Búsqueda:** 25 segundos (Veturis puede ser lento en peticiones masivas).
*   **Reserva:** 40 segundos (Es un proceso atómico de 3 pasos internos en el GDS).

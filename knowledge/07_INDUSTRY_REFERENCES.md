# 📚 Referencias Industriales y Estándares de Calidad

Este documento recopila las mejores prácticas y arquitecturas de referencia en la industria del turismo (TravelTech) que inspiran el desarrollo de `ms-veturis`.

### 1. SDKs de GDS Profesionales
*   **Referencia:** [Amadeus Node.js SDK](https://github.com/amadeus4dev/amadeus-nodejs)
*   **Lección Aprendida:** Separación estricta entre el cliente de red (`VeturisClient`), la gestión de autenticación y los mapeadores de respuesta. Es el modelo a seguir para la robustez del código.

### 2. Arquitectura "Hollow Shell" (Hexagonal)
*   **Concepto:** [Arquitectura Hexagonal (Ports and Adapters)](https://www.youtube.com/watch?v=y3MWfPDmVqo)
*   **Aplicación:** El adaptador es un "puerto" de entrada/salida. No contiene reglas de negocio (como cálculos de margen), solo traduce protocolos. Esto garantiza que si mañana cambiamos de GDS, el impacto sea mínimo.

### 3. Agregación y Normalización de Datos
*   **Referencia:** [Hotel-API-Aggregation](https://github.com/vimal-paliwal/hotel-api)
*   **Aplicación:** Cómo transformar esquemas XML inconsistentes en un JSON estandarizado y ligero que pueda ser consumido fácilmente por un Centralizador.

### 4. Comunicación Binaria de Alto Rendimiento (gRPC)
*   **Referencia:** [Node.js gRPC Microservice Pattern](https://github.com/logrocket/grpc-node-example)
*   **Aplicación:** Validación de nuestra estructura de ficheros `.proto` y el uso de comunicación binaria para reducir la latencia en las transacciones de reserva.

---

### 🔍 Conceptos Clave para el Futuro
Para mantener el nivel "Premium" de este producto, se deben monitorizar los siguientes patrones:
*   **Stateless API Adapter:** Ninguna instancia del microservicio debe guardar estado local (todo a Redis).
*   **SOAP to REST/gRPC Gateway:** El rol técnico exacto de nuestro microservicio.
*   **Middleware Travel Architecture:** El ecosistema de alta disponibilidad donde reside este proyecto.

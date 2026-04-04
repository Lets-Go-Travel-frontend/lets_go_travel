# ms-veturis: El Adaptador GDS "Hollow Shell" 🏦

Este microservicio es el encargado de comunicar la arquitectura centralizada de **Let's Go Travel** con el GDS **Veturis**, cumpliendo estrictamente con el manual **XML v3.9**.

## 🚀 Instalación y Despliegue

```bash
cd microservices/ms-veturis
npm install
cp .env.example .env # Completa con tus credenciales
npm run dev
```

---

## 🏗️ Puntos de Entrada (Endpoints)

### 🌉 Bridge REST (Puerto 3005)
Ideal para consumo desde el frontend (Next.js):
- `POST /search`: Búsqueda de disponibilidad dinámica.
- `POST /details`: Información extendida, precios actualizados y políticas de cancelación.
- `POST /book`: Confirmación de reserva.
- `POST /cancel`: Cotización y confirmación de anulación.
- `POST /booking-list`: Listado histórico de reservas.
- `POST /voucher`: Obtención del bono de servicio (HTML/PDF).

### 🚀 gRPC (Puerto 50052)
Ideal para consumo desde microservicios internos:
- `ProviderService/SearchAvailability`
- `ProviderService/GetDetails`
- `ProviderService/Book`
- `ProviderService/Cancel`
- `ProviderService/BookingList`

---

## 🛠️ Ingestión de Datos (ETL)

El microservicio no almacena datos de reservas, pero gestiona un catálogo estático de hoteles, destinos y amenidades para mejorar el rendimiento del frontend.

**Comando de Ingestión Manual:**
```bash
# Inyecta el CSV de hoteles de Veturis en Redis
ts-node src/cron/EtlJob.ts
```
Este proceso ocurre automáticamente todos los días a las **02:00 AM UTC** mediante `node-cron`.

---

## 🔒 Variables de Entorno (.env)

| Variable | Descripción |
| :--- | :--- |
| `VETURIS_USER` | Usuario XML proporcionado por Veturis. |
| `VETURIS_PASSWORD` | Password XML proporcionado por Veturis. |
| `BRIDGE_API_KEY` | Clave secreta para autorizar peticiones al Bridge REST. |
| `REDIS_URL` | URL de conexión a Redis (ej: `redis://localhost:6379`). |

---

## 🛡️ Anti-Any Law Compliance
Este microservicio implementa una política de **Zero Any**. La lógica de traducción y mappers utiliza interfaces estrictas para garantizar la integridad de los datos.

## 🧪 Validación de Integridad
Para ejecutar la suite de pruebas técnicas:
```bash
npm run test
```

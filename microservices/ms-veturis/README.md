# ms-veturis: El Adaptador GDS "Hollow Shell" 🏦

Microservicio encargado de comunicar **Let's Go Travel** con el GDS **Veturis** (XML v3.9). Implementa una arquitectura stateless con fallback de mocks inteligentes para desarrollo.

---

## 🚀 Guía de Inicio Rápido (Setup)

### 1. Requisitos Previos
- **Node.js** v18+
- **Redis** con módulo **RediSearch** activo.

### 2. Despliegue de Redis (Opciones)
- **Docker (Recomendado):** `docker run -d --name redis-lgt -p 6379:6379 redis/redis-stack-server:latest`
- **Nativo (Linux/WSL2):** Instalar `redis-server` y habilitar `redis-stack` para soporte de módulos de búsqueda.

### 3. Instalación
```bash
cd microservices/ms-veturis
npm install
```

### 4. Configuración (.env)
Configurar archivo `.env` basado en `.env.example`.
- `VETURIS_USER/PASSWORD` requeridos para entorno real.
- `REDIS_URL` para catálogo y búsqueda (ej: `redis://localhost:6379`).
- `VETURIS_URL`: Endpoint XML de Veturis.

### 5. Ingestión Inicial de Datos (CSV -> Redis)
```bash
npx ts-node src/cron/EtlJob.ts
```
> Nota: Procesa `data/veturis_hotels.csv`, crea el índice `idx:veturis_hotels` y mapea los detalles de los hoteles.

### 6. Ejecución
```bash
npm run dev
```
- **Bridge REST:** `http://localhost:3005`
- **gRPC Server:** `localhost:50052`

---

## 🧪 Validación y Pruebas
Dado que el **Centralizer** final se encuentra en desarrollo, este microservicio dispone de una suite de pruebas para validar el flujo completo de datos y la integridad de las respuestas:

- **Suite de Pruebas:** `npm run test` (Valida mappers e integridad de datos).
- **Prototipo E2E:** Consultar `/veturis-demo` para validación visual del flujo completo.
- **Validación Manual:** `npx ts-node tests/healthCheck.ts` para verificar conectividad Bridge/Redis.

---

## 🤖 Mock Engine Inteligente
Si el GDS devuelve `403 Forbidden` (bloqueo de IP) o `Timeout`, el sistema activa un **Fallback de Mocks** que permite probar el flujo completo (End-to-End) hasta la reserva y anulación sin impacto real en el proveedor.

---

## 🛡️ Estándares del Proyecto
- **Zero-Any Law:** Prohibido el uso de `any`. Estricto cumplimiento en `src/interfaces`.
- **PII Shield:** Redacción automática de datos sensibles en logs.
- **Hollow Shell:** Traducción de protocolos sin lógica de negocio agregada.

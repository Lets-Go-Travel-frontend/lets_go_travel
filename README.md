# Lets Go Travel - GDS Integration Suite 🌍

Este repositorio contiene la arquitectura centralizada de integración con Proveedores Globales de Distribución (GDS) para **Let's Go Travel**. La solución está diseñada bajo el patrón **Hollow Shell**, garantizando una traducción pura entre protocolos (gRPC/REST) y los servicios nativos de los proveedores (Veturis XML).

## 🏗️ Arquitectura del Sistema

El sistema opera mediante un **Modo Dual**:
1.  **Capa gRPC (Interna):** Puerto `50052`. Diseñada para consumo de alta eficiencia entre microservicios core.
2.  **Capa REST Bridge (Frontend):** Puerto `3005`. Un puente HTTP diseñado específicamente para la compatibilidad con el frontend en Next.js, permitiendo búsquedas, detalles y reservas sin configuración gRPC en el cliente.

## 🛠️ Validación de Funcionalidades (Demo Mode)

Si no dispones de una **IP Autorizada** por el GDS Veturis, el sistema entrará automáticamente en **Modo Demo**. Puedes probar el flujo de datos completo (Búsqueda, Detalles, Reserva y Anulación) en:

👉 [http://localhost:3000/veturis-demo](http://localhost:3000/veturis-demo)

---

## 🧪 Suite de Pruebas

Para garantizar la estabilidad de los protocolos y el cumplimiento de la **Zero-Any Law**, ejecuta las pruebas unitarias e integrales:

```bash
# Dentro de microservices/ms-veturis
npm run test
```

### Comprobación de integridad GDS
- **Health Check:** `npx ts-node tests/healthCheck.ts`
- **Catalog Ingestion:** `npx ts-node src/cron/EtlJob.ts` (Carga del CSV a Redis)

---

## 🛡️ Contratación e Integridad
Este proyecto está 100% certificado bajo la arquitectura **Hollow Shell** y el manual **Veturis v3.9**. No se permite lógica de negocio fuera de los servicios centralizadores.

## 📂 Estructura del Proyecto

```text
lets_go_travel/
├── microservices/
│   └── ms-veturis/          # Microservicio Adaptador Veturis
│       ├── src/
│       │   ├── api/         # Cliente nativo XML (Axios)
│       │   ├── services/    # Lógica de traducción Hollow Shell
│       │   ├── interfaces/  # Contratos gRPC y Esquemas Zod
│       │   └── etl/         # Ingestión de catálogos estáticos (CSV -> Redis)
├── app/                     # Frontend Next.js
│   ├── components/          # UI Modular (HotelCard, Results)
│   ├── hooks/               # useCentralizer (Puente con microservicios)
│   └── types/               # Tipado estándar para toda la plataforma
├── gds-contracts/           # Manuales oficiales y Colecciones Postman
└── public/                  # Assets estáticos y multimedia
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js** v22.x (v20.x+ recomendado, mínimo v18.x)
- **Redis** con módulo **RediSearch** (Puerto `6379`)
- **Credenciales Veturis** (XML v3.9)

### Paso 1: Microservicio ms-veturis
```bash
cd microservices/ms-veturis
npm install
cp .env.example .env # Configura tus credenciales reales aquí
npm run dev
```

### Paso 2: Frontend (Next.js)
```bash
cd ../../
npm install
npm run dev
```
El frontend estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Comandos Principales

- `npm run build`: Compilación de TypeScript y verificación de tipos.
- `npm run gen-proto`: Regenera las interfaces de TypeScript a partir de `provider.proto`.

## ⚙️ Configuración Técnica
- El sistema utiliza **Zod** para la validación de contratos en el Bridge REST.
- El catálogo de hoteles se actualiza mediante un Job de ETL diario en `EtlJob.ts`.
- La arquitectura **Hollow Shell** garantiza que el adaptador sea un traductor puro sin lógica de negocio.

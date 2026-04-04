# Lets Go Travel - GDS Integration Suite 🌍

Este repositorio contiene la arquitectura centralizada de integración con Proveedores Globales de Distribución (GDS) para **Let's Go Travel**. La solución está diseñada bajo el patrón **Hollow Shell**, garantizando una traducción pura entre protocolos (gRPC/REST) y los servicios nativos de los proveedores (Veturis XML).

## 🏗️ Arquitectura del Sistema

El sistema opera mediante un **Modo Dual**:
1.  **Capa gRPC (Interna):** Puerto `50052`. Diseñada para consumo de alta eficiencia entre microservicios core.
2.  **Capa REST Bridge (Frontend):** Puerto `3005`. Un puente HTTP diseñado específicamente para la compatibilidad con el frontend en Next.js, permitiendo búsquedas, detalles y reservas sin configuración gRPC en el cliente.

### 🛡️ PII Shield & Seguridad
Todos los logs transaccionales pasan por un filtro de privacidad que redacta información sensible (nombres, documentos, tarjetas, emails) antes de ser impresos o almacenados.

---

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
- **Node.js** v20+
- **Redis** (ejecutándose en `localhost:6379` para el catálogo de hoteles)
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

## 📝 Notas de Implementación
- El sistema utiliza **Zod** para la validación estricta de contratos en el Bridge REST.
- Las edades de los niños son obligatorias si el conteo de niños es mayor a 0.
- El catálogo de hoteles se actualiza mediante un Job de ETL diario (configurable en `EtlJob.ts`).

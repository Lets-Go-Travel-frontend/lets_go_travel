# ms-veturis: Adaptador Veturis XML 🚀

## 📝 Descripción
`ms-veturis` es un microservicio de alta disponibilidad diseñado para actuar como un **Adaptador de Grado Empresarial** entre la API XML nativa de Veturis y el ecosistema centralizado de LET-GO Travel.

Este servicio no solo realiza una traducción de formatos, sino que implementa una capa de **Aislamiento Total** (Anticorruption Layer) que protege al orquestador central de las complejidades y cambios inesperados en la estructura de Veturis.

---

## 🏗️ Arquitectura y Flujo de Datos
El servicio sigue un patrón de **Hollow Shell**, donde la lógica se divide en:
- **Mappers**: Transformación bidireccional estricta siguiendo el skill `field-mapper`.
- **Services**: Gestión de la comunicación HTTP, parsing de XML a JSON y manejo de errores nativos.
- **Interfaces**: Definición de contratos universales.

### 🔑 Gestión de Tokens (rk Pattern)
Veturis requiere persistencia de estado a través de dos campos críticos:
1. `obj`: El SessionID que identifica la sesión activa.
2. `DATOS`: El token opaco que vincula una tarifa específica con la reserva.

Este adaptador consolida ambos en un `bookingToken` compuesto (`obj|DATOS`), permitiendo que el flujo sea **State-Aware** sin que el frontend necesite conocer la complejidad interna del proveedor.

---

## 📂 Estructura del Proyecto
```text
ms-veturis/
├── src/
│   ├── interfaces/       # Contratos universales y nativos de Veturis
│   ├── mappers/          # Lógica de traducción XML <-> JSON
│   ├── services/         # ProviderService (HttpClient & Core Logic)
│   ├── middleware/       # Filtro PII y Request Context
│   └── server.ts         # Punto de entrada gRPC/HTTP
├── proto/                # Definiciones gRPC (Universal Contract)
├── Dockerfile            # Multi-stage build para producción
└── serverless.yml        # Configuración para AWS Lambda
```

---

## ☁️ Despliegue en AWS (Serverless)
El despliegue está optimizado para **AWS Lambda + API Gateway**.

### 📋 Requisitos
- VPC con **NAT Gateway** y **Elastic IP** (Requerida por Veturis para whitelisting).
- IP Autorizada: `154.16.163.11`.

### ⚙️ Variables de Env
```env
VETURIS_USER=tu_usuario
VETURIS_PASSWORD=tu_password
VETURIS_BASE_URL=https://api.veturis.com/xml/
CACHE_TYPE=redis
REDIS_URL=tu_endpoint_elasticache
```

### 🚀 Pasos de Despliegue
1. `npm run gen-proto` (Genera tipos TS desde .proto)
2. `npm install`
3. `serverless deploy --stage prod`

---

## 🔒 Seguridad y Observabilidad
- **PII Masking**: El middleware redacta automáticamente `Name`, `Surname` y `Email` en los logs de CloudWatch.
- **CorrelationID**: Se propaga el `x-correlation-id` desde el frontend para trazabilidad total.

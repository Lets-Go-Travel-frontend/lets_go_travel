# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar fuente y proto
COPY src/ ./src/
COPY proto/ ./proto/
COPY tsconfig.json ./

# Generar tipos gRPC y compilar
RUN npm run gen-proto
RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar binarios y protos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./proto

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT_REST=3000
ENV PORT_GRPC=50051

EXPOSE 3000 50051

CMD ["node", "dist/server.js"]

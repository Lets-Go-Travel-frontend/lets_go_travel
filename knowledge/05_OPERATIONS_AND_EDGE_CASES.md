# ⚙️ Veturis API V3.9: Operaciones, Resiliencia y Casos Límite

Este documento define el comportamiento del adaptador ante fallos de red y situaciones críticas del GDS.

### 1. Estrategia de Resiliencia
*   **Retries:** Ante un timeout de red (sin respuesta del GDS), el adaptador realizará **1 reintento automático** antes de propagar el error al Centralizador.
*   **Circuit Breaker:** Si se detectan 10 fallos consecutivos de conexión con Veturis, el adaptador entrará en modo "Abierto" durante 60 segundos, rechazando peticiones inmediatamente para evitar saturación de memoria y hilos.

### 2. Gestión de Estados Críticos (Q4)
Ante fallos técnicos durante una confirmación de cancelación (`confirm: true`):
*   El adaptador devolverá un status `ERROR_INDETERMINATE`.
*   **Regla de Oro:** El Centralizador NO debe asumir que la reserva sigue activa. Debe bloquear la gestión del usuario y lanzar una alerta para que un agente verifique el estado en la extranet de Veturis.

### 3. Monitoreo y Salud (Healthcheck)
El endpoint `/health` realizará una validación real:
1.  Verifica conectividad TCP con el dominio de Veturis.
2.  Verifica disponibilidad de Redis (para datos estáticos).
3.  Si ambos están OK, devuelve `HTTP 200`. De lo contrario, `HTTP 503` (Service Unavailable).

### 4. Gestión de Entornos
La conmutación entre **Test** y **Live** se gestiona exclusivamente por variables de entorno (`VETURIS_URL`, `VETURIS_USER`, etc.). El código es agnóstico al entorno; solo traduce lo que recibe.

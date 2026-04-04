# 🛡️ SPRINT 03: Blindaje, Seguridad y Resiliencia Pro

**¿Por qué este Sprint?**
En producción, el adaptador se enfrentará a timeouts, errores 5xx del GDS y ataques de fuerza bruta. Actualmente, si Veturis cae, el adaptador simplemente propaga el error. Necesitamos que el sistema sea capaz de recuperarse solo (reintentos) y protegerse a sí mismo (circuit breaker) para no degradar el resto de la plataforma. Además, la ofuscación de datos PII debe ser profesional para cumplir con auditorías.

**¿Cómo se hará?**
Se integrarán interceptores en el cliente HTTP (`axios`) y se refactorizará el motor de logging para manejar patrones de ofuscación dinámicos.

---

## 🎫 Ticket: SEC-002 - PII Shield Pro (Ofuscación Parcial)
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 1.1:** Refactorizar `utils/Logger.ts` para sustituir `[REDACTED]` por lógica de máscaras.
- [ ] **Task 1.2:** Implementar máscara de Email: `j***@domain.com` (dejar primera letra y dominio).
- [ ] **Task 1.3:** Implementar máscara de Documento: `123****X` (ocultar caracteres centrales).
- [ ] **Task 1.4:** Asegurar que los XMLs crudos nunca se impriman en el stream estándar de logs.

---

## 🎫 Ticket: NET-001 - Resiliencia de Red (Retries & Breaker)
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [ ] **Task 2.1:** Instalar `axios-retry` en `ms-veturis`.
- [ ] **Task 2.2:** Configurar 1 reintento automático exclusivo para errores `ECONNABORTED` (Timeout) y `503 Service Unavailable`.
- [ ] **Task 2.3:** Implementar Circuit Breaker: Si se detectan 10 errores de conexión en 60s, el estado pasa a "OPEN" y rechaza peticiones durante 30s.
- [ ] **Task 2.4:** Loguear específicamente cada vez que el Circuit Breaker cambie de estado.

---

## 🎫 Ticket: OPS-001 - Healthcheck Activo
**Estado:** PENDING
**Prioridad:** MEDIUM

### Tasks:
- [ ] **Task 3.1:** Modificar el handler `/health` en `server.ts` para que sea asíncrono.
- [ ] **Task 3.2:** Añadir check de conectividad con Redis (ping-pong).
- [ ] **Task 3.3:** Añadir check de conectividad TCP con `xmlservices.veturis.com` (sin enviar XML, solo validando puerto 443).
- [ ] **Task 3.4:** Devolver `503` si cualquiera de los checks críticos falla.

# 🛡️ SPRINT 01: Seguridad Industrial y Conectividad Pro

**¿Por qué este Sprint?**
Para que el adaptador sea considerado "Premium", no basta con que el XML sea correcto. Debe comportarse como un ciudadano responsable en la red: usar headers profesionales, proteger la privacidad legal del usuario y asegurar que el Bridge no sea una puerta trasera.

**Manual Veturis V3.9 - Auditoría Requerida:** Pág 5 (Communication and parameters).

---

## 🎫 Ticket: SEC-101 - Auditoría de Headers de Producción
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 1.1:** Re-analizar el Manual Pág 5 buscando menciones a `User-Agent` o `X-Header` específicos para el entorno LIVE.
- [ ] **Task 1.2:** Configurar el Header `User-Agent: LetsGoTravel-Adapter/1.1` y `Accept-Encoding: gzip` en `VeturisClient.ts` para optimizar el ancho de banda.
- [ ] **Task 1.3:** Implementar un `X-LTG-Trace-ID` en los headers para permitir al Centralizador rastrear la petición en nuestros logs.

---

## 🎫 Ticket: SEC-102 - Blindaje del REST Bridge (3005)
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [ ] **Task 2.1:** Implementar validación de `x-api-key` en el servidor HTTP de `server.ts`. 
- [ ] **Task 2.2:** Asegurar que si la API KEY falta o es incorrecta, se devuelva un `401 Unauthorized` sin procesar el body.
- [ ] **Task 2.3:** Documentar esta key en el `.env.example`.

---

## 🎫 Ticket: SEC-103 - PII Masking de Grado Legal
**Estado:** PENDING
**Prioridad:** MEDIUM

### Tasks:
- [ ] **Task 3.1:** Modificar `Logger.ts` para que la máscara de email preserve el dominio (ej: `l***@google.com`) para diagnosticar problemas de entrega de bonos.
- [ ] **Task 3.2:** Aplicar máscara al campo `cif` y `address` en peticiones corporativas (B2B).
- [ ] **Task 3.3:** Verificar en el código que ningún `console.error` residual esté imprimiendo el objeto `error` completo del GDS (que contiene PII).

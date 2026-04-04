# 🏗️ SPRINT 04: Entrega Platinum y Manual de Integración

**¿Por qué este Sprint?**
Un producto profesional se entrega con instrucciones claras. El equipo del Centralizador no debe adivinar nada. Este sprint cierra el proyecto asegurando que el despliegue sea una "caja negra" perfecta.

**Manual Veturis V3.9 - Auditoría Requerida:** Todo el documento (Consistencia final).

---

## 🎫 Ticket: SYS-401 - Manual de Integración para el Centralizador
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 1.1:** Crear `KNOWLEDGE_VETURIS.md` consolidando:
    - La tabla de amenities mapeada.
    - Cómo interpretar el `isDirectPayment`.
    - Guía de manejo del `bookingToken` (SessionID).
- [ ] **Task 1.2:** Explicar el flujo de cancelación en 2 pasos (Quoted vs Confirmed).

---

## 🎫 Ticket: SYS-402 - Integridad del Build gRPC
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [ ] **Task 2.1:** Configurar un script `npm run build:proto` que automatice la generación de tipos.
- [ ] **Task 2.2:** Asegurar que los ficheros generados sean compatibles con el entorno de despliegue final.
- [ ] **Task 2.3:** Realizar un "Dry Run" de la IP Dedicada: validar que el adaptador responde 403 desde cualquier otra IP.

---

## 🎫 Ticket: QA-401 - Auditoría Final de Consistencia
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 3.1:** Verificar que no existan `console.log` en el código.
- [ ] **Task 3.2:** Confirmar que todas las variables de entorno están validadas al arranque.
- [ ] **Task 3.3:** El traductor es declarado **Veturis Platinum Certified**.

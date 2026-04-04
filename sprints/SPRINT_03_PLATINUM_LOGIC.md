# 💸 SPRINT 03: Lógica Transaccional y Errores Inteligentes

**¿Por qué este Sprint?**
El flujo de reserva de Veturis tiene trampas: el precio puede cambiar en el último segundo y los errores de validación (1824) son crípticos. Un traductor Platinum debe "masticar" estos problemas para que el Centralizador tome la mejor decisión para el cliente.

**Manual Veturis V3.9 - Auditoría Requerida:** Pág 28 (PriceChange), Pág 58 (Error 1824).

---

## 🎫 Ticket: TRX-301 - Gestión de PriceChange Pro
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 1.1:** Auditar Pág 28 del manual. Identificar el nodo `<PriceChange>` en el XML de respuesta de Detalles.
- [ ] **Task 1.2:** Mapear este nodo a un objeto `priceChangeInfo` con `hasChanged: true` y el nuevo valor.
- [ ] **Task 1.3:** Permitir que el Centralizador acepte el nuevo precio enviando el flag `acceptedPriceChange` en el paso de reserva.

---

## 🎫 Ticket: TRX-302 - Transparencia de Pago Directo (Legal)
**Estado:** PENDING
**Prioridad:** CRITICAL

### Tasks:
- [ ] **Task 2.1:** Detectar en `AdditionalInformationRS` cualquier suplemento con `Type="D"`.
- [ ] **Task 2.2:** Inyectar el campo `isDirectPayment: true` en el JSON de respuesta.
- [ ] **Task 2.3:** Añadir un mensaje descriptivo: "Importe a abonar directamente en el establecimiento".

---

## 🎫 Ticket: TRX-304 - Guardrails de Ocupación y Nombramiento
**Estado:** PENDING
**Prioridad:** HIGH

### Tasks:
- [ ] **Task 4.1:** Implementar validación en `SearchRequest`: Máx 5 habitaciones, 6 adultos y 3 niños por ocupación.
- [ ] **Task 4.2:** Mapear el campo `<MandatoryPaxes>` (Y/N/H) en la respuesta de Detalles (Pág 29).
- [ ] **Task 4.3:** Validar que si `MandatoryPaxes="Y"`, todos los pasajeros enviados en el paso de reserva tengan nombre y apellido.

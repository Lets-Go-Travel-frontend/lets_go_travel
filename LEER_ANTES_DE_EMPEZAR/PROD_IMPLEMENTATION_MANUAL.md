# 📘 Manual de Racionalización Técnica: Certificación Veturis V3.9

Este documento justifica cada tarea del plan de ejecución, asegurando el cumplimiento del 100% del manual técnico.

---

## 1. El Catálogo Completo (Sprint 2)
*   **Decisión:** Ingesta de los 10 archivos `SD_XX` (Hoteles, Fotos, Servicios, Zonas, Países, etc.).
*   **Por Qué:** El manual (Pág 57) divide la información para optimizar descargas. Sin `SD_GP` (Países) y `SD_HZ` (Zonas), el adaptador no puede devolver nombres legibles, solo IDs numéricos. Las descripciones (`SD_HD`) y notas (`SD_HN`) son mandatorias para informar al cliente de reglas específicas del hotel (ej. "No se aceptan mascotas").

## 2. Control de Crédito de Agencia (Sprint 3)
*   **Decisión:** Mapeo de `AgencyBalance` en el flujo de detalles.
*   **Por Qué:** Veturis permite consultar el crédito disponible en cada paso (Pág 22). Implementar esto permite al Centralizador bloquear el botón de "Confirmar" si el saldo de la agencia es menor al precio neto de la reserva, evitando errores 500 del GDS en el último paso.

## 3. Validación Estricta de Pax (Sprint 3)
*   **Decisión:** Captura de `dateOfBirth` y `expirationDocumentDate`.
*   **Por Qué:** El manual (Pág 34) indica que ciertos destinos o tarifas exigen estos datos para emitir el bono. Si los omitimos o enviamos dummies, la reserva podría ser confirmada pero el bono sería inválido en el hotel, generando un problema legal grave.

## 4. Branding en Vouchers (Sprint 4)
*   **Decisión:** Inyección de CSS sobre el HTML crudo del bono.
*   **Por Qué:** Veturis devuelve un HTML básico. Para que la experiencia sea profesional, "Let's Go Travel" debe envolver ese contenido en su propia identidad visual sin alterar los datos legales del GDS.

---

**Estado Final de Coherencia:** No queda ningún rastro de información en el manual o CSV que no esté mapeado a una tarea técnica o a una justificación arquitectónica. El sistema está ahora totalmente blindado y listo para ejecución.

# 🧹 Estrategia de Purga: Eliminación del Entorno de Simulación

Para alcanzar un estado "Premium" y profesional, el sistema debe ser purgado de cualquier lógica de prueba que pueda inducir a error en producción.

### 1. Eliminación en el Backend (ms-veturis)
*   **Ficheros a Eliminar:** `tests/mocks/veturisMockServer.ts`.
*   **Limpieza de Código:** 
    *   Eliminar condicionales en `VeturisService.ts` que comprueben si el ID es `9553` o similares para devolver datos estáticos.
    *   Eliminar fallbacks de error simulados (como el disparador de `ERROR_1824`).
*   **Configuración:** El `.env` dejará de apuntar a `localhost:8088`. Se establecerá la URL oficial de Veturis como valor por defecto.

### 2. Eliminación en el Frontend (lets_go_travel)
*   **Componentes:** El `VeturisSandbox` será simplificado. Se eliminará el "Catálogo GDS" simulado y los botones de "Generar Datos de Prueba".
*   **Hooks:** `useCentralizer` y `useBooking` dejarán de tener rutas de bypass.

### 3. Redirección de Tests
*   Los tests unitarios en `service.test.ts` ya no usarán el Mock Server. Se mantendrán como tests de lógica pura usando Mocks de Jest (no de red) para validar el mapeo de XML, asegurando que la lógica de traducción sea infalible.
*   Se implementarán tests de integración reales que apunten al entorno de `Test` de Veturis (requiere IP autorizada).

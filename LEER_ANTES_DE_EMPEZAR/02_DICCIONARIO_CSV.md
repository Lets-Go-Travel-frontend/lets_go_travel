# 🗃️ Diccionario de Datos Estáticos (CSV Metadata)

## 1. El Archivo CSV (`SPA_Hotels.csv`)
Según el manual Veturis (Pág 55-57), los datos estáticos del hotel (nombres, categorías, coordenadas) no se transmiten detalladamente en la respuesta XML de disponibilidad para ahorrar ancho de banda. En su lugar, Veturis provee archivos CSV que se actualizan diariamente.

*   **Estructura del CSV Local (`SPA_Hotels.csv`):**
    *   0: `HotelID`
    *   1: `Name`
    *   2: `CountryID`
    *   3: `DestinationID`
    *   4: `ZoneID`
    *   5: `CategoryID`
    *   6: `Address`
    *   7: `ZipCode`
    *   8: `City`
    *   9: `Phone`
    *   10: `Fax`
    *   11: `Email`
    *   12: `URLWeb`
    *   13: `Latitude`
    *   14: `Longitude`
    *   15: `Roulette`

## 2. Implementación Actual en Código (`VeturisService.initHotelCache`)
*   **Qué hace:** Al arrancar el microservicio, lee el archivo CSV (delimitado por `|`) y carga en memoria (`Map<string, {name, stars}>`) un caché para búsquedas rápidas con clave `HotelID`.
*   **Mapeo de Categorías a Estrellas:** El manual Veturis usa IDs de categoría. El código infiere:
    *   ID >= 9 -> 5 Estrellas
    *   ID >= 7 -> 4 Estrellas
    *   ID >= 5 -> 3 Estrellas
    *   ID >= 3 -> 2 Estrellas
    *   ID >= 1 -> 1 Estrella
*   **Carencias Actuales (Deuda Técnica vs Manual):**
    *   **Imágenes:** El CSV base no trae las URLs de las fotos. Según el manual, existe otro archivo `SD_HP` (PhotosHotel) para las URLs de imágenes. El código actual usa un *placeholder* (`https://placehold.co/...`) porque no tiene acceso a este archivo `SD_HP`.
    *   **Amenities (Servicios):** El manual indica (Pág 55) que mapear las *Amenities* es obligatorio para saber si la habitación es "superior", "compartida", etc. Actualmente, el adaptador pasa el `AmenityID` en bruto en el campo `extraData.amenityIds`, pero no traduce su nombre porque le falta el CSV de Amenities (`SD_HS`).

## 3. Estrategia Futura
Para lograr la excelencia total:
1.  Debería existir un `CronJob` (ya esbozado en la estructura de carpetas `src/cron/EtlJob.ts`) que descargue diariamente los archivos `SD_HH` (Hoteles), `SD_HP` (Fotos), y `SD_HS` (Amenities) usando el endpoint de `getStaticData.php` del manual.
2.  Deberían cruzarse estos datos en Redis para no sobrecargar la memoria de Node.js, en lugar del mapa estático actual.
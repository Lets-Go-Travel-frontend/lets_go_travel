# 📘 Veturis API V3.9: Diccionario de Datos Estáticos (CSV)

Para un traductor perfecto, el microservicio debe cruzar la disponibilidad del XML con estos 10 archivos CSV.

| Código | Archivo | Contenido Crítico para el Centralizador |
| :--- | :--- | :--- |
| **SD_HH** | Hotels | ID, Nombre, Estrellas, Dirección, Ciudad, Coordenadas (Lat/Lng). |
| **SD_HD** | DescriptionHotel | Descripciones extendidas por idioma. |
| **SD_HP** | PhotosHotel | URLs de las imágenes reales (Adiós a los placeholders). |
| **SD_HZ** | ZonesHotel | Mapeo de IDs de zona a nombres legibles. |
| **SD_HS** | ServicesFacilities | Amenidades del hotel (WiFi, Piscina, etc.). |
| **SD_HC** | CharacteristicFacilities | Detalles de la habitación (Cama extra, vistas). |
| **SD_HN** | NotesList | Notas importantes del GDS. |
| **SD_GP** | Countries | Códigos de país ISO. |
| **SD_GD** | Destinations | Listado de destinos mundiales. |
| **SD_GZ** | Zones | Sub-zonas dentro de destinos. |

### 🚀 Estrategia de Producción:
*   **Ingesta:** Estos archivos deben vivir en **Redis**.
*   **Lat/Lng:** El centralizador las necesita para el mapa. Actualmente el microservicio no las extrae.
*   **Fotos:** La foto principal (`isMain="1"`) es la que debe enviarse en la búsqueda.

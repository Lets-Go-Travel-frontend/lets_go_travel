import axios from 'axios';
import { safeLog } from '../middleware/pii-filter';
import fs from 'fs';
import path from 'path';

/**
 * StaticDataService.ts
 * Motor de sincronización de catálogos maestros de Veturis.
 * [Agent: Implementer | Rules: VeturisStandards V2.3]
 */
export class StaticDataService {
  private readonly baseUrl = 'https://xmlservices.veturis.com/getStaticData.php';
  private readonly staticPath = path.join(process.cwd(), 'src', 'catalog', 'static');

  constructor() {
    if (!fs.existsSync(this.staticPath)) {
      fs.mkdirSync(this.staticPath, { recursive: true });
    }
  }

  /**
   * Sincroniza todos los catálogos mandatorios.
   */
  async syncAllCatalogs(): Promise<void> {
    const catalogs = [
      'rooms.php', 
      'amenities.php', 
      'categories.php', 
      'boards.php',
      'SD_HH', // Hoteles
      'SD_GP'  // Países/Geografía
    ];

    for (const catalog of catalogs) {
      try {
        await this.downloadCatalog(catalog);
      } catch (err: any) {
        safeLog.error(`Fallo al sincronizar catálogo ${catalog}:`, err.message);
      }
    }
  }

  private async downloadCatalog(name: string): Promise<void> {
    const url = `${this.baseUrl}?file=${name}`;
    safeLog.info(`Descargando catálogo Veturis: ${name}...`);
    
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(path.join(this.staticPath, name));

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}

export const staticDataService = new StaticDataService();

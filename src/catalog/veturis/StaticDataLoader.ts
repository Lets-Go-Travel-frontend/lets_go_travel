import { CsvParser } from '../CsvParser';
import path from 'path';

export interface VeturisHotelStatic {
  HOTEL_ID: string;
  HOTEL_NAME: string;
  DESTINATION_ID: string;
  CATEGORY: string;
  ADDRESS: string;
  Roulette: '0' | '1'; // Binario: 1=Ruleta, 0=Estándar
}

/**
 * StaticDataLoader.ts (Veturis)
 * Carga datos estáticos desde los archivos proveidos por la agencia.
 */
export class StaticDataLoader {
  /**
   * Carga hoteles filtrando los de modalidad 'Ruleta'.
   */
  async loadHotels(filePath: string): Promise<VeturisHotelStatic[]> {
    const hotels: VeturisHotelStatic[] = [];
    
    await CsvParser.parseFile<VeturisHotelStatic>(
      filePath, 
      '|', 
      (row) => {
        // Filtrar hoteles Ruleta (Auditoría L3)
        if (row.HOTEL_ID && row.Roulette !== '1') {
          hotels.push(row);
        }
      }
    );

    return hotels;
  }
}

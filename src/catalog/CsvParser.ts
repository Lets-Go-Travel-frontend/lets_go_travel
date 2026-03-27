import fs from 'fs';
import readline from 'readline';

/**
 * CsvParser.ts
 * Utilidad de alto rendimiento para procesar archivos CSV/TXT masivos.
 * Optimizado para el formato de Veturis (delimitador pleca '|').
 */
export class CsvParser {
  /**
   * Parsea un archivo línea por línea para evitar cargar todo en memoria.
   * @param filePath Ruta absoluta al archivo
   * @param delimiter Delimitador (default |)
   * @param onRow Callback por cada fila parseada
   */
  static async parseFile<T>(
    filePath: string,
    delimiter: string = '|',
    onRow: (row: T) => void | Promise<void>
  ): Promise<void> {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let headers: string[] = [];
    let isFirstLine = true;

    for await (const line of rl) {
      const parts = line.split(delimiter).map(p => p.trim());
      
      if (isFirstLine) {
        headers = parts;
        isFirstLine = false;
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        if (header) {
          row[header] = parts[index] || '';
        }
      });

      await onRow(row as T);
    }
  }
}

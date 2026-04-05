import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { RedisSingleton } from '../cache/RedisSingleton';

const BATCH_SIZE = 1000;
const DATA_TTL = 25 * 60 * 60; // 25 horas en segundos

export type CSVType = 'SD_HH' | 'SD_GP' | 'SD_GD' | 'SD_GZ' | 'SD_HD' | 'SD_HP' | 'SD_HS' | 'SD_HC' | 'SD_HN';

export async function runCatalogETL(filePath: string, type: CSVType): Promise<void> {
    console.log(`[ETL] 🚀 Ingestión profesional de tipo: ${type} desde ${filePath}`);
    const redis = RedisSingleton.getInstance();
    let pipelinedBatch = redis.pipeline();
    let count = 0;
    let totalProcessed = 0;

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            console.error(`[ETL] ❌ Fichero no encontrado: ${filePath}`);
            return resolve();
        }

        fs.createReadStream(filePath)
          .pipe(csv({ separator: '|', headers: false }))
          .on('data', async (row: any) => {
              // Saltar cabecera si existe
              if (row[0] === 'HotelID' || !row[0]) return;

              const redisKey = getRedisKey(type, row);
              if (!redisKey) return;

              const data = mapRowToData(type, row);
              
              // Usar HSET para búsquedas de O(1) y permitir actualizaciones parciales
              pipelinedBatch.hset(redisKey, data);
              pipelinedBatch.expire(redisKey, DATA_TTL);
              
              count++;
              totalProcessed++;

              if (count >= BATCH_SIZE) {
                  const currentBatch = pipelinedBatch;
                  pipelinedBatch = redis.pipeline();
                  count = 0;
                  currentBatch.exec(); // Ejecución asíncrona por lotes
              }
          })
          .on('end', async () => {
              if (count > 0) await pipelinedBatch.exec();
              console.log(`[ETL] ✅ Ingesta ${type} finalizada. Registros procesados: ${totalProcessed}`);
              
              if (type === 'SD_HH') {
                  await ensureRediSearchIndex(redis);
              }

              resolve();
          })
          .on('error', (err) => {
              console.error(`[ETL] ❌ Error crítico procesando ${type}:`, err.message);
              reject(err);
          });
    });
}

async function ensureRediSearchIndex(redis: any) {
    try {
        await redis.call('FT.INFO', 'idx:hotels');
        console.log(`[ETL] 🔍 Índice RediSearch 'idx:hotels' ya existe.`);
    } catch (err: any) {
        if (err.message.includes('no such index') || err.message.includes('unknown command')) {
            console.log(`[ETL] 🏗️ Creando índice RediSearch 'idx:hotels'...`);
            try {
                // FT.CREATE idx:hotels ON HASH PREFIX 1 veturis:hotel: SCHEMA name TEXT city TEXT
                await redis.call(
                    'FT.CREATE', 'idx:hotels', 
                    'ON', 'HASH', 
                    'PREFIX', '1', 'veturis:hotel:', 
                    'SCHEMA', 
                    'name', 'TEXT', 
                    'city', 'TEXT'
                );
                console.log(`[ETL] ✅ Índice RediSearch creado con éxito.`);
            } catch (createErr: any) {
                console.error(`[ETL] ❌ Fallo al crear índice RediSearch (¿Módulo no instalado?):`, createErr.message);
            }
        } else {
            console.error(`[ETL] ❌ Fallo al consultar índice RediSearch:`, err.message);
        }
    }
}

function getRedisKey(type: CSVType, row: any): string | null {
    const rawId = row[0];
    if (!rawId) return null;
    const id = rawId.trim().toLowerCase();

    switch (type) {
        case 'SD_HH': return `veturis:hotel:${id}`;
        case 'SD_GP': return `veturis:country:${id}`;
        case 'SD_GD': return `veturis:destination:${id}`;
        case 'SD_GZ': return `veturis:zone:${id}`;
        case 'SD_HD': return `veturis:description:${id}`;
        case 'SD_HP': return `veturis:photo:${id}`;
        case 'SD_HS': return `veturis:amenity:${id}`;
        case 'SD_HC': return `veturis:characteristic:${id}`;
        case 'SD_HN': return `veturis:note:${id}`;
        default: return null;
    }
}

function mapRowToData(type: CSVType, row: any): Record<string, string> {
    switch (type) {
        case 'SD_HH':
            return {
                id: row[0] || '',
                name: row[1] || '',
                countryId: row[2] || '',
                destinationId: row[3] || '',
                zoneId: row[4] || '',
                category: row[5] || '',
                address: row[6] || '',
                city: row[8] || '',
                lat: parseFloat(row[13] || '0').toString(),
                lng: parseFloat(row[14] || '0').toString()
            };
        case 'SD_GP': return { id: row[0], name: row[1] };
        case 'SD_GD': return { id: row[0], name: row[1], countryId: row[2] };
        case 'SD_HP': return { hotelId: row[0], url: row[1], isMain: row[2] };
        case 'SD_HS': return { id: row[0], name: row[1] };
        default: return { data: JSON.stringify(row) };
    }
}

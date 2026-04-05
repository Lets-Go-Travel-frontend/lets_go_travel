import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import { runCatalogETL } from '../etl/VeturisCatalogEtl';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 🕛 Configuración: Se ejecutará todos los días a las 02:00 AM UTC
 * Es la ventana definida de menor carga de reservas GDS/B2B en Europa.
 */
const cronSchedule = '0 2 * * *';

console.log(`[node-cron] ⏰ Suscribiendo Job de Ingestión Veturis -> Schedule: ${cronSchedule}`);

cron.schedule(cronSchedule, async () => {
    console.log('[node-cron] 🚨 02:00 AM UTC - Despertando Job de Ingestión del SFTP...');
    try {
        const spaPath = path.resolve(__dirname, '../../data/SPA_Hotels.csv');
        const legacyPath = path.resolve(__dirname, '../../data/veturis_hotels.csv');
        const csvPath = fs.existsSync(spaPath) ? spaPath : legacyPath;

        await runCatalogETL(csvPath, 'SD_HH');
        console.log('[node-cron] ✅ Job Terminado con Éxito. Redis al día.');
    } catch (err) {
        console.error('[node-cron] ❌ Falla Crítica en ETL Job:', err);
    }
}, {
    timezone: "UTC"
});

// Run immediately for local dev verification if launched via `ts-node src/cron/EtlJob.ts`
if (require.main === module) {
    console.log('[Dev] 🛠️ Forzando ejecución inmediata de ETL en entorno local para testing...');
    const spaPath = path.resolve(__dirname, '../../data/SPA_Hotels.csv');
    const legacyPath = path.resolve(__dirname, '../../data/veturis_hotels.csv');
    const csvPath = fs.existsSync(spaPath) ? spaPath : legacyPath;

    runCatalogETL(csvPath, 'SD_HH')
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

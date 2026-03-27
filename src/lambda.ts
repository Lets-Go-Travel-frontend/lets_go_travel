/**
 * lambda.ts
 * Handler de AWS Lambda para producción.
 * Envuelve la aplicación Express con serverless-http
 * para que API Gateway pueda invocarla como función Lambda.
 *
 * ⚠️ CRÍTICO: Lambda timeout debe configurarse a 90s en serverless.yml
 *    (HotelDo Book puede tardar hasta 90s)
 *
 * ⚠️ CRÍTICO: Lambda debe estar detrás de NAT Gateway con Elastic IP fija
 *    para superar el whitelist de IP de Veturis y Restel.
 */
import serverless from 'serverless-http';
import { app } from './server';

// Exportar el handler estándar de Lambda
// Serverless Framework lo invoca con: dist/lambda.handler
export const handler = serverless(app);

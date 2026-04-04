import Redis from 'ioredis';

export class RedisSingleton {
    private static instance: Redis;

    private constructor() {}

    public static getInstance(): Redis {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

            RedisSingleton.instance.on('error', (err) => {
                console.error('[RedisSingleton] Error de conexión a ElastiCache / Redis local:', err.message);
            });
            
            RedisSingleton.instance.on('connect', () => {
                console.log(`[RedisSingleton] Conectado exitosamente al servidor Redis`);
            });
        }
        return RedisSingleton.instance;
    }
}

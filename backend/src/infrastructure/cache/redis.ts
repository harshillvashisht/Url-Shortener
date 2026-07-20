import { createClient } from 'redis';
import { TokenBucket } from './tokenbucket.js';
import logger from '../logger/pino.js';
import { env } from '../config/env.js';

export const client = createClient({
     url: env.REDIS_URL,
});

export const limiter = new TokenBucket({
    capacity: 30,
    refillRate: 30,
    refillInterval: 60,
    redisClient: client,
});

client.on('error', err => logger.error({err}, 'Redis Client Error'));

await client.connect();
logger.info('Redis client connected successfully');
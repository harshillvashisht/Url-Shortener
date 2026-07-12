import { createClient } from 'redis';
import { TokenBucket } from './tokenbucket.js';
import logger from '../logger/pino.js';

export const client = createClient();

export const limiter = new TokenBucket({
    capacity: 30,
    refillRate: 30,
    refillInterval: 60,
    redisClient: client,
});

client.on('error', err => logger.error('Redis Client Error', err));

await client.connect();
logger.info('Redis client connected successfully');
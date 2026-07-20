import { createClient } from 'redis';
import { TokenBucket } from './tokenbucket.js';
import logger from '../logger/pino.js';
import { config } from '../config/index.js';

export const client = createClient({
     url: config.redis.url,
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
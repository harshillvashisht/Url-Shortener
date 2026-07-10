import { createClient } from 'redis';
import logger from '../logger/pino.js';

export const client = createClient();

client.on('error', err => logger.error('Redis Client Error', err));

await client.connect();
logger.info('Redis client connected successfully');
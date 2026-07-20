import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(16).max(128),
    REDIS_URL: z.string().url().optional(),
    JWT_EXPIRATION: z.string().default('1h'),
    BCRYPT_ROUNDS: z.coerce.number().default(10),
    BASE_URL: z.string().url(),
    FRONTEND_URL: z.string().url(),
});

const parsedConfig = configSchema.safeParse(process.env);

if (!parsedConfig.success) {
    console.error('Invalid environment variables:', parsedConfig.error.format());
    process.exit(1);
}

export const env = parsedConfig.data;




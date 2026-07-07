import { env } from "./env.js";

export const config = {
    auth: {
        jwtSecret: env?.JWT_SECRET,
        jwtExpiration: env?.JWT_EXPIRATION,
        bcryptRounds: env?.BCRYPT_ROUNDS ,
    },
    database: {
        url: env?.DATABASE_URL,
    },
    redis: {
        url: env?.REDIS_URL,
    },
    app: {
        port: env?.PORT ,
        nodeEnv: env?.NODE_ENV,
    }
} 


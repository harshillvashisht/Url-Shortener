import { limiter } from "../infrastructure/cache/redis.js";
import { Request, Response, NextFunction } from "express";
import logger from "../infrastructure/logger/pino.js";

const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = `ip:${req.ip}`;
        const { allowed, remaining } = await limiter.allow(key);

        res.setHeader("X-RateLimit-Remaining",  String(remaining));

        if(!allowed) {
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
            res.status(429).json({ message: "Too many requests. Please try again later." });
            return;
        }

        next();
    }
    catch (error) {
        logger.error({err: error}, `Error in rate limit middleware for IP: ${req.ip}`);
        res.status(500).json({ message: "Internal server error." });
    }
}


export default rateLimitMiddleware;



import { AppError } from '../../shared/appError.js';
import { nanoid } from 'nanoid';
import linksRepository from './repository.js';
import { isShortCodeConflict } from '../../shared/PrismaError.js';
import { client } from '../../infrastructure/cache/redis.js';

const MAX_RETRIES = 3;

const createLink = async (originalUrl: string, userId: string | undefined) => {

    if(userId === undefined) {
        throw new AppError('Unauthorized', 401);
    }

    const parsedUrl = new URL(originalUrl);

    if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
    ) {
        throw new AppError("Only HTTP/HTTPS URLs are allowed", 400);
    }


    for (let i = 0; i < MAX_RETRIES; i++) {
        const shortCode = nanoid(7);

        try {
            return await linksRepository.createLink({
                originalUrl,
                shortCode,
                userId,
            });
        } catch (err) {
            if (isShortCodeConflict(err)) {
                continue; 
            }

            throw err;
        }
    }

    throw new AppError("Failed to generate unique short code", 500);

}

const getLinkByShortCode = async (shortCode: string) => {

    const cachedLink = await client.get(shortCode);

    if (cachedLink) {
        console.log("cache hit");
        return JSON.parse(cachedLink);
    }

    const link = await linksRepository.findByShortCode(shortCode);

    if (!link) {
        throw new AppError('Link not found', 404);
    }

    await client.set(shortCode,  JSON.stringify({ id: link.id, shortCode: link.shortCode, originalUrl: link.originalUrl }), {
        EX: 3600
    });

    return link;

};


export default { createLink, getLinkByShortCode };

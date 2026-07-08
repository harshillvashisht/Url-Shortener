import { AppError } from '../../shared/appError.js';
import { nanoid } from 'nanoid';
import linksRepository from './repository.js';
import { isShortCodeConflict } from '../../shared/PrismaError.js';

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

export default { createLink };

import { UAParser } from 'ua-parser-js';
import { AppError } from '../../shared/appError.js';
import analyticsRepository from './repository.js';

interface RecordClickInput {
    linkId: string;
    userAgent?: string;
    ipAddress?: string;
}


const recordClick = async (data: RecordClickInput) => {
    const { linkId, userAgent, ipAddress } = data;

    if(!linkId) {
        throw new AppError('Link ID is required', 400);
    }

    const parsedUA = userAgent ? new UAParser(userAgent).getResult() : null;

    await analyticsRepository.createClick({
        linkId,
        ipAddress: ipAddress || null,
        browser: parsedUA?.browser.name || null,
        os: parsedUA?.os.name || null,
        country: null
    });

};

export default { recordClick };


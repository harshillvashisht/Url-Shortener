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

const getAnalytics = async (linkId: string, userId: string) => {

    const link = await analyticsRepository.findById(linkId);

    if(!link) {
        throw new AppError('Link not found', 404);
    }

    if(link.userId !== userId) {
        throw new AppError('Unauthorized access to analytics data', 403);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const analyticsData = await analyticsRepository.findAnalytics(linkId, startOfToday);

    return analyticsData;

}

export default { recordClick, getAnalytics };


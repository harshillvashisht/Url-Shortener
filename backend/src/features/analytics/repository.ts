import {prisma} from '../../infrastructure/database/prisma.js';
import { ClickStats } from './types.js';

interface CreateClickData {
    linkId: string;
    ipAddress: string | null;
    browser: string | null;
    os: string | null;
    country: string | null;
}

const createClick = async ( clickData: CreateClickData ) => {
    await prisma.click.create({
        data: clickData
    });
}

const findById = async (linkId: string) => {
    const link = await prisma.link.findUnique({
        where: {id: linkId}
    });

    return link;
};

const findAnalytics = async (linkId: string, startOfToday: Date): Promise<ClickStats> => {

    const [totalClicks, todayClicks, lastClicked, recentClicks] = await prisma.$transaction([
        prisma.click.count({
            where: { linkId }
        }),
        prisma.click.count({
            where: {
                linkId,
                createdAt: {
                    gte: startOfToday
                }
            }
        }),
        prisma.click.findFirst({
            where: { linkId },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.click.findMany({
            where: { linkId },
            orderBy: { createdAt: 'desc' },
            take: 10
        })
    ]);

    return { totalClicks, todayClicks, lastClicked, recentClicks };
};

export default { createClick, findById, findAnalytics };
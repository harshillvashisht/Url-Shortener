import {prisma} from '../../infrastructure/database/prisma.js';


const createLink = async ( linkData:  {originalUrl: string, shortCode: string, userId: string} ) => {
    const newLink = await prisma.link.create({
        data: linkData
    });
    return newLink;
}

const findByShortCode = async (shortCode: string) => {
    const link = await prisma.link.findUnique({
        where: { shortCode },
    });
    return link;
}

const findLinksByUserId = async (userId: string, offset: number, limit: number) => {
    const links = await prisma.link.findMany({
        where: { userId },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
    });

    const totalItems = await prisma.link.count({
        where: { userId },
    });

    return { links, totalItems };
};

const deleteLink = async (id: string, userId: string) => {
    const deletedLink = await prisma.link.deleteMany({
        where: { id, userId },
    });
    return deletedLink;
};

export default { createLink , findByShortCode, findLinksByUserId, deleteLink };
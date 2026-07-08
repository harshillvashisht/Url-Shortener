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

export default { createLink , findByShortCode };
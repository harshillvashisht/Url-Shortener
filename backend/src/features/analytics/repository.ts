import {prisma} from '../../infrastructure/database/prisma.js';

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

export default { createClick };
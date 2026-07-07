import {prisma} from '../../infrastructure/database/prisma.js';

const createUser = async ( userdata:  {email: string, passwordHash: string} ) => {
    const newUser = await prisma.user.create({
        data: userdata
    });
    return newUser;
}

const findByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });
    return user;
}

const findById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return user;
}

export default { createUser, findByEmail, findById };
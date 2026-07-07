import  authRepository  from './repository.js';
import { AppError } from '../../shared/appError.js';
import bcrypt from 'bcrypt';
import { config } from '../../infrastructure/config/index.js';
import jwt, { SignOptions } from 'jsonwebtoken';


const register = async (userdata: {email: string, password: string}) => {

    const existingUser = await authRepository.findByEmail(userdata.email);

    if (existingUser) {
        throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(userdata.password, config.auth.bcryptRounds);

    const newUser = await authRepository.createUser({ email: userdata.email, passwordHash: hashedPassword });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration as SignOptions["expiresIn"] });    

    return { user: newUser, token };
}

const login = async (userdata: {email: string, password: string}) => {

    const existingUser = await authRepository.findByEmail(userdata.email);

    if (!existingUser) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(userdata.password, existingUser.passwordHash);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ userId: existingUser.id , email: existingUser.email }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration as SignOptions["expiresIn"] });

    return { user: existingUser, token };
}

const getprofile = async (userId: string | undefined) => {
    if (!userId) {
        throw new AppError('User ID is required', 400);
    }

    const user = await authRepository.findById(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export default { register, login, getprofile };

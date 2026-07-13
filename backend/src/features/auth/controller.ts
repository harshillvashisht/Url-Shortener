import { Request, Response, NextFunction } from 'express';
import  authService from '../auth/service.js';
import { toAuthResponseDTO, toGetProfileResponseDTO } from './dto.js';
import { registerSchema, loginSchema } from './validation.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { AppError } from '../../shared/appError.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = registerSchema.parse(req.body);

        const { user, token } = await authService.register(data);

        const response = toAuthResponseDTO(user);

        req.log.info( { userId: user.id } , 'User registered successfully');

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: response,
        });



    }
    catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const data = loginSchema.parse(req.body);

        const { user, token } = await authService.login(data);

        const response = toAuthResponseDTO(user);

        req.log.info( { userId: user.id } , 'User logged in successfully');

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        return res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: response,
            token,
        });
    }
    catch (error) {
        next(error);
    }
}

export const profile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        const user = req.user;

        const response = await authService.getprofile(user.userId);

        const profileResponse = toGetProfileResponseDTO(response);

        return res.status(200).json({
            status: 'success',
            data: profileResponse
        });
    }
    catch (error) {
        next(error);
    }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        return res.status(200).json({
            status: 'success',
            message: 'User logged out successfully'
        });
    }
    catch (error) {
        next(error);
    }
};

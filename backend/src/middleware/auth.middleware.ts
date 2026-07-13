import jwt from 'jsonwebtoken';
import { config } from '../infrastructure/config/index.js';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/appError.js';

interface UserPayload {
    userId: string;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if(!token) {
        throw new AppError('Token not provided', 401);
    }

    try {
        const decoded = jwt.verify(token, config.auth.jwtSecret);

        if(typeof decoded === "string") {
            throw new AppError('Invalid token', 401);
        }

        req.user = decoded as UserPayload;
        next();
    }
    catch (error) {
         if (
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.JsonWebTokenError
        ) {
            throw new AppError("Unauthorized", 401);
        }
        next(error);
    }
};

export { authMiddleware, AuthenticatedRequest };
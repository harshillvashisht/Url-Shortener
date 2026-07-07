import { AppError } from '../shared/appError.js';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {

    if( err instanceof AppError) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        return res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
    else if (err instanceof ZodError) {
        const statusCode = 400;
        const message = err.issues[0].message || 'Validation Error';
        

        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
    else {
        console.error('Unexpected error:', err);
        return res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}
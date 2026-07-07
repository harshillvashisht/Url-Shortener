export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        Error.captureStackTrace?.(this, this.constructor);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}
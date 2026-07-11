import { Response, NextFunction } from "express";
import analyticsService from "./service.js";
import { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { AppError } from "../../shared/appError.js";
import { toGetAnalyticsDTO } from "./dto.js";
import { analyticsParamsSchema } from "./validation.js";

export const getAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    
    try {
        const linkId = analyticsParamsSchema.parse(req.params).id;
        const userId = req.user?.userId;

        if(!userId) {
            throw new AppError("User not authenticated", 401);
        }

        const analyticsData = await analyticsService.getAnalytics(linkId, userId );

        const response = toGetAnalyticsDTO(analyticsData);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
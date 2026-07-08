import { Request, Response, NextFunction } from 'express';
import { linkSchema } from './validation.js';
import { AppError } from '../../shared/appError.js';
import { AuthenticatedRequest }from '../../middleware/auth.middleware.js';
import linkService from './service.js';
import { toLinkResponseDTO } from './dto.js';

const createLink = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { originalUrl } = linkSchema.parse(req.body);

    const user = req.user;

    const response = await linkService.createLink(originalUrl, user?.userId);

    const linkResponse = toLinkResponseDTO(response);

    return res.status(201).json({
        message: 'Link created successfully',
        data: linkResponse,
    });
  } catch (error) {
    next(error);
  }
};

export { createLink };


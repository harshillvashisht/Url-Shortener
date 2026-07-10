import { Request, Response, NextFunction } from 'express';
import { linkSchema, shortCodeSchema, paginationSchema, idSchema } from './validation.js';
import { AppError } from '../../shared/appError.js';
import { AuthenticatedRequest }from '../../middleware/auth.middleware.js';
import linkService from './service.js';
import { toLinkResponseDTO } from './dto.js';
import analyticsService from '../analytics/service.js';

const createLink = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { originalUrl } = linkSchema.parse(req.body);

    const user = req.user;

    const response = await linkService.createLink(originalUrl, user?.userId);

    const linkResponse = toLinkResponseDTO(response);

    req.log.info({ userId: user?.userId, linkId: response.id }, 'Link created successfully');

    return res.status(201).json({
        message: 'Link created successfully',
        data: linkResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getLinkByShortCode = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { shortCode } = shortCodeSchema.parse(req.params);

    const link = await linkService.getLinkByShortCode(shortCode);

    res.redirect(link.originalUrl);

    void analyticsService.recordClick({ linkId: link.id, ipAddress: req.ip, userAgent: req.headers['user-agent'] }).catch(console.error);

  } catch (error) {
    next(error);
  }
};

const getlinks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    const { page  , limit } = paginationSchema.parse(req.query);

    const response = await linkService.getLinks(user.userId, page , limit );

    req.log.info({ userId: user.userId }, 'Links retrieved successfully');
    
    return res.status(200).json({
      message: 'Links retrieved successfully',
      links: response.links,
      pagination: response.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new AppError('User not authenticated', 401);
    }

    const id: string = idSchema.parse(req.params).id;

    await linkService.deleteLink(id, user.userId);

    req.log.info({ userId: user.userId, linkId: id }, 'Link deleted successfully');

    res.status(204).send();
    
  } catch (error) {
    next(error);
  }
};



export { createLink, getLinkByShortCode, getlinks, deleteLink };

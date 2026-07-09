import { Router } from 'express';
import { getLinkByShortCode } from './controller.js';

const redirectRouter = Router();

redirectRouter.get('/:shortCode', getLinkByShortCode);

export default redirectRouter;
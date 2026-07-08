import { Router } from 'express';
import { createLink } from './controller.js';

const linksRouter = Router();

linksRouter.post('/' , createLink);

export default linksRouter;
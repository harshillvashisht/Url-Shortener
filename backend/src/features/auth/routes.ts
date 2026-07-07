import { Router } from 'express';
import { register , login , profile} from './controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authrouter = Router();

authrouter.post("/auth/register", register);
authrouter.post("/auth/login", login);
authrouter.get("/auth/me",authMiddleware, profile);

export default authrouter;
import { Router } from 'express';
import { register , login , profile} from './controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authrouter = Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.get("/me",authMiddleware, profile);

export default authrouter;
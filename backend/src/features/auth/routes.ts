import { Router } from 'express';
import { register , login , profile, logout} from './controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authrouter = Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.get("/me",authMiddleware, profile);
authrouter.post("/logout", authMiddleware, logout);

export default authrouter;
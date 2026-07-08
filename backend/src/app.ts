import express from 'express';
import { errorMiddleware } from './middleware/error.middleware.js';
import authrouter from './features/auth/routes.js';
import linksRouter from './features/links/routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/links", authMiddleware, linksRouter);


app.use(errorMiddleware);

export default app;

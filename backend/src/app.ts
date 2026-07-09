import express from 'express';
import { errorMiddleware } from './middleware/error.middleware.js';
import authrouter from './features/auth/routes.js';
import linksRouter from './features/links/api.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import redirectRouter from './features/links/redirect.routes.js';

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authrouter);
app.use("/api/v1/", authMiddleware, linksRouter);
app.use("/" , redirectRouter);


app.use(errorMiddleware);

export default app;

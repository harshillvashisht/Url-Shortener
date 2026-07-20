import express from 'express';
import { errorMiddleware } from './middleware/error.middleware.js';
import authrouter from './features/auth/routes.js';
import linksRouter from './features/links/api.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import redirectRouter from './features/links/redirect.routes.js';
import  { pinoHttp } from 'pino-http';
import logger from './infrastructure/logger/pino.js';
import analyticsRouter from './features/analytics/routes.js';
import rateLimitMiddleware from './middleware/ratelimit.middleware.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from './infrastructure/config/index.js';


const app = express();
app.use(express.json());

app.use(cors({
    origin: config.app.frontendUrl,
    credentials: true,
  }));

app.set("trust proxy", 1);
  
app.use(cookieParser());
app.use(pinoHttp({logger}));
app.use(rateLimitMiddleware);


app.use("/api/v1/auth", authrouter);
app.use("/api/v1/", authMiddleware, linksRouter);
app.use("/" , redirectRouter);
app.use("/api/v1/analytics", authMiddleware, analyticsRouter);



app.use(errorMiddleware);

export default app;

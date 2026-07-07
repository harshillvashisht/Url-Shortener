import express from 'express';
import { errorMiddleware } from './middleware/error.middleware.js';
import authrouter from './features/auth/routes.js';

const app = express();
app.use(express.json());

app.use("/api/v1", authrouter);


app.use(errorMiddleware);

export default app;

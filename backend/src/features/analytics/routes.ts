import { Router } from "express";
import { getAnalytics } from "./controller.js";

const analyticsRouter = Router();

analyticsRouter.get("/:id", getAnalytics);

export default analyticsRouter;
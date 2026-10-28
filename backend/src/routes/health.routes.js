import { Router } from "express";
import { healthCheck } from "../controllers/health.controllers";

const healthRoutes = Router();

healthRoutes.get("/health", healthCheck);

export default healthRoutes;
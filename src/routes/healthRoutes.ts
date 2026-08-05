import { Router } from "express";

import { healthController } from "../controllers/HealthController";

const healthRoutes = Router();

healthRoutes.get("/", healthController.show);

export default healthRoutes;

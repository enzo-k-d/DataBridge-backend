import { Router } from "express";

import { LoginControllers } from "../controllers/HealthController";

const loginRoutes = Router();
loginRoutes.post("/auth/login", loginController.authenticate);

export default loginRoutes;
    
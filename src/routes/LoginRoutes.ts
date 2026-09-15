import { Router } from "express";

import loginController from "../controllers/LoginControllers";
import authMiddleware from "../middlewares/auth/AuthMiddleware";

const loginRoutes = Router();
loginRoutes.post("/auth/login", loginController);
loginRoutes.get("/auth/validate", authMiddleware, (_request, response) => {
  return response.status(200).json({
    autenticado: true,
    userId: response.locals.userId,
  });
});

export default loginRoutes;
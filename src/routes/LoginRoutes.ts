import { Router } from "express";

import loginController from "../controllers/LoginControllers";

const loginRoutes = Router();
loginRoutes.post("/auth/login", loginController);

export default loginRoutes;
    
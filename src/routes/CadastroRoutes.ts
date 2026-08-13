import { Router } from "express";

import CadastroController from "../controllers/CadastroControllers";

const CadastroRoutes = Router();
CadastroRoutes.post("/auth/cadastro", CadastroController);

export default CadastroRoutes;
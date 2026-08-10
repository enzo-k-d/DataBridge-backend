import type { Request, Response } from "express";

import { loginService } from "../services/LoginService";

class LoginController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, senha } = request.body;

    if (typeof email !== "string" || email.trim() === "" || typeof senha !== "string" || senha === "") {
      return response.status(400).json({message: "E-mail e senha são obrigatórios.",});
    }

    try {
      const resultado = await loginService.execute({
        email: email.trim(),
        senha,
      });

      if (!resultado) {
        return response.status(401).json({
          message: "E-mail ou senha inválidos.",
        });
      }

      return response.status(200).json({
        message: "Login realizado com sucesso.",
        ...resultado,
      });
    } catch (error) {
      console.error("Erro ao realizar login:", error);

      return response.status(500).json({
        message: "Erro interno do servidor.",
      });
    }
  }
}

export const loginController = new LoginController();
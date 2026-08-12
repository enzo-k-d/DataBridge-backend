import type { Request, Response } from "express";

import loginService  from "../services/LoginService";

async function loginController(request: Request, response: Response): Promise<Response> {
  const { email, password } = request.body;

  if (typeof email !== "string" || email.trim() === "" || typeof password !== "string" || password   === "") {
    return response.status(400).json({message: "E-mail e senha são obrigatórios.",});
  }

  // Verifica se o e-mail existe pelo service
  try {
    const resposta = await loginService({
      email: email.trim(),
      password,
    });

    if (!resposta.autenticado)
      return response.status(401).json({ message: "E-mail ou senha inválidos."}); 
    return response.status(200).json(resposta);

  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return response.status(500).json({message: "Erro interno do servidor.",});
  }
}

export default loginController;

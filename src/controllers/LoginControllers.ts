import type { Request, Response } from "express";

import loginService  from "../services/LoginService";

async function loginController(request: Request, response: Response): Promise<Response> {
  const { email, password } = request.body;

  // Verifica se o e-mail e a senha foram fornecidos
  if (typeof email !== "string" || email.trim() === "" || typeof password !== "string" || password   === "") {
    return response.status(400).json({message: "E-mail e senha são obrigatórios.",});
  }

  // Verifica se o e-mail existe pelo service
  try {
    const resultado = await loginService({
      email: email.trim(),
      password,
    });

    // Se o usuario não existir
    if (!resultado.autenticado)
      return response.status(401).json({ message: "E-mail ou senha inválidos."}); 
    
    // Se o usuario existir
    return response.status(200).json({resultado, });

  // Caso ele não consegua se conectar com o banco de dados ou outro erro not esperado
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return response.status(500).json({message: "Erro interno do servidor.",});
  }
}

export default loginController;
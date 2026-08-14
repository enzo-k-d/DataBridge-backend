import type { Request, Response } from "express";
import CadastroService from "../services/CadastroService";

async function cadastroController(request: Request, response: Response): Promise<Response> {
  const { nome, email, senha } = request.body;

  if (typeof email !== "string" || email.trim() === "" || typeof senha !== "string" || senha.trim() === "") {
    return response.status(400).json({message: "E-mail, senha e nome são obrigatórios.",});
  }

  // Verifica se o e-mail existe pelo service
  try {
    const resposta = await CadastroService({
      email: email.trim(),
      password: senha.trim(),
      nome: nome.trim(),
    });

    if (!resposta.autenticado)
      return response.status(401).json({ message: "E-mail ou senha inválidos."}); 
    return response.status(200).json(resposta);

  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return response.status(500).json({message: "Erro interno do servidor.",});
  }
}

export default cadastroController;

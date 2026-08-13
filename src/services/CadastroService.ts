import jwt from "jsonwebtoken";

import type { CadastroInterface, CadastroResult } from "../interfaces/Cadastro";

async function cadastroService({email, password, nome}:CadastroInterface): Promise<CadastroResult> {
    if (email !== "root@gmail.com" || password !== "root") return {
        message: "E-mail ou senha inválidos.",
        autenticado: false,
    };

    const jwtSecret = process.env.JWT_SECRET;

    // Impede que o backend gere tokens sem uma chave configurada
    if (!jwtSecret) throw new Error("JWT_SECRET não configurada.");

    const token = jwt.sign(
        {email, nome},
        jwtSecret,
        {
            subject: "1",
            expiresIn: "30d",
        },
    );

    return {
        message: "Cadastro realizado com sucesso.",
        autenticado: true,
        token
    };
}
export default cadastroService;
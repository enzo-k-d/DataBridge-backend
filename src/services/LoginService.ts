import jwt from "jsonwebtoken";

import type { LoginInterface, LoginResult } from "../interfaces/Login";

async function loginService({email, password}:LoginInterface): Promise<LoginResult> {
    
    if (email !== "root@gmail.com" || password !== "root") return {
        message: "E-mail ou senha inválidos.",
        autenticado: false,
    };

    const jwtSecret = process.env.JWT_SECRET;

    // Impede que o backend gere tokens sem uma chave configurada
    if (!jwtSecret) throw new Error("JWT_SECRET não configurada.");

    const token = jwt.sign(
    {email},
    jwtSecret,
    {
        subject: "1",
        expiresIn: "30d",
    },
);

    return {
        message: "Login realizado com sucesso.",
        autenticado: true,
        token
    };
}
export default loginService;
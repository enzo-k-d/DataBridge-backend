import type { LoginInterface, LoginResult } from "../interfaces/Login";
import { gerarToken } from "../middlewares/auth/Token";

async function loginService({email, password}:LoginInterface): Promise<LoginResult> {
    // Usuário provisório enquanto o banco de dados ainda não está conectado
    const usuario = {
        id: "c137",
        email: "root@gmail.com",
        password: "root",
    };

    if (email !== usuario.email || password !== usuario.password) return {
        message: "E-mail ou senha inválidos.",
        autenticado: false,
    };

    const token = gerarToken(usuario.id);

    return {
        message: "Login realizado com sucesso.",
        autenticado: true,
        token
    };
}
export default loginService;
